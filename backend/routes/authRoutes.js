const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { signup, login } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');
const { signupValidationRules, loginValidationRules, validate } = require('../validators/authValidator');

// Strict rate limiter just for login (brute-force protection)
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: { message: 'Too many login attempts, please try again after 15 minutes' }
// });

router.post('/signup', signupValidationRules, validate, signup);
router.post('/login', loginValidationRules, validate, login);

router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({ message: 'You accessed a protected route!', user: req.user });
});

module.exports = router;