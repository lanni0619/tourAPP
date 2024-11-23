const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

// ==================== Middleware
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

// ==================== Endpoint

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, {
  path: 'reviews',
  select: 'review rating',
});
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

// Group by difficulty
exports.groupByDifficulty = catchAsync(async (req, res, next) => {
  const stats = await Tour.groupByDifficulty();
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
  const plan = await Tour.getTop3busyMonth(year);
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
  const result = await Tour.getPriceBucket();

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

// Group by guide
exports.getGuideLoading = catchAsync(async (req, res, next) => {
  const result = await Tour.getGuideLoading();

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

// Geospatial Query
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const tours = await Tour.getToursWithin(distance, latlng, unit);
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
  const distances = await Tour.getDistances(latlng, unit);

  res.status(200).json({
    status: 'success',
    results: distances.length,
    data: {
      data: distances,
    },
  });
});
