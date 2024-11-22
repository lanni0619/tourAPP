const mongoose = require('mongoose');
const slugify = require('slugify');
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

// A) Schema.prototype.index()
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// B) Virtual Properties
tourSchema.virtual('durationWeek').get(function () {
  return (this.duration / 7).toFixed(2);
});

// B1) Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  // connecting foreign & local field
  foreignField: 'tour',
  localField: '_id',
});

// C) Middleware
// C1) Document Middleware - pre save hook
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

// C2) Document Middleware - post save hook
tourSchema.post('save', function (doc, next) {
  // do something after document be saved
  next();
});

// C3) Query Middleware - pre hook
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.startTime = Date.now();

  // Populate guides fields with all kind of "find" query method

  this.populate({
    path: 'guides',
    select: '-passwordChangedAt -__v',
  });

  next();
});

// C4) Query Middleware - post hook
tourSchema.post(/^find/, function (docs, next) {
  // Calculate how much query time costed
  // console.log(`Query took ${Date.now() - this.startTime} milliseconds!`);
  next();
});

// C5) Aggregation Middleware
// this point to current aggregation Object
// It's will affect pipeline when call $geoNear

tourSchema.pre('aggregate', function (next) {
  // Except the secretTour
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
