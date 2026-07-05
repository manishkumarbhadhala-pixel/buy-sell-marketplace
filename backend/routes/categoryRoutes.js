const express = require('express');
const router = express.Router();
const { getAllCategories } = require('../controllers/categoryController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAllCategories);

module.exports = router;