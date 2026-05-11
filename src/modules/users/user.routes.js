const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const userController = require('./user.controller');

router.patch(
  '/language',
  authMiddleware,
  userController.updateLanguage,
);

router.patch(
  '/name',
  authMiddleware,
  userController.updateName,
);

router.patch(
  '/gender',
  authMiddleware,
  userController.updateGender,
);

module.exports = router;