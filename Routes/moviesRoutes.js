const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getOneMovie,
  createMovie,
  patchMovie,
  deleteMovie,
  checkId,
} = require('../Controllers/moviesController');

router.param('id', checkId);
router.route('/').get(getAllMovies).post(createMovie);
router.route('/:id').get(getOneMovie).patch(patchMovie).delete(deleteMovie);

module.exports = router;
