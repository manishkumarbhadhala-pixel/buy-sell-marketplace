const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, phone, role, is_blocked, created_at FROM users ORDER BY created_at DESC'
    );
    res.status(200).json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all products (admin only - regardless of seller)
const getAllProductsAdmin = async (req, res) => {
  try {
    const [products] = await pool.query(
      `SELECT products.id, products.name, products.price, products.quantity, 
              products.image_url, products.created_at,
              users.name AS seller_name, users.email AS seller_email,
              categories.name AS category_name
       FROM products
       JOIN users ON products.seller_id = users.id
       LEFT JOIN categories ON products.category_id = categories.id
       ORDER BY products.created_at DESC`
    );
    res.status(200).json({ products });
  } catch (error) {
    console.error('Get all products (admin) error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete any product (admin override - no ownership check)
const deleteAnyProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];

    if (product.image_url) {
      const imagePath = path.join(__dirname, '..', product.image_url);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image file:', err.message);
      });
    }

    await pool.query('DELETE FROM products WHERE id = ?', [id]);

    res.status(200).json({ message: 'Product deleted by admin successfully' });
  } catch (error) {
    console.error('Admin delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user (admin only) - their products get deleted too via ON DELETE CASCADE
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [id]);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    const newStatus = !user.is_blocked; // toggle: blocked ↔ unblocked

    await pool.query('UPDATE users SET is_blocked = ? WHERE id = ?', [newStatus, id]);

    res.status(200).json({
      message: newStatus ? 'User blocked successfully' : 'User unblocked successfully',
      is_blocked: newStatus
    });

  } catch (error) {
    console.error('Toggle block user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllUsers, getAllProductsAdmin, deleteAnyProduct, deleteUser, toggleBlockUser };

