const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File size too large. Max 5MB allowed.' });
  }

  // Multer file type error (from our custom fileFilter)
  if (err.message && err.message.includes('Only .jpeg')) {
    return res.status(400).json({ message: err.message });
  }

  // MySQL duplicate entry error
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({ message: 'Duplicate entry, this record already exists' });
  }

  // Default: generic server error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Something went wrong on the server'
  });
};

module.exports = errorHandler;