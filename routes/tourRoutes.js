const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// 1) statistic
router
  .route('/top-5-ratings')
  .get(tourController.top5Ratings, tourController.getAllTours);
router.route('/group-by-difficulty').get(tourController.groupByDifficulty);
router.route('/monthly-plan/:year').get(tourController.getTop3busyMonth);
router.route('/price-bucket').get(tourController.getPriceBucket);
router.route('/guide-loading').get(tourController.getGuideLoading);

// 2) Geospatial Query
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

// 3) CRUD
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protectByAccess,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protectByAccess,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(
    authController.protectByAccess,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

// 4) Nested Route - POST /tours/$r321ew23412/reviews
router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
