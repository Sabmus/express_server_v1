const mongoose = require("mongoose");
const fs = require("fs");
const Movie = require("../Models/movieModel");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
  })
  .then((connObj) => {
    console.log("DB connnection successful");
  })
  .catch((error) => {
    console.log(error.message);
  });

// read file
const movies = JSON.parse(fs.readFileSync("./movies.json", "utf-8"));

// delete existing docs
const deleteAll = async () => {
  try {
    const deleted = await Movie.deleteMany({});
    console.log(
      `delete successful, deleted: ${deleted.deletedCount} documents`
    );
  } catch (error) {
    console.log(error.message);
  }
};

// save dev data
const importData = async () => {
  try {
    await Movie.create(movies);
    console.log("data successfully imported");
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-d") {
  deleteAll();
}

if (process.argv[2] === "-s") {
  importData();
}
