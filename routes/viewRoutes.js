const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();
console.log('API123');

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview,
);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);
router.get('/me', authController.protectByRefresh, viewController.getAccount);
router.get(
  '/my-bookings',
  authController.protectByRefresh,
  viewController.getMyBookings,
);
router.get(
  '/my-reviews',
  authController.protectByRefresh,
  viewController.getMyReviews,
);

// router.post(
//   '/submit-user-data',
//   authController.protectByAccess,
//   viewController.updateUserData,
// );

module.exports = router;
