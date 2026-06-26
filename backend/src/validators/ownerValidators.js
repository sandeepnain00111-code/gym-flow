const Joi = require('joi');

// POST /api/owner/gym  (saveGymProfile)
const saveGymProfileSchema = Joi.object({
  name:         Joi.string().trim().min(2).max(100).required(),
  description:  Joi.string().trim().max(1000).allow('').optional(),
  address:      Joi.string().trim().required(),
  city:         Joi.string().trim().required(),
  state:        Joi.string().trim().required(),
  phone:        Joi.string().trim().min(7).max(15).required(),
  email:        Joi.string().trim().email().lowercase().required(),
  openingTime:  Joi.string().trim().optional(),
  closingTime:  Joi.string().trim().optional(),
  facilities:   Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
  facebook:     Joi.string().uri().allow('').optional(),
  instagram:    Joi.string().uri().allow('').optional(),
  twitter:      Joi.string().uri().allow('').optional(),
  website:      Joi.string().uri().allow('').optional()
});

// POST /api/owner/plans  (createPlan)
const createPlanSchema = Joi.object({
  name:           Joi.string().trim().min(2).max(100).required(),
  description:    Joi.string().trim().max(500).allow('').optional(),
  durationInDays: Joi.number().integer().min(1).required(),
  price:          Joi.number().min(0).required(),
  isActive:       Joi.boolean().optional()
});

// PUT /api/owner/plans/:id  (updatePlan)
const updatePlanSchema = Joi.object({
  name:           Joi.string().trim().min(2).max(100).optional(),
  description:    Joi.string().trim().max(500).allow('').optional(),
  durationInDays: Joi.number().integer().min(1).optional(),
  price:          Joi.number().min(0).optional(),
  isActive:       Joi.boolean().optional()
});

// POST /api/owner/trainers  (createTrainer)
const createTrainerSchema = Joi.object({
  name:       Joi.string().trim().min(2).max(100).required(),
  email:      Joi.string().trim().email().lowercase().required(),
  phone:      Joi.string().trim().min(7).max(15).required(),
  password:   Joi.string().min(6).max(128).required(),
  specialty:  Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
  experience: Joi.number().min(0).optional(),
  bio:        Joi.string().trim().max(500).allow('').optional(),
  salary:     Joi.number().min(0).optional()
});

// PUT /api/owner/trainers/:id  (updateTrainer)
const updateTrainerSchema = Joi.object({
  name:       Joi.string().trim().min(2).max(100).optional(),
  phone:      Joi.string().trim().min(7).max(15).optional(),
  specialty:  Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
  experience: Joi.number().min(0).optional(),
  bio:        Joi.string().trim().max(500).allow('').optional(),
  salary:     Joi.number().min(0).optional()
});

// POST /api/owner/workout-plans  (createWorkoutPlan)
const createWorkoutPlanSchema = Joi.object({
  memberId: Joi.string().hex().length(24).required(),
  name:     Joi.string().trim().max(100).optional(),
  days:     Joi.array().items(
    Joi.object({
      day:       Joi.string().required(),
      exercises: Joi.array().items(
        Joi.object({
          exercise: Joi.string().required(),
          sets:     Joi.number().integer().min(1).optional(),
          reps:     Joi.string().optional(),
          rest:     Joi.string().optional(),
          notes:    Joi.string().allow('').optional(),
          videoUrl: Joi.string().uri().allow('').optional()
        })
      ).optional()
    })
  ).optional()
});

// PUT /api/owner/workout-plans/:id
const updateWorkoutPlanSchema = Joi.object({
  name: Joi.string().trim().max(100).optional(),
  days: Joi.array().items(
    Joi.object({
      day:       Joi.string().required(),
      exercises: Joi.array().items(
        Joi.object({
          exercise: Joi.string().required(),
          sets:     Joi.number().integer().min(1).optional(),
          reps:     Joi.string().optional(),
          rest:     Joi.string().optional(),
          notes:    Joi.string().allow('').optional(),
          videoUrl: Joi.string().uri().allow('').optional()
        })
      ).optional()
    })
  ).optional()
});

// POST /api/owner/diet-plans  (createDietPlan)
const createDietPlanSchema = Joi.object({
  memberId:      Joi.string().hex().length(24).required(),
  name:          Joi.string().trim().max(100).optional(),
  meals:         Joi.array().items(
    Joi.object({
      mealName:  Joi.string().required(),
      foodItems: Joi.string().required(),
      calories:  Joi.number().min(0).optional(),
      protein:   Joi.number().min(0).optional(),
      notes:     Joi.string().allow('').optional()
    })
  ).optional(),
  totalCalories: Joi.number().min(0).optional(),
  totalProtein:  Joi.number().min(0).optional()
});

// PUT /api/owner/diet-plans/:id
const updateDietPlanSchema = Joi.object({
  name:          Joi.string().trim().max(100).optional(),
  meals:         Joi.array().items(
    Joi.object({
      mealName:  Joi.string().required(),
      foodItems: Joi.string().required(),
      calories:  Joi.number().min(0).optional(),
      protein:   Joi.number().min(0).optional(),
      notes:     Joi.string().allow('').optional()
    })
  ).optional(),
  totalCalories: Joi.number().min(0).optional(),
  totalProtein:  Joi.number().min(0).optional()
});

// POST /api/owner/announcements  (createAnnouncement)
const createAnnouncementSchema = Joi.object({
  title:      Joi.string().trim().min(2).max(200).required(),
  content:    Joi.string().trim().min(2).required(),
  targetRole: Joi.string().valid('all', 'trainer', 'member').optional()
});

// PUT /api/owner/announcements/:id
const updateAnnouncementSchema = Joi.object({
  title:      Joi.string().trim().min(2).max(200).optional(),
  content:    Joi.string().trim().min(2).optional(),
  targetRole: Joi.string().valid('all', 'trainer', 'member').optional()
});

// POST /api/owner/payment/manual
const createManualPaymentSchema = Joi.object({
  memberEmail:  Joi.string().trim().email().lowercase().required(),
  planId:       Joi.string().hex().length(24).required(),
  paymentMode:  Joi.string().valid('cash', 'upi', 'online').required(),
  amount:       Joi.number().min(0).optional()
});

// PATCH /api/owner/demo-bookings/:id
const updateDemoBookingStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'contacted', 'converted', 'rejected').required()
});

module.exports = {
  saveGymProfileSchema,
  createPlanSchema,
  updatePlanSchema,
  createTrainerSchema,
  updateTrainerSchema,
  createWorkoutPlanSchema,
  updateWorkoutPlanSchema,
  createDietPlanSchema,
  updateDietPlanSchema,
  createAnnouncementSchema,
  updateAnnouncementSchema,
  createManualPaymentSchema,
  updateDemoBookingStatusSchema
};
