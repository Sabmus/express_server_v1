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

const castErrorHandler = (error) => {
  const message = `error - cast for '${error.path}' of type (${error.kind}) fail for value '${error.value}' of type ${error.valueType}`;
  return new CustomError(400, message);
};

const duplicateKeyErrorHandler = (error) => {
  const message = `error - there is already a movie with the name: '${error.keyValue.name}'`;
  return new CustomError(400, message);
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

    prodErrors(res, err);
  }
};
