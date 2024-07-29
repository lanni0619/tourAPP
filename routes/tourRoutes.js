const router = require('express').Router();
const tourController = require('../controllers/tourController');

// middleware
// router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  // middleware
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
