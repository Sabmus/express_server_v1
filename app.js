const express = require('express');
const morgan = require('morgan');
const authRouter = require('./Routes/authRoutes');
const transactionRouter = require('./Routes/transactionRoutes');
const globalErrorHandler = require('./Controllers/errorController');
const CustomError = require('./utils/CustomError');
const constants = require('./utils/constants');

let app = express();

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
app.use(constants.userApi, authRouter);
app.use(constants.transactionApi, transactionRouter);

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
  const err = new CustomError(404, `can't find ${req.originalUrl} on the server`);
  next(err); //skip al middleware stack and goes directly to the global error middleware
});

app.use(globalErrorHandler);

module.exports = app;
