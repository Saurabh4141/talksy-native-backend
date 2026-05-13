const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const onboardingController = require('./onboarding.controller');

router.patch(
  '/companion-gender',
  authMiddleware,
  onboardingController.updateCompanionGender,
);


module.exports = router;