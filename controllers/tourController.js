const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

// #2 ROUTE HANDLERS

exports.aliasTopTours = (req, res, next) => {
  // sort=-ratingsAverage,price&fields=name,difficulty,duration,price,ratingsAverage&limit=5
  req.query.limit = 5;
  req.query.fields = 'name, difficulty, duration, price, ratingsAverage';
  req.query.sort = '-ratingsAverage, price';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // equal to Tour.findById(_id:req.params.id)
    // both are return object
    res.status(200).json({
      // jsend data specification
      status: 'success',
      data: tour,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour();
    // newTour.save()

    // newTour is a prototype from Tour (created from Tour Model)
    // So that newTour get a bunch of methods from model
    // model.prototype.save() is one of that 😁

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: newTour,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    // status code 204 stand for no content
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(204).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(204).json({
      status: 'fail',
      message: error,
    });
  }
};

// Solve business problem
exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(204).json({
      status: 'fail',
      message: error,
    });
  }
};
