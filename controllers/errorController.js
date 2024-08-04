// Global Error handling middleware
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  // 400 stand for bad req
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: (${err.keyValue.name}). Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationDB = (err) => {
  const errors = Object.values(err.errors).map((value) => value.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJwtError = () =>
  new AppError('🤔Invalid token. Please login again.', 401);

const handleJwtExpiredError = () =>
  new AppError('🤔Token is expired. Please login again.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational or trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't want to leak details

    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

// If set this 4 argument there, express automatically know
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // complete error information
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // simplify error information
    // spread syntax - shallow copy
    // JSON - deep copy
    // Not good to override the arguments of function

    let error = JSON.parse(JSON.stringify(err));
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationDB();
    if (error.name === 'JsonWebTokenError') error = handleJwtError();
    if (error.name === 'TokenExpiredError')
      error = handleJwtExpiredError(error);
    sendErrorProd(error, res);
  }
};
