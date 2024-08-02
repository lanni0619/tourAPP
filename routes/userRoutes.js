const router = require('express').Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// A special endpoint doesn't fit RESTful
router.post('/signup', authController.signup);

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
