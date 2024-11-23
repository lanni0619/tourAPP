// Database
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingsModel');
const review = require('../models/reviewModel');
// Utils
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');

// Controllers
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find().sort('-createdAt');
  // 2) Build template
  // 3) Render that template using the tour data from step 1

  res.status(200).render('overview', {
    title: 'Home',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  let booking = undefined;
  let review = undefined;
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    select: 'review rating user -tour',
  });

  // Find the currentUser booking & review status
  if (res.locals.user) {
    booking = await Booking.findOne({
      user: res.locals.user.id,
      tour: tour.id,
    });
    review = await Review.findOne({
      user: res.locals.user.id,
      tour: tour.id,
    });
  }

  if (!tour) return next(new AppError('There is no tour with that name.', 404));

  // Mapbox GL JS requires the following CSP directives https://docs.mapbox.com/mapbox-search-js/guides/browsers/
  res.status(200).render('tour', {
    title: tour.name,
    tour,
    booking,
    review,
  });
});

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getSignupForm = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Signup your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};

exports.getMyBookings = catchAsync(async (req, res, next) => {
  // 1) find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) find tour with the return IDs
  const toursID = bookings.map((booking) => booking.tour.id);

  const tours = await Tour.find({ _id: { $in: toursID } });

  res.status(200).render('myBookings', {
    title: 'My Bookings',
    tours,
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  // 1) Find reviews by userID
  const reviews = await Review.find({ user: req.user.id }).populate({
    path: 'tour',
    select: 'name slug',
  });

  // 2) Rendering my-reviews page
  res.status(200).render('myReviews', {
    title: 'My Reviews',
    reviews,
  });
});

// Method 1 - account.pug - Update User data by URL encoded

// exports.updateUserData = catchAsync(async (req, res, next) => {
//   const updateUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     {
//       new: true,
//       runValidators: true,
//     },
//   );

//   // Update User data - method 1
//   res.locals.user = updateUser;

//   res.status(200).render('account', {
//     title: 'Your Account',
//     // Update User data - method 2
//     // user: updateUser,
//   });
// });
