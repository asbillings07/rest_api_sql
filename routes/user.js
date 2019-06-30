const express = require('express');
const router = express.Router();
const User = require('../models').User;
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
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

// validation for route
const validationChain = [
  check('firstName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for firstName'),
  check('lastName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for lastName'),
  check('emailAddress')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for emailAddress')
    .isEmail()
    .withMessage('Email Address must be formatted correctly'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for password')
    .isLength({ min: 8 })
    .withMessage('Please provide a password that is at least 8 chars long'),
];
// authentcation for users
const authenticateUser = (req, res, next) => {
  // Parse the user's credentials from the Authorization header.
  const creds = auth(req);
  // If the user's credentials are available...
  // Attempt to retrieve the user from the data store
  if (creds) {
    const users = User.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    }).then(user => {
      console.log(user);
    });

    const user = users.emailAddress === creds.name;

    // by their username (i.e. the user's "key"
    // from the Authorization header).
    if (user) {
      // If a user was successfully retrieved from the data store...
      // Use the bcryptjs npm package to compare the user's password
      // (from the Authorization header) to the user's password
      // that was retrieved from the data store.
      const authed = bcryptjs.compareSync(creds.pass, user.password);

      if (authed) {
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${creds.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

  if (message) {
    console.warn(message);

    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message: 'Access Denied', error: message });
  } else {
    // Or if user authentication succeeded...
    // Call the next() method.
    next();
  }
};
// User Routes
//GET /api/users 200 - Returns the currently authenticated user

router.get('/users', authenticateUser, async (req, res, next) => {
  const currentUser = req.currentUser;
  const user = await User.findAll({
    where: {
      currentUser,
    },
    attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
  });
  res.json(user);
  //   const user = req.currentUser;
  //   res.status(200).json({
  //     name: user.name,
  //     username: user.username,
  //   });
});

//POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', validationChain, async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    res.status(400).json({ errors: errorMessages });
  } else {
    const user = req.body;
    user.password = bcryptjs.hashSync(user.password);
    const users = await User.create({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      password: user.password,
    });
    res.status(201).json(users);
  }
});

module.exports = router;
