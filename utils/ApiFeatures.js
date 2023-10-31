class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    //query string: ?duration[gte]=100&ratings[gt]=5
    const excludeFields = ["sort", "page", "limit", "fields"];
    const queryModded = { ...this.queryStr };
    excludeFields.forEach((el) => delete queryModded[el]);

    //let queryString = JSON.stringify(this.queryStr);
    let queryString = JSON.stringify(queryModded);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    const queryObj = JSON.parse(queryString);

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const byFields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(byFields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = +this.queryStr.page || 1;
    const limit = +this.queryStr.limit || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    /*if (this.queryStr.page) {
      const movieCount = await Movie.countDocuments();
      if (skip >= movieCount) {
        throw new Error(`page ${page} was not found!`);
      }
    }*/

    return this;
  }
}

module.exports = ApiFeatures;
