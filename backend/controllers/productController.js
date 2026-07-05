const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

// 1. ADD PRODUCT (Category support ke sath)
const addProduct = async (req, res) => {
  try {
    const { name, description, price, original_price, quantity, category_id } = req.body;
    const sellerId = req.user.userId;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    if (!category_id) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : null;

    const [result] = await pool.query(
      'INSERT INTO products (seller_id, name, description, price, original_price, quantity, image_url, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [sellerId, name, description || null, price, original_price || null, quantity || 1, imageUrl, category_id]
    );

    res.status(201).json({
      message: 'Product added successfully',
      productId: result.insertId,
      imageUrl
    });

  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. GET ALL PRODUCTS — ✅ STEP 7: Category Filter & Category Name Support Added
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { category_id, search } = req.query;

    let whereClause = 'WHERE 1=1';
    const queryParams = [];

    if (category_id) {
      whereClause += ' AND products.category_id = ?';
      queryParams.push(category_id);
    }

    if (search) {
      whereClause += ' AND products.name LIKE ?';
      queryParams.push(`%${search}%`);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) AS total FROM products ${whereClause}`,
      queryParams
    );
    const totalProducts = countResult[0].total;
    const totalPages = Math.ceil(totalProducts / limit);

    const [products] = await pool.query(
      `SELECT products.id, products.name, products.price, products.quantity, 
              products.image_url, products.created_at, categories.name AS category_name
       FROM products
       LEFT JOIN categories ON products.category_id = categories.id
       ${whereClause}
       ORDER BY products.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    res.status(200).json({
      products,
      pagination: { currentPage: page, totalPages, totalProducts, limit }
    });

  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. GET MY PRODUCTS
const getMyProducts = async (req, res) => {
  try {
    const sellerId = req.user.userId;

    const [products] = await pool.query(
      'select id , name , price , quantity , image_url , created_at from products where seller_id = ? order by created_at desc', [sellerId]
    );

    res.status(200).json({ products });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. GET PRODUCT BY ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.query(
      `SELECT 
        products.id, 
        products.name, 
        products.description, 
        products.price, 
        products.original_price,
        products.quantity, 
        products.image_url, 
        products.created_at,
        users.name AS seller_name,
        users.phone AS seller_phone,
        categories.name AS category_name
      FROM products
      JOIN users ON products.seller_id = users.id
      LEFT JOIN categories ON products.category_id = categories.id
      WHERE products.id = ?`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ product: products[0] });

  } catch (error) {
    console.error('Get product by id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. UPDATE PRODUCT — ✅ STEP 6: Optional category_id Update Bypassed
// 5. UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { name, description, price, original_price, quantity, category_id } = req.body;

    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];

    if (product.seller_id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this product' });
    }

    let imageUrl = product.image_url;

    if (req.file) {
      if (product.image_url) {
        const oldImagePath = path.join(__dirname, '..', product.image_url);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err.message);
        });
      }
      imageUrl = `/uploads/products/${req.file.filename}`;
    }

    const updatedName = name || product.name;
    const updatedDescription = description !== undefined ? description : product.description;
    const updatedPrice = price || product.price;
    const updatedOriginalPrice = original_price || product.original_price;
    const updatedQuantity = quantity || product.quantity;
    const updatedCategoryId = category_id || product.category_id;

    await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, original_price = ?, quantity = ?, image_url = ?, category_id = ? WHERE id = ?',
      [updatedName, updatedDescription, updatedPrice, updatedOriginalPrice, updatedQuantity, imageUrl, updatedCategoryId, id]
    );

    res.status(200).json({ message: 'Product updated successfully' });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 6. DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];

    if (product.seller_id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this product' });
    }

    if (product.image_url) {
      const imagePath = path.join(__dirname, '..', product.image_url);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image file:', err.message);
      });
    }

    await pool.query('DELETE FROM products WHERE id = ?', [id]);

    res.status(200).json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addProduct, getAllProducts, getMyProducts, getProductById, deleteProduct, updateProduct };