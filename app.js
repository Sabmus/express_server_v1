const express = require("express");
const fs = require("fs");
let app = express();
const port = 3000;

const movies = JSON.parse(fs.readFileSync("./data/movies.json"));
const api_url = "/api/v1/movies";

//middleware to read json from request
app.use(express.json());

// GET - api/v1/movies
app.get(api_url, (req, res) => {
  res.status(200).json({
    status: "success",
    count: movies.length,
    data: {
      movies: movies, // enveloping: wrap and object inside another object
    },
  });
});

// GET - api/v1/movieis/id
app.get(api_url + "/:id/:optionalParameter?", (req, res) => {
  const id = +req.params.id; // +: unary operator
  const movie = movies.find((el) => el.id === id);

  if (!movie) {
    return res.status(404).json({
      status: "failed",
      message: `movie with id: ${id} was not find`,
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      movie: movie,
    },
  });
});

// POST - api/v1/movies
app.post(api_url, (req, res) => {
  const newId = movies[movies.length - 1].id + 1;
  const newMovie = Object.assign({ id: newId }, req.body);
  movies.push(newMovie);

  fs.writeFile("./data/movies.json", JSON.stringify(movies), (error) => {
    res.status(201).json({
      status: "success",
      data: {
        movie: newMovie,
      },
    });
  });
});

// PATCH - api/v1/movies
app.patch(api_url + "/:id", (req, res) => {
  const id = +req.params.id;
  const movieToUppdate = movies.find((el) => el.id === id);

  if (!movieToUppdate) {
    return res.status(404).json({
      status: "failed",
      message: `movie with id: ${id} not found.`,
    });
  }

  const indexOfMovie = movies.indexOf(movieToUppdate);
  Object.assign(movieToUppdate, req.body);
  movies[indexOfMovie] = movieToUppdate;

  fs.writeFile("./data/movies.json", JSON.stringify(movies), (error) => {
    res.status(200).json({
      status: "success",
      data: {
        movie: movieToUppdate,
      },
    });
  });
});

app.delete(api_url + "/:id", (req, res) => {
  const id = +req.params.id;
  const movieToDelete = movies.find((el) => el.id === id);

  if (!movieToDelete) {
    return res.status(404).json({
      status: "failed",
      message: `movie with id: ${id} not found.`,
    });
  }
  const index = movies[movieToDelete];
  movies.splice(index, 1);

  fs.writeFile("./data/movies.json", JSON.stringify(movies), (error) => {
    res.status(204).json({
      status: "success",
      data: {
        movie: null,
      },
    });
  });
});

app.listen(port, () => {
  console.log("server running!");
});
