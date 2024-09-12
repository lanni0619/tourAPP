// Database
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingsModel');
// Utils
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Controllers
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find().sort('-createdAt');
  // 2) Build template
  // 3) Render that template using the tour data from step 1

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  let booking = undefined;
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate(
    'reviews',
    'review rating user -tour',
  );

  if (res.locals.user) {
    booking = await Booking.findOne({
      user: res.locals.user.id,
      tour: tour.id,
    });
  }

  console.log(booking);

  if (!tour) return next(new AppError('There is no tour with that name.', 404));

  // Mapbox GL JS requires the following CSP directives https://docs.mapbox.com/mapbox-search-js/guides/browsers/
  res.status(200).render('tour', {
    title: tour.name,
    tour,
    booking,
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

  res.status(200).render('overview', {
    title: 'My Bookings',
    tours,
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
