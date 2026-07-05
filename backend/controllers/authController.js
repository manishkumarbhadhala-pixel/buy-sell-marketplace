const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

// ---- SIGNUP FUNCTION ----
const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'all fields are required' });
    }

    const [existingUser] = await pool.query('select * from users where email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'user already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'insert into users (name,email,password,phone) values (?,?,?,?)', [name, email, hashedPassword, phone]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---- LOGIN FUNCTION ----
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // ✅ FIXED/ADDED: Check if user is blocked (JWT generate karne se pehle)
    if (user.is_blocked) {
      return res.status(403).json({ 
        message: 'Your account has been blocked.' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, login };