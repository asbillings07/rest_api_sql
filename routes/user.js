const express = require('express');
const router = express.Router();
const User = require('../models').User;

// middleware error handler

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await (req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

// User Routes
//GET /api/users 200 - Returns the currently authenticated user

router.get('/users', async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  res.status(200).json(users);
});

//POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', async (req, res, next) => {
  await User.create();
});

module.exports = router;
