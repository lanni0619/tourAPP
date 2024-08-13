const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// #2 ROUTE HANDLERS

exports.aliasTopTours = (req, res, next) => {
  // sort=-ratingsAverage,price&fields=name,difficulty,duration,price,ratingsAverage&limit=5
  req.query.limit = 5;
  req.query.fields = 'name, difficulty, duration, price, ratingsAverage';
  req.query.sort = '-ratingsAverage, price';
  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      // match stage
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      // group stage
      $group: {
        // _id is used to filter data. null means all data
        // _id: { $toUpper: '$difficulty' },
        _id: '$ratingsAverage',
        // gonna add 1 for each document
        numTours: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        // fieldName: { operator: '$fieldName' }
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
      // Just can use new field name from the top
      // can not sort by collection field name
      // 1 for ascending
    },
    {
      $sort: { avgPrice: 1 },
    },
    // we can repeat stages
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
// Solve business problem
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // 2021
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
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
        numTourStarts: { $sum: 1 },
        tour: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    // {
    //   $limit: 3,
    // },
  ]);
  res.status(200).json({
    status: 'success',
    result: plan.length,
    data: {
      plan,
    },
  });
});

// Geospatial Query
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng)
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng . ',
        400,
      ),
    );
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }, // lng first in mongodb
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

// Get distances
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng)
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng . ',
        400,
      ),
    );
  const multiplier = unit === 'mi' ? 0.000621371192 : 0.001;
  const distances = await Tour.aggregate([
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

  res.status(200).json({
    status: 'success',
    results: distances.length,
    data: {
      data: distances,
    },
  });
});
