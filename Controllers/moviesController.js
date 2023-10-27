const fs = require('fs');
const movies = JSON.parse(fs.readFileSync('./data/movies.json'));

const checkId = (req, res, next, value) => {
  const movie = movies.find((el) => el.id === +value);

  if (!movie) {
    return res.status(404).json({
      status: 'failed',
      message: `movie with id: ${value} was not find`,
    });
  }

  next();
};

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

  const index = movies.indexOf(movieToDelete);
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

module.exports = {
  getAllMovies,
  getOneMovie,
  createMovie,
  patchMovie,
  deleteMovie,
  checkId,
};
