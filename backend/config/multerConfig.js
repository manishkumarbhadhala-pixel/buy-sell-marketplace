const multer = require('multer');
const path = require('path');

// Define storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/'); // folder where images will be saved
  },
  filename: (req, file, cb) => {
    // unique filename: timestamp + original extension
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg, .png, .webp files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

module.exports = upload;