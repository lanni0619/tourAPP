const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview,
);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);
router.get('/me', authController.protectByRT, viewController.getAccount);
router.get(
  '/my-bookings',
  authController.protectByRT,
  viewController.getMyBookings,
);
router.get(
  '/my-reviews',
  authController.protectByRT,
  viewController.getMyReviews,
);

// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewController.updateUserData,
// );

module.exports = router;
