const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getOneMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  //validateReqBody,
  top5highestRated,
  getMovieStats,
  getMovieByGenre,
} = require('../Controllers/moviesController');

const { protect } = require('../Controllers/usersController');

router.route('/hightest-rated').get(top5highestRated, getAllMovies);
router.route('/stats').get(getMovieStats);
router.route('/movies-by-genres/:genre').get(getMovieByGenre);

router.route('/').get(protect, getAllMovies).post(createMovie);
router.route('/:id').get(getOneMovie).patch(updateMovie).delete(deleteMovie);

module.exports = router;
