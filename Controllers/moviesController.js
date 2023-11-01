const Movie = require('../Models/movieModel');
const ApiFeatures = require('../utils/ApiFeatures');
const asyncErrorHandler = require('../utils/asyncErrorHandler');

/* const validateReqBody = (req, res, next) => {
  if (!req.body.name || !req.body.duration) {
    return res.status(400).json({
      status: "failed",
      message: "not a valid movie data",
    });
  }
  next();
}; */

const top5highestRated = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratings';

  next();
};

const getMovieStats = asyncErrorHandler(async (req, res, next) => {
  const stats = await Movie.aggregate([
    { $match: { ratings: { $gte: 4.5 } } },
    {
      $group: {
        _id: '$releaseYear',
        avgRating: { $avg: '$ratings' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        priceTotal: { $sum: '$price' },
        movieCount: { $sum: 1 },
      },
    },
    { $sort: { avgRating: 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    count: stats.length,
    data: {
      stats,
    },
  });
});

const getMovieByGenre = asyncErrorHandler(async (req, res, next) => {
  const genre = req.params.genre;
  const movies = await Movie.aggregate([
    { $unwind: '$genres' },
    {
      $group: {
        _id: '$genres',
        movieCount: { $sum: 1 },
        movies: { $push: '$name' },
      },
    },
    { $addFields: { genre: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { movieCount: -1 } },
    { $match: { genre: genre } },
    //{ $limit: 3 },
  ]);

  res.status(200).json({
    status: 'success',
    count: movies.length,
    data: {
      movies,
    },
  });
});

const getAllMovies = asyncErrorHandler(async (req, res, next) => {
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

  const features = new ApiFeatures(Movie.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate(); // Movie.find() return a query object
  let movies = await features.query;

  res.status(200).json({
    status: 'success',
    count: movies.length,
    data: {
      movies,
    },
  });
});

const getOneMovie = asyncErrorHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

const createMovie = asyncErrorHandler(async (req, res, next) => {
  const movie = await Movie.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

const updateMovie = asyncErrorHandler(async (req, res, next) => {
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
});

const deleteMovie = asyncErrorHandler(async (req, res, next) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getAllMovies,
  getOneMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  //validateReqBody,
  top5highestRated,
  getMovieStats,
  getMovieByGenre,
};
