import multer from 'multer';
import path from 'path';

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/'); // Ensure the 'uploads' folder exists
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname); // Add timestamp to avoid duplicate names
  },
});

// File filter to allow only images
const fileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif') {
    callback(null, true);
  } else {
    callback(new Error('Only image files are allowed'), false);
  }
};

// Initialize multer
const upload = multer({ storage, fileFilter });

export default upload;