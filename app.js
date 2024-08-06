const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

const app = express();

// ---------- Global middlewares ----------

// Set Security HTTP Header
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  limit: 100,
  message: 'To many requests from this IP. Please try again in an 1 hour.',
});
app.use('/api', limiter);

// Body parser: Ready data from body & into req.body object
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xssClean());
// HTTP params pollution
app.use(
  hpp({
    // allowed duplicate query string
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Serving static file
// app.use(express.static(`${__dirname}/public`));

// Self-define middleware
app.use((req, res, next) => {
  // define a requestTime Object
  req.requestTime = new Date().toISOString();
  // console.log(req.header);

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
