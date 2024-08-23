const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  // 2) Build template
  // 3) Render that template using the tour data from step 1

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate(
    'reviews',
    'review rating user -tour',
  );

  // Mapbox GL JS requires the following CSP directives https://docs.mapbox.com/mapbox-search-js/guides/browsers/
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      'connect-src https://api.mapbox.com https://events.mapbox.com',
    )
    .render('tour', {
      title: tour.name,
      tour,
    });
});

exports.getloginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};
