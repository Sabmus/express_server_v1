const express = require('express');
const morgan = require('morgan');
const moviesRouter = require('./Routes/moviesRoutes');

let app = express();

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

// routes
app.use(api_url, moviesRouter);

module.exports = app;
