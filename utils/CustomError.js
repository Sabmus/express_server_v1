class CustomError extends Error {
  constructor(statusCode, message, name = undefined) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'client error' : 'server error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
