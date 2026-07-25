const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { createDemoBookingSchema } = require('../validators/publicValidators');
const {
  getPublicGyms,
  getPublicGymBySlug,
  getPublicPlans,
  createPublicDemoBooking,
  submitContactForm
} = require('../controllers/publicController');

router.get('/gyms',                    getPublicGyms);
router.get('/gym/:slug',               getPublicGymBySlug);
router.get('/gym/:slug/plans',         getPublicPlans);
router.post('/gym/:slug/demo-booking', validate(createDemoBookingSchema), createPublicDemoBooking);
router.post('/contact',                submitContactForm);

module.exports = router;
