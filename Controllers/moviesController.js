const { truncate } = require("fs");
const Movie = require("../Models/movieModel");

const validateReqBody = (req, res, next) => {
  if (!req.body.name || !req.body.duration) {
    return res.status(400).json({
      status: "failed",
      message: "not a valid movie data",
    });
  }
  next();
};

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});

    res.status(200).json({
      status: "success",
      count: movies.length,
      data: {
        movies,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
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

const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
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
};
