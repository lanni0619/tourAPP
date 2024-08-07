const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// #2 ROUTE HANDLERS

exports.aliasTopTours = (req, res, next) => {
  // sort=-ratingsAverage,price&fields=name,difficulty,duration,price,ratingsAverage&limit=5
  req.query.limit = 5;
  req.query.fields = 'name, difficulty, duration, price, ratingsAverage';
  req.query.sort = '-ratingsAverage, price';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  //EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    resluts: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // Virtual Populate (Course 11-157)
  const tour = await Tour.findById(req.params.id).populate('reviews');
  if (!tour) {
    return next(new AppError('Can not found tour with that ID!', 404));
    // must have "return" or send two responses then occur bug.
  }

  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newTour,
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('Can not found tour with that ID!', 404));
    // must have "return" or send two responses then occur bug.
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('Can not found tour with that ID!', 404));
    // must have "return" or send two responses then occur bug.
  }

  // status code 204 stand for no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

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
