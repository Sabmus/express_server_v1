const mongoose = require('mongoose');
const fs = require('fs');

const movieSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is a required field!'],
      unique: true,
      maxlength: [100, 'movie name must not exceed 100 characters'],
      minlength: [4, 'movie name must al least have 4 characters'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is a required field!'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Duration is a required field!'],
    },
    ratings: {
      type: Number,
      default: 1.0,
      min: [1, 'ratings must be greater or equals to 1'],
      max: [10, "ratings can't be greater than 10"],
    },
    totalRatings: {
      type: Number,
    },
    releaseYear: {
      type: Number,
      required: [true, 'Release year is a required field!'],
      validate: {
        validator: function (value) {
          return value >= 1700;
        },
        message: "release year ({VALUE}) can't be lower than 1700",
      },
    },
    releaseDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // to remove it from select querys
    },
    genres: {
      type: [String],
      required: [true, 'Genres is a required field!'],
      enum: {
        values: [
          'Action',
          'Adventure',
          'Sci-Fi',
          'Thriller',
          'Crime',
          'Drama',
          'Comedy',
          'Romance',
          'Biography',
        ],
        message: "this genre doesn't exists",
      },
    },
    directors: {
      type: [String],
      required: [true, 'Directors is a required field!'],
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is a required field!'],
    },
    actors: {
      type: [String],
      required: [true, 'Actors is a required field!'],
    },
    price: {
      type: Number,
      required: [true, 'Price is a required field!'],
    },
    createdBy: String,
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// virtual properties
movieSchema.virtual('durationInHours').get(function () {
  return this.duration / 60;
});

// pre hook
movieSchema.pre('save', function (next) {
  this.createdBy = 'sabmus';
  next();
});

movieSchema.pre(/^find/, function (next) {
  this.find({ releaseDate: { $lte: Date.now() } }); //find convert date.now to make a comparison with releaseDate
  this.startTime = Date.now();
  next();
});

movieSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { releaseDate: { $lte: new Date() } } });
  next();
});

// post hook
movieSchema.post('save', function (doc, next) {
  /* const content = `movie: ${doc.name}, created by: ${doc.createdBy}\n`;
  fs.writeFile('./log/log.txt', content, { flag: 'a' }, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('log created by success');
    }
  }); */
  next();
});

movieSchema.post(/^find/, function (docs, next) {
  //this.find({ releaseDate: { $lte: Date.now() } });
  this.endTime = Date.now();
  const content = `query took ${
    this.endTime - this.startTime
  } milisecond to complete.\n`;

  /* fs.writeFile("./log/log.txt", content, { flag: "a" }, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("log time success");
    }
  }); */

  next();
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
