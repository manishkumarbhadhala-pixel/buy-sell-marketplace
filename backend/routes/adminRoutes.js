const express = require('express');
const router = express.Router();
const { getAllUsers, getAllProductsAdmin, deleteAnyProduct, deleteUser, toggleBlockUser } = require('../controllers/adminController');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

router.get('/users', verifyToken, isAdmin, getAllUsers);
router.get('/products', verifyToken, isAdmin, getAllProductsAdmin);
router.delete('/products/:id', verifyToken, isAdmin, deleteAnyProduct);
router.delete('/users/:id', verifyToken, isAdmin, deleteUser);
router.put('/users/:id/block', verifyToken, isAdmin, toggleBlockUser);

module.exports = router;