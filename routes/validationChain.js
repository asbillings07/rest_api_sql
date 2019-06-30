const { check } = require('express-validator');
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
    .withMessage('Email Address must be formatted correctly')
    .custom() // add check for dupe email
    .withMessage('Email Address already exists'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for password')
    .isLength({ min: 8 })
    .withMessage('Please provide a password that is at least 8 chars long'),
];
exports.validationChain = validationChain;
