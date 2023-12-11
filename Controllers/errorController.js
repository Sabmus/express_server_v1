const CustomError = require('../utils/CustomError');

const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong, please try again later',
    });
  }
};

const castErrorHandler = error => {
  const message = `error - cast for '${error.path}' of type (${error.kind}) fail for value '${error.value}' of type ${error.valueType}`;
  return new CustomError(400, message);
};

const duplicateKeyErrorHandler = error => {
  const message = `error - there is already a movie with the name: '${error.keyValue.name}'`;
  return new CustomError(400, message);
};

const validationErrorHandler = error => {
  const errorMessages = Object.values(error.errors)
    .map(val => val.message)
    .join('. ');

  const message = `errors: ${errorMessages}`;
  return new CustomError(400, message);
};

const expiredJWTErrorHandler = error => {
  const message = 'you must login again in order to access.';
  return new CustomError(401, message);
};

const JWTErrorHandler = error => {
  const message = 'you must login again in order to access.';
  return new CustomError(401, message);
};

const confirmationTokenNotFound = error => {
  const message = 'invalid token or expired.';
  return new CustomError(401, message);
};

const userDoesNotExistInDb = error => {
  const message = 'invalid email or password.';
  return new CustomError(401, message);
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    devErrors(res, error);
  }

  if (process.env.NODE_ENV === 'production') {
    //let err = JSON.parse(JSON.stringify(error));
    let err = { ...error, name: error.name };

    if (err.name === 'CastError') err = castErrorHandler(err);
    if (err.code === 11000) err = duplicateKeyErrorHandler(err);
    if (err.name === 'ValidationError') err = validationErrorHandler(err);
    if (err.name === 'TokenExpiredError') err = expiredJWTErrorHandler(err);
    if (err.name === 'JsonWebTokenError') err = JWTErrorHandler(err);

    // prisma errors
    if (err.code === 'P2025' && err.meta?.modelName === 'ConfirmationToken') err = confirmationTokenNotFound(err);

    // custom named error
    if (err.name === 'UserNotFound') err = userDoesNotExistInDb(err);

    prodErrors(res, err);
  }
};
