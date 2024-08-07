const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

// Get All Reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
  // 1) Get reviews from db
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

  // 2) Response to User
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

// Create
exports.createReview = catchAsync(async (req, res, next) => {
  // 1-a) Get review data from request
  // const { content, rating, tour } = req.body;

  // 1-b) Allow nested route
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;

  // 2) Create review document
  const newReview = await Review.create(req.body);

  // 3) Response to user
  res.status(201).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});
