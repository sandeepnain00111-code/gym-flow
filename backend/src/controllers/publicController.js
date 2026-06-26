const Gym = require('../models/Gym');
const GymPlan = require('../models/GymPlan');
const DemoBooking = require('../models/DemoBooking');

// @desc    Get all active gyms on the platform
// @route   GET /api/public/gyms
// @access  Public
exports.getPublicGyms = async (req, res, next) => {
  try {
    const gyms = await Gym.find({ isActive: true }).select('name slug logo coverImage city state facilities description');
    res.json({
      success: true,
      gyms
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get details of a single gym by slug
// @route   GET /api/public/gym/:slug
// @access  Public
exports.getPublicGymBySlug = async (req, res, next) => {
  try {
    const gym = await Gym.findOne({ slug: req.params.slug, isActive: true });
    if (!gym) {
      res.status(404);
      throw new Error('Gym not found or has been deactivated');
    }

    const plans = await GymPlan.find({ gymId: gym._id, isActive: true });

    res.json({
      success: true,
      gym,
      plans
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public plans list of a single gym by slug
// @route   GET /api/public/gym/:slug/plans
// @access  Public
exports.getPublicPlans = async (req, res, next) => {
  try {
    const gym = await Gym.findOne({ slug: req.params.slug, isActive: true });
    if (!gym) {
      res.status(404);
      throw new Error('Gym not found');
    }

    const plans = await GymPlan.find({ gymId: gym._id, isActive: true });
    res.json({
      success: true,
      plans
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a free demo class trial booking
// @route   POST /api/public/gym/:slug/demo-booking
// @access  Public
exports.createPublicDemoBooking = async (req, res, next) => {
  try {
    const { name, email, phone, date, timeSlot, notes } = req.body;
    const gym = await Gym.findOne({ slug: req.params.slug, isActive: true });

    if (!gym) {
      res.status(404);
      throw new Error('Gym not found');
    }

    const demo = await DemoBooking.create({
      gymId: gym._id,
      name,
      email,
      phone,
      date: new Date(date),
      timeSlot,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Demo booking requested! The gym team will reach out to you shortly to confirm your slot.',
      demo
    });
  } catch (error) {
    next(error);
  }
};
