const { body, validationResult } = require('express-validator');

const addProductValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3 }).withMessage('Product name must be at least 3 characters'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),

  body('quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(err => err.msg) });
  }
  next();
};

module.exports = { addProductValidationRules, validate };