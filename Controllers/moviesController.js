const { truncate } = require('fs');
const Movie = require('../Models/movieModel');

const validateReqBody = (req, res, next) => {
  if (!req.body.name || !req.body.duration) {
    return res.status(400).json({
      status: 'failed',
      message: 'not a valid movie data',
    });
  }
  next();
};

const getAllMovies = async (req, res) => {
  try {
    /**query strings */
    /* mongoose 6.0 or lower
    const excludeFields = ['sort', 'page', 'limit', 'fields'];
    const queryObj = {...req.query};
    excludeFields.forEach(el => delete queryObj[el]);
    const movies = await Movie.find(queryObj);
    */
    /* mongoose 7.0 or greater
    const movies = await Movie.find(req.query);
    */

    /* query string: ?duration[gte]=100&ratings[gt]=5
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    const queryObj = JSON.parse(queryStr);
    const movies = await Movie.find(queryObj);
    */

    let query = Movie.find(); // returns a query objects, if we await here we will return the result of the query

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // limiting fields: projection
    if (req.query.fields) {
      const byFields = req.query.fields.split(',').join(' ');
      console.log(byFields);
      query = query.select(byFields);
    } else {
      query = query.select('-__v');
    }

    // pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const skip = (page - 1) * limit;
    if (req.query.page) {
      const movieCount = await Movie.countDocuments();
      if (skip >= movieCount) {
        throw new Error(`page ${page} was not found!`);
      }
    }

    query = query.skip(skip).limit(limit);

    const movies = await query;

    res.status(200).json({
      status: 'success',
      count: movies.length,
      data: {
        movies,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const getOneMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        movie,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        movie,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        movie,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

module.exports = {
  getAllMovies,
  getOneMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  validateReqBody,
};
