const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    // Token usually comes as: "Bearer <token>"
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided, access denied' });
    }

    const token = authHeader.split(' ')[1]; // splits "Bearer xyz" -> ["Bearer", "xyz"]

    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to request object, so next functions can use it
    req.user = decoded;

    next(); // move to the next function (the actual controller)

  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;