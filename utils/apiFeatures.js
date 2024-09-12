class APIFeatures {
  constructor(queryObj, queryString) {
    this.queryObj = queryObj;
    this.queryString = queryString;
  }

  // 1) Filtering
  filter() {
    // 1A) Delete special query methods
    // Use ES6 syntax: hard copy queryString object
    const queryObject = { ...this.queryString };
    // Create the filter list
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObject[el]);

    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObject);
    // stringify(obj) to string so that can use replace methods
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // ***Don't use await for now because we need the query object to chain the special query***
    this.queryObj = this.queryObj.find(JSON.parse(queryStr));

    return this;
  }

  // 2) Special Query: sort, limitFields, paginate ...

  // 2A) query.prototype.sort()
  sort() {
    if (this.queryString.sort) {
      // this.queryString.sort: '-price,ratingsAverage';
      // sortBy = '-price ratingsAverage'(mongoose syntax)
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.queryObj = this.queryObj.sort(sortBy);
    } else {
      this.queryObj = this.queryObj.sort('-createdAt');
    }

    return this;
  }

  // 2B) query.prototype.select()
  // Specifies which document fields to include or exclude(also known as the query "projection")
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.queryObj = this.queryObj.select(fields);
    } else {
      // minus = excluded(__v)
      this.queryObj = this.queryObj.select('-__v');
    }

    return this;
  }

  // 2C) query.prototype.skip() & query.prototype.limit()
  // Specifies the number of documents to skip.
  // Specifies the maximum number of documents the query will return.
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.queryObj = this.queryObj.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
