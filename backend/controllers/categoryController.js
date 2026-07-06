const pool = require('../config/db');

const getAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(
      `SELECT * FROM categories 
       ORDER BY 
         CASE WHEN name = 'Others' THEN 1 ELSE 0 END, 
         name ASC`
    );
    res.status(200).json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin only - add new category
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const [existing] = await pool.query('SELECT * FROM categories WHERE name = ?', [name.trim()]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name.trim()]);

    res.status(201).json({ message: 'Category added successfully', categoryId: result.insertId });
  } catch (error) {
    console.error('Add category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin only - delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await pool.query('DELETE FROM categories WHERE id = ?', [id]);

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin only - update category name
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const [existing] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const [duplicate] = await pool.query('SELECT * FROM categories WHERE name = ? AND id != ?', [name.trim(), id]);
    if (duplicate.length > 0) {
      return res.status(400).json({ message: 'Another category with this name already exists' });
    }

    await pool.query('UPDATE categories SET name = ? WHERE id = ?', [name.trim(), id]);

    res.status(200).json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllCategories, addCategory, deleteCategory, updateCategory };