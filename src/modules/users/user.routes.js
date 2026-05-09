const express =  require('express');
const router =  express.Router();
const authMiddleware =  require('../../middlewares/auth.middleware');
const userController =  require('./user.controller');

router.patch(
  '/onboarding/language',
  authMiddleware,
  userController.updateLanguage,
);

router.patch(
  '/onboarding/name',
  authMiddleware,
  userController.updateName,
);

module.exports = router;