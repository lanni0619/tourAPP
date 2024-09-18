const path = require('path');
// 3rd-party package
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
// routes & controller
const viewRouter = require('./routes/viewRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

const app = express();

app.enable('trust proxy');

// Setting of views engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ---------- Global middlewares ----------
// Implement CORS (Also available use in specific route)
// https://github.com/expressjs/cors/blob/master/lib/index.js
// default: allow any origin
app.use(cors());
// HTTP Method - OPTIONS https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS
app.options('*', cors());

// Serving static file
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP Header
// let contentSecurityPolicy = false when use axios CDN
app.use(helmet({ contentSecurityPolicy: false }));

// Morgan only used in development mode
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

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

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

app.use(compression());

// Self-define middleware
app.use((req, res, next) => {
  // define a requestTime Object
  req.requestTime = new Date().toISOString();
  // console.log(req.header);
  // console.log(req.cookies);
  next();
});

// ---------- API Routes ----------
app.use('/', viewRouter);
app.use('/api/v1/tours', cors(), tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  // if we pass anything into next, it will assume that it's an error.
  next(new AppError(`Can not found ${req.originalUrl} on this server.`, 404));
});

app.use(errorController);

module.exports = app;
