const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { AppError } = require('./errorHandler');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Define storage for different file types
const createStorage = (folder) => {
  const storageDir = path.join(uploadsDir, folder);
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, storageDir);
    },
    filename: (req, file, cb) => {
      // Create unique filename with original extension
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
  });
};

// File filter to only allow certain types
const fileFilter = (req, file, cb) => {
  // Allow common image types
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else if (file.mimetype === 'application/msword' || 
             file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new AppError('Not an allowed file type. Please upload only images, PDFs, or Word documents.', 400), false);
  }
};

// Create different upload instances
const logoUpload = multer({
  storage: createStorage('logos'),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Please upload only images for logos', 400), false);
    }
  }
});

const documentUpload = multer({
  storage: createStorage('documents'),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter
});

const attachmentUpload = multer({
  storage: createStorage('attachments'),
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB max
  },
  fileFilter
});

const profilePictureUpload = multer({
  storage: createStorage('profiles'),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Please upload only images for profile pictures', 400), false);
    }
  }
});

// Helper to get file URL from saved file
const getFileUrl = (req, file) => {
  if (!file) return null;
  const relativePath = path.relative(uploadsDir, file.path);
  return `${req.protocol}://${req.get('host')}/uploads/${relativePath.replace(/\\/g, '/')}`;
};

module.exports = {
  logoUpload,
  documentUpload,
  attachmentUpload,
  profilePictureUpload,
  getFileUrl
}; 