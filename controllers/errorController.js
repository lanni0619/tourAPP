// Global Error handling middleware
const AppError = require('../utils/appError');

// isOperational Error
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
const handleJwtError = () => {
  new AppError('🤔Invalid token. Please login again.', 401);
};
const handleJwtExpiredError = () => {
  new AppError('🤔Token is expired. Please login again.', 401);
};

// Development Mode
const sendErrorDev = (err, req, res) => {
  // A) Request from API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      msg: err.message,
      stack: err.stack,
    });
  }
  // B) Request from website
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

// Production Mode
const sendErrorProd = (err, req, res) => {
  // A) Request from API
  if (req.originalUrl.startsWith('/api')) {
    // 1) Send only operational or trusted error to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        msg: err.message,
      });
    }
    // 2) Don't leak details to client (Programming or other unknown error)

    // 2-1) Log error
    console.error('ERROR 💥', err);

    // 2-2) Send generic message
    return res.status(500).json({
      status: 'error',
      msg: 'Please try again later!',
    });
  }
  // B) Request from website
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later!',
  });
};

// error handling middleware (If set this 4 argument there, express automatically know it's)
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 1) Dev Mode - Send complete error information
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // 2) Prod Mode - simplify error information

    // 3) Define simple error msg to client in prod mode

    console.log(err);
    let error = JSON.parse(JSON.stringify(err));
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationDB();
    if (error.name === 'JsonWebTokenError') error = handleJwtError();
    if (error.name === 'TokenExpiredError')
      error = handleJwtExpiredError(error);

    console.log(error);
    sendErrorProd(error, req, res);
  }
};
