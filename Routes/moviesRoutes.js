const express = require('express');
const router = express.Router();
const movieController = require('../Controllers/moviesController');
const userController = require('../Controllers/usersController');

router
  .route('/hightest-rated')
  .get(movieController.top5highestRated, movieController.getAllMovies);
router.route('/stats').get(movieController.getMovieStats);
router.route('/movies-by-genres/:genre').get(movieController.getMovieByGenre);

router
  .route('/')
  .get(userController.protect, movieController.getAllMovies)
  .post(movieController.createMovie);
router
  .route('/:id')
  .get(movieController.getOneMovie)
  .patch(movieController.updateMovie)
  .delete(
    userController.protect,
    userController.onlyAdmin('admin'),
    movieController.deleteMovie
  );

module.exports = router;
