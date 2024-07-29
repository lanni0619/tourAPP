const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  // Note : Because .find() return a Query object
  // so that we can use.where, .equals ...
  // Query.prototype.methods https://mongoosejs.com/docs/api/query.html

  try {
    // // BUILD QUERY
    // // 1A) Filtering
    console.log(req.query);
    const queryObject = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObject[el]);

    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Standard of req parameter : key[oprator] - value
    // { duration: { gte: '5' }, difficulty: 'easy' }
    // Change to match DB (have dollar sign)
    // { duration: { $gte: '5' }, difficulty: 'easy' }
    // gte, gt, lte, lt

    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      // projecting : query only certain field name
      query = query.select(fields);
    } else {
      // minus = excluded(__v)
      query = query.select('-__v');
    }

    // 4) Pagination (It very important when we have huge amount of result)

    // ?page=2&limit=10 means user want to get page2 and 10 result(11-20)
    // It means user want to skip (1-10). So that the query method be like query.skip(10).limit(10);

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw Error('This page does not exist');
    }

    //EXECUTE QUERY

    const tours = await query;

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
