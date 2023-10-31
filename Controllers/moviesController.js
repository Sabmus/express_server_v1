const Movie = require("../Models/movieModel");
const ApiFeatures = require("../utils/ApiFeatures");

const validateReqBody = (req, res, next) => {
  if (!req.body.name || !req.body.duration) {
    return res.status(400).json({
      status: "failed",
      message: "not a valid movie data",
    });
  }
  next();
};

const top5highestRated = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratings";

  next();
};

const getMovieStats = async (req, res) => {
  try {
    const stats = await Movie.aggregate([
      { $match: { ratings: { $gte: 4.5 } } },
      {
        $group: {
          _id: "$releaseYear",
          avgRating: { $avg: "$ratings" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          priceTotal: { $sum: "$price" },
          movieCount: { $sum: 1 },
        },
      },
      { $sort: { avgRating: 1 } },
    ]);

    res.status(200).json({
      status: "success",
      count: stats.length,
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error.message,
    });
  }
};

const getMovieByGenre = async (req, res) => {
  try {
    const genre = req.params.genre;
    const movies = await Movie.aggregate([
      { $unwind: "$genres" },
      {
        $group: {
          _id: "$genres",
          movieCount: { $sum: 1 },
          movies: { $push: "$name" },
        },
      },
      { $addFields: { genre: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: { movieCount: -1 } },
      { $match: { genre: genre } },
      //{ $limit: 3 },
    ]);

    res.status(200).json({
      status: "success",
      count: movies.length,
      data: {
        movies,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error.message,
    });
  }
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

    const features = new ApiFeatures(Movie.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate(); // Movie.find() return a query object
    let movies = await features.query;

    res.status(200).json({
      status: "success",
      count: movies.length,
      data: {
        movies,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error.message,
    });
  }
};

const getOneMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        movie,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

const asyncErrorHandler = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => next(err));
  };
};

const createMovie = asyncErrorHandler(async (req, res) => {
  const movie = await Movie.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      movie,
    },
  });
});

const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        movie,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
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
  top5highestRated,
  getMovieStats,
  getMovieByGenre,
};
