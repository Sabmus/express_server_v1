const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getOneMovie,
  createMovie,
  patchMovie,
  deleteMovie,
  validateReqBody,
} = require('../Controllers/moviesController');

router.route('/').get(getAllMovies).post(validateReqBody, createMovie);
router.route('/:id').get(getOneMovie).patch(patchMovie).delete(deleteMovie);

module.exports = router;
