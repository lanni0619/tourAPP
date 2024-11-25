const mongoose = require('mongoose');
const slugify = require('slugify');
const cacheStrategy = require('../utils/cacheStrategy');

// const validator = require('validator');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'Must less or equal then 40 characters'],
      minlength: [5, 'Must more or equal then 5 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (value) => Math.round(value * 10) / 10, // 4.6666*10, 46.666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // only work when create document
          // this only points to current doc on new document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    // GeoJSON Object
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    // sub-document
    // Two notations: arrays of subdocuments & single nested subdocuments
    // each document has own id
    // they are saved whenever their top-level parent document is saved.
    // https://mongoosejs.com/docs/subdocs.html
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        description: String,
        day: Number,
      },
    ],
    // child referencing
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ==================== Schema.prototype.index()
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// ==================== Virtual Properties
tourSchema.virtual('durationWeek').get(function () {
  return (this.duration / 7).toFixed(2);
});

// Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  // connecting foreign & local field
  foreignField: 'tour',
  localField: '_id',
});

// C) ==================== Middleware
// Document Middleware
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Practice - Embedding(Denormalization)
// Copy & paste guide data to the Tour

// tourSchema.pre('save', async function (next) {
//   // do something before document be saved
//   const guidesPromise = this.guides.map((id) => {
//     // query obejct to Promise
//     return User.findById(id).exec();
//   });
//   this.guides = await Promise.all(guidesPromise);
//   next();
// });

// Document Middleware
tourSchema.post('save', async function (doc, next) {
  // When tour is added, clear statistic cache
  await cacheStrategy.clearGetTop3busyMonth();
  next();
});

// Query Middleware
tourSchema.pre(/^find/, function (next) {
  // 1) Filter out secretTour
  // Post findOneAnd can not be trigged if call this.find
  // this.find({ secretTour: { $ne: true } });

  // 2) Populate guides fields
  this.populate({
    path: 'guides',
    select: '-passwordChangedAt -__v',
  });
  next();
});

tourSchema.post(/^findOneAnd/, async function () {
  // When tour is updated or deleted, clear statistic cache
  await cacheStrategy.clearGetTop3busyMonth();
});

// Aggregation Middleware
// Add a $match state to the beginning of each pipeline.
// Except the secretTour or soft delete user
// https://mongoosejs.com/docs/middleware.html#aggregate

tourSchema.pre('aggregate', function (next) {
  // this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// ==================== Static function
tourSchema.statics.groupByDifficulty = async function () {
  return await this.aggregate([
    {
      // group stage
      $group: {
        // _id is used to classify data. null means all data
        // fieldName: { operator: '$fieldName' }
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
      },
    },
    {
      $project: {
        numTours: true,
        tours: true,
        numRating: true,
        avgRating: { $round: ['$avgRating', 1] },
      },
    },
    {
      $sort: { numRating: -1 },
    },
  ]);
};

tourSchema.statics.getTop3busyMonth = async function (year) {
  return await this.aggregate([
    {
      // Deconstructs an array field from the input documents to output a document for each element.
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTour: { $sum: 1 },
        tour: { $push: '$name' },
      },
    },
    {
      $sort: { numTour: -1 },
    },
    {
      $limit: 3,
    },
  ]);
};

tourSchema.statics.getPriceBucket = async function () {
  return await this.aggregate([
    {
      $bucket: {
        groupBy: '$price',
        boundaries: [0, 500, 1000, 1500, 2000],
        default: '2000+',
        output: {
          tourCount: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
    },
  ]);
};

tourSchema.statics.getGuideLoading = async function () {
  return await this.aggregate([
    {
      $unwind: '$guides',
    },
    {
      $lookup: {
        from: 'users', // 連接的集合
        localField: 'guides', // reviews.user 存的 user id
        foreignField: '_id', // users 集合的 id
        as: 'userDetails',
      },
    },
    { $unwind: '$userDetails' },
    {
      $group: {
        _id: '$userDetails.name',
        avgRating: { $avg: '$ratingsAverage' },
        caseNums: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $set: {
        avgRating: { $round: ['$avgRating', 3] },
      },
    },
    {
      $sort: { avgRating: 1 },
    },
  ]);
};

tourSchema.statics.getToursWithin = async function (distance, latlng, unit) {
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng)
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng . ',
        400,
      ),
    );
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  const tours = await this.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }, // lng first in mongodb
  });
  return tours;
};

tourSchema.statics.getDistances = async function (latlng, unit) {
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng)
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng . ',
        400,
      ),
    );
  const multiplier = unit === 'mi' ? 0.000621371192 : 0.001;
  const distances = await this.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  return distances;
};

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
