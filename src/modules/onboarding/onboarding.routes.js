const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const onboardingController = require('./onboarding.controller');


/**
 * Update companion gender
 */

router.patch(
  '/companion-gender',
  authMiddleware,
  onboardingController.updateCompanionGender,
);

/**
 * Update companion role
 */
router.patch(
  '/companion-role',
  authMiddleware,
  onboardingController.updateCompanionRole,
);


module.exports = router;