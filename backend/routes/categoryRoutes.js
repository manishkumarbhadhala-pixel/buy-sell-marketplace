const express = require('express');
const router = express.Router();
const { getAllCategories, addCategory, deleteCategory, updateCategory } = require('../controllers/categoryController')
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

router.get('/', verifyToken, getAllCategories);
router.post('/', verifyToken, isAdmin, addCategory);
router.put('/:id', verifyToken, isAdmin, updateCategory);
router.delete('/:id', verifyToken, isAdmin, deleteCategory);

module.exports = router;