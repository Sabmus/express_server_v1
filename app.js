const express = require('express');
const morgan = require('morgan');
const moviesRouter = require('./Routes/moviesRoutes');
const authRouter = require('./Routes/authRoutes');
const globalErrorHandler = require('./Controllers/errorController');
const CustomError = require('./utils/CustomError');

let app = express();

const movie_api = '/api/v1/movies';
const user_api = '/api/v1/users';

//middleware to read json from request
app.use(express.json()); // we call this function because it returns a middleware function
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // we call this function because it returns a middleware function
}
app.use(express.static('./public'));

// custom middleware
const reqAtMiddleware = (req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
};
app.use(reqAtMiddleware); // we don't call this function because it's already a middleware function

// routes
app.use(movie_api, moviesRouter);
app.use(user_api, authRouter);

// default route
app.all('*', (req, res, next) => {
  /* res.status(404).json({
    status: "fail",
    message: `can't find ${req.originalUrl} on the server`,
  }); */
  /* const err = new Error(`can't find ${req.originalUrl} on the server`);
  err.status = "fail";
  err.statusCode = 404;
 */
  const err = new CustomError(
    404,
    `can't find ${req.originalUrl} on the server`
  );
  next(err); //skip al middleware stack and goes directly to the global error middleware
});

app.use(globalErrorHandler);

module.exports = app;
