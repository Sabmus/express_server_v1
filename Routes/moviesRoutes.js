const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getOneMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  validateReqBody,
  top5highestRated,
} = require('../Controllers/moviesController');

router.route('/hightest-rated').get(top5highestRated, getAllMovies);
router.route('/').get(getAllMovies).post(validateReqBody, createMovie);
router.route('/:id').get(getOneMovie).patch(updateMovie).delete(deleteMovie);

module.exports = router;
