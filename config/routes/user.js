const express = require('express');
const auth = require('../../app/controllers/auth');

const router = express.Router();
router.get(
  '/:id',
  // authMiddleWare,
  auth.getUser,
);
router.get(
  '/',
  // authMiddleWare,
  auth.getAllUsers,
);
module.exports = router;
