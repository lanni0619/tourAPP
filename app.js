const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// Use static file
// app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  // define a requestTime Object
  req.requestTime = new Date().toISOString();
  next();
});

// API Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can not found ${req.originalUrl} on this server.`,
  // });

  // if we pass anything into next, it will assume that it's an error.
  next(new AppError(`Can not found ${req.originalUrl} on this server.`, 404));
});

app.use(errorController);

module.exports = app;
