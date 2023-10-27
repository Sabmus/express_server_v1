const express = require("express");
const fs = require("fs");
let app = express();

const port = 3000;

const movies = JSON.parse(fs.readFileSync("./data/movies.json"));

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

app.listen(port, () => {
  console.log("server running!");
});
