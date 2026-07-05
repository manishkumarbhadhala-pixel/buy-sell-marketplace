const pool = require('../config/db');

const getAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.status(200).json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllCategories };