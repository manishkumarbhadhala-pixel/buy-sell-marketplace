const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, getMyProducts, getProductById, deleteProduct ,updateProduct} = require('../controllers/productController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');
const { addProductValidationRules, validate } = require('../validators/productValidator');

router.post('/add', verifyToken, upload.single('image'), addProductValidationRules, validate, addProduct);
router.get('/all', verifyToken, getAllProducts);
router.get('/my-products', verifyToken, getMyProducts);
router.get('/:id', verifyToken, getProductById);
router.put('/:id', verifyToken, upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;