const express = require("express");
const fs = require("fs");
let app = express();
const port = 3000;

const movies = JSON.parse(fs.readFileSync("./data/movies.json"));

//middleware to read json from request
app.use(express.json());

// GET - api/movies
app.get("/api/v1/movies", (req, res) => {
  res.status(200).json({
    status: "success",
    count: movies.length,
    data: {
      movies: movies, // enveloping: wrap and object inside another object
    },
  });
});

// POST - api/v1/movies
app.post("/api/v1/movies", (req, res) => {
  const newId = movies[movies.length - 1].id + 1;
  const newMovie = Object.assign({ id: newId }, req.body);
  movies.push(newMovie);

  fs.writeFile("./data/movies.json", JSON.stringify(movies), () => {
    res.status(201).json({
      status: "success",
      data: {
        movie: newMovie,
      },
    });
  });
});

app.listen(port, () => {
  console.log("server running!");
});
