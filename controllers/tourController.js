const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

// multer option: filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  // console.log(req.files);

  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    // Can not use foreach because foreach will neglect "async"
    // map fuction will return a array of async function
    req.files.images.map(async (image, index) => {
      const filename = `tour-${req.params.id}-${Date.now()}-image-${index + 1}.jpeg`;

      req.body.images.push(filename);

      await sharp(image.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);
    }),
  );

  next();
});

exports.top5Ratings = (req, res, next) => {
  // sort=-ratingsAverage,price&fields=name,difficulty,duration,price,ratingsAverage&limit=5
  req.query.limit = 5;
  req.query.fields = 'name, difficulty, duration, price, ratingsAverage';
  req.query.sort = '-ratingsAverage,price';
  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, {
  path: 'reviews',
  select: 'review rating',
});
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

// ==================== Statistic data

// Group by difficulty
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
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
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

// Top3 busy month in a specific year (Solve business problem)
exports.getTop3busyMonth = catchAsync(async (req, res, next) => {
  // 2021
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
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
    {
      $limit: 3,
    },
  ]);
  res.status(200).json({
    status: 'success',
    result: plan.length,
    data: {
      plan,
    },
  });
});

// Price Bucket
exports.getPriceBucket = catchAsync(async (req, res, next) => {
  const result = await Tour.aggregate([
    {
      $bucket: {
        groupBy: '$price',
        boundaries: [0, 500, 1000, 1500, 2000],
        default: '2000+',
        output: {
          tourCount: { $sum: 1 },
          tours: {
            $push: {
              name: '$name',
              ratingsAverage: '$ratingsAverage',
              ratingsQuantity: '$ratingsQuantity',
            },
          },
        },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

// Group by guide
exports.getGuideLoading = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
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
        numTour: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
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

  res.status(200).json({
    status: 'success',
    data: stats,
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
