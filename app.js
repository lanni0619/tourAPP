const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// #1 MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
// app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  // console.log('Hello from middleware😆');
  next();
});
app.use((req, res, next) => {
  // define a requestTime Object
  req.requestTime = new Date().toISOString();
  next();
});

// #2 tourRouter & user Router are kind of middlewares
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
