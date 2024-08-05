const router = require('express').Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// A special endpoint doesn't fit RESTful
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Password Reset Functionality
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// Fit RESTful philosophy
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
