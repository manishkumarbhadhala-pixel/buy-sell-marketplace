const { body, validationResult } = require('express-validator');

const signupValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .isMobilePhone('en-IN').withMessage('Please provide a valid 10-digit phone number')
];

const loginValidationRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required')
];

// Common function to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(err => err.msg) });
  }
  next();
};

module.exports = { signupValidationRules, loginValidationRules, validate };