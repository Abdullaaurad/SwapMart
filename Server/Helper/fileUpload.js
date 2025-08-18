// helpers/fileUpload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Create uploads directory structure
const createUploadDirs = () => {
  const uploadDirs = [
    'Uploads/Profile',
    'Uploads/Product',
    'Uploads/Offer',
  ];
  
  uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Initialize upload directories
createUploadDirs();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('fileUpload - req.body:', req.body);
    console.log('fileUpload - req.body.folderType:', req.body.folderType);
    console.log('fileUpload - typeof req.body.folderType:', typeof req.body.folderType);
    const folderType = req.body.folderType || 'Profile';
    console.log('fileUpload - folderType:', folderType);
    const uploadPath = `Uploads/${folderType}`;
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  
  filename: (req, file, cb) => {
    console.log('fileUpload - filename - req.body:', req.body);
    console.log('fileUpload - filename - typeof req.body.folderType:', typeof req.body.folderType);
    const userId = req.user?.id || req.body.userId || 'anonymous';
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(file.originalname);
    const folderType = req.body.folderType || 'Profile';
    console.log('fileUpload - filename - folderType:', folderType);
    
    const filename = `${folderType.toLowerCase()}_${userId}_${timestamp}_${randomString}${extension}`;
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'Profile': ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    'Product': ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    'Offer': ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    'Documents': ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword']
  };
  
  console.log('fileUpload - fileFilter - req.body:', req.body);
  console.log('fileUpload - fileFilter - typeof req.body.folderType:', typeof req.body.folderType);
  const folderType = req.body.folderType || 'Profile';
  console.log('fileUpload - fileFilter - folderType:', folderType);
  const allowedForFolder = allowedTypes[folderType] || allowedTypes['Profile'];
  
  if (allowedForFolder.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${folderType}. Allowed types: ${allowedForFolder.join(', ')}`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Helper function to handle single file upload
const handleSingleUpload = (req, res, fieldName = 'image') => {
  return new Promise((resolve, reject) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            reject({
              success: false,
              message: 'File size too large. Maximum size is 5MB.',
              statusCode: 400
            });
            return;
          }
        }
        reject({
          success: false,
          message: err.message,
          statusCode: 400
        });
        return;
      }
      
      // Return file info if file was uploaded
      if (req.file) {
        console.log('handleSingleUpload - req.body:', req.body);
        console.log('handleSingleUpload - req.body.folderType:', req.body.folderType);
        console.log('handleSingleUpload - typeof req.body.folderType:', typeof req.body.folderType);
        const fileInfo = {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: req.file.path,
          size: req.file.size,
          mimetype: req.file.mimetype,
          folder: req.body.folderType || 'Profile'
        };
        resolve(fileInfo);
      } else {
        resolve(null); // No file uploaded
      }
    });
  });
};

// Helper function to handle multiple file upload
const handleMultipleUpload = (req, res, fieldName = 'images', maxCount = 5) => {
  return new Promise((resolve, reject) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            reject({
              success: false,
              message: 'File size too large. Maximum size is 5MB per file.',
              statusCode: 400
            });
            return;
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            reject({
              success: false,
              message: `Too many files. Maximum allowed: ${maxCount}`,
              statusCode: 400
            });
            return;
          }
        }
        reject({
          success: false,
          message: err.message,
          statusCode: 400
        });
        return;
      }
      
      // Return files info if files were uploaded
      if (req.files && req.files.length > 0) {
        console.log('handleMultipleUpload - req.body:', req.body);
        console.log('handleMultipleUpload - req.body.folderType:', req.body.folderType);
        console.log('handleMultipleUpload - typeof req.body.folderType:', typeof req.body.folderType);
        const filesInfo = req.files.map(file => ({
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype,
          folder: req.body.folderType || 'Profile'
        }));
        resolve(filesInfo);
      } else {
        resolve(null); // No files uploaded
      }
    });
  });
};

// Utility function to delete file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Generate file URL without request object (for use in other contexts)
const generateFileUrl = (baseUrl, filename, folder = 'Profile') => {
  return `${baseUrl}/Uploads/${folder}/${filename}`;
};

module.exports = {
  handleSingleUpload,
  handleMultipleUpload,
  deleteFile,
  generateFileUrl,
  createUploadDirs,
  upload
};
