const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

let app = express();
const port = 3000;

const movies = JSON.parse(fs.readFileSync('./data/movies.json'));
const api_url = '/api/v1/movies';

//middleware to read json from request
app.use(express.json()); // we call this function because it returns a middleware function
app.use(morgan('dev')); // we call this function because it returns a middleware function
// custom middleware
const reqAtMiddleware = (req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
};
app.use(reqAtMiddleware); // we don't call this function because it's already a middleware function

const getAllMovies = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedAt,
    count: movies.length,
    data: {
      movies: movies, // enveloping: wrap and object inside another object
    },
  });
};

const getOneMovie = (req, res) => {
  const id = +req.params.id; // +: unary operator
  const movie = movies.find((el) => el.id === id);

  if (!movie) {
    return res.status(404).json({
      status: 'failed',
      message: `movie with id: ${id} was not find`,
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      movie: movie,
    },
  });
};

const createMovie = (req, res) => {
  const newId = movies[movies.length - 1].id + 1;
  const newMovie = Object.assign({ id: newId }, req.body);
  movies.push(newMovie);

  fs.writeFile('./data/movies.json', JSON.stringify(movies), (error) => {
    res.status(201).json({
      status: 'success',
      data: {
        movie: newMovie,
      },
    });
  });
};

const patchMovie = (req, res) => {
  const id = +req.params.id;
  const movieToUppdate = movies.find((el) => el.id === id);

  if (!movieToUppdate) {
    return res.status(404).json({
      status: 'failed',
      message: `movie with id: ${id} not found.`,
    });
  }

  const indexOfMovie = movies.indexOf(movieToUppdate);
  Object.assign(movieToUppdate, req.body);
  movies[indexOfMovie] = movieToUppdate;

  fs.writeFile('./data/movies.json', JSON.stringify(movies), (error) => {
    res.status(200).json({
      status: 'success',
      data: {
        movie: movieToUppdate,
      },
    });
  });
};

const deleteMovie = (req, res) => {
  const id = +req.params.id;
  const movieToDelete = movies.find((el) => el.id === id);

  if (!movieToDelete) {
    return res.status(404).json({
      status: 'failed',
      message: `movie with id: ${id} not found.`,
    });
  }
  const index = movies[movieToDelete];
  movies.splice(index, 1);

  fs.writeFile('./data/movies.json', JSON.stringify(movies), (error) => {
    res.status(204).json({
      status: 'success',
      data: {
        movie: null,
      },
    });
  });
};

// routes
const moviesRouter = express.Router();

moviesRouter.route('/').get(getAllMovies).post(createMovie);
moviesRouter
  .route('/:id')
  .get(getOneMovie)
  .patch(patchMovie)
  .delete(deleteMovie);

app.use(api_url, moviesRouter);

app.listen(port, () => {
  console.log('server running!!');
});
