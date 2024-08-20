const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review must have content!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a author.'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
  },
  {
    // Let virtual properties always show up whenever there is an output
    toObject: { virtuals: true },
    toJSON: { tirtuals: true },
  },
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// static function
reviewSchema.statics.calAvgRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour', // separate docs by the group key
        nRatings: { $sum: 1 },
        avgRatings: { $avg: '$rating' },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRatings,
    ratingsAverage: stats[0].avgRatings,
  });
};

// document mddiewares - calAvgRatings after saved doc
reviewSchema.post('save', function () {
  // Review model is not yet define
  this.constructor.calAvgRatings(this.tour);
});

// Query Middlewares - populate user before query
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// Query Middlewares - calAvgRatings after update & delete
reviewSchema.post(/^findOneAnd/, async function (docs) {
  // console.log({ docs });
  if (docs) docs.constructor.calAvgRatings(docs.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
