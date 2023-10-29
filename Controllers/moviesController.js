const Movie = require('../Models/movieModel');

const validateReqBody = (req, res, next) => {
  if (!req.body.name || !req.body.releaseYear || !req.body.duration) {
    return res.status(400).json({
      status: 'failed',
      message: 'not a valid movie data',
    });
  }
  next();
};

const getAllMovies = (req, res) => {};

const getOneMovie = (req, res) => {};

const createMovie = (req, res) => {};

const patchMovie = (req, res) => {};

const deleteMovie = (req, res) => {};

module.exports = {
  getAllMovies,
  getOneMovie,
  createMovie,
  patchMovie,
  deleteMovie,
  validateReqBody,
};
