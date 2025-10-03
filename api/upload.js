const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '-');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'text/plain',
    'application/json',
    'text/css',
    'text/html',
    'application/javascript'
  ];

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.txt', '.json', '.css', '.html', '.js'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Allowed types: ${allowedExtensions.join(', ')}`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 5 // Maximum 5 files per request
  }
});

// Single file upload
router.post('/single', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = {
      id: req.file.filename,
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      uploadedAt: new Date().toISOString()
    };

    // If it's an image, you could add image processing here
    if (req.file.mimetype.startsWith('image/')) {
      fileInfo.type = 'image';
      fileInfo.isImage = true;
    } else {
      fileInfo.type = 'document';
      fileInfo.isImage = false;
    }

    res.json({
      success: true,
      file: fileInfo
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      details: error.message
    });
  }
});

// Multiple files upload
router.post('/multiple', upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const filesInfo = req.files.map(file => ({
      id: file.filename,
      originalName: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
      type: file.mimetype.startsWith('image/') ? 'image' : 'document',
      isImage: file.mimetype.startsWith('image/'),
      uploadedAt: new Date().toISOString()
    }));

    res.json({
      success: true,
      files: filesInfo,
      count: filesInfo.length
    });

  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      details: error.message
    });
  }
});

// Get uploaded file info
router.get('/info/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', 'public', 'uploads', filename);
    
    try {
      const stats = await fs.stat(filePath);
      const ext = path.extname(filename).toLowerCase();
      
      const fileInfo = {
        filename,
        size: stats.size,
        url: `/uploads/${filename}`,
        type: ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? 'image' : 'document',
        isImage: ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext),
        createdAt: stats.birthtime.toISOString(),
        modifiedAt: stats.mtime.toISOString()
      };

      res.json({
        success: true,
        file: fileInfo
      });

    } catch (fileError) {
      res.status(404).json({
        error: 'File not found',
        filename
      });
    }

  } catch (error) {
    res.status(500).json({
      error: 'Failed to get file info',
      details: error.message
    });
  }
});

// Delete uploaded file
router.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', 'public', 'uploads', filename);
    
    try {
      await fs.unlink(filePath);
      res.json({
        success: true,
        message: 'File deleted successfully',
        filename
      });
    } catch (fileError) {
      res.status(404).json({
        error: 'File not found',
        filename
      });
    }

  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete file',
      details: error.message
    });
  }
});

// List all uploaded files
router.get('/list', async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
    
    try {
      const files = await fs.readdir(uploadsDir);
      const filesInfo = await Promise.all(
        files.map(async (filename) => {
          const filePath = path.join(uploadsDir, filename);
          const stats = await fs.stat(filePath);
          const ext = path.extname(filename).toLowerCase();
          
          return {
            filename,
            size: stats.size,
            url: `/uploads/${filename}`,
            type: ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? 'image' : 'document',
            isImage: ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext),
            createdAt: stats.birthtime.toISOString(),
            modifiedAt: stats.mtime.toISOString()
          };
        })
      );

      // Sort by creation date (newest first)
      filesInfo.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      res.json({
        success: true,
        files: filesInfo,
        count: filesInfo.length
      });

    } catch (dirError) {
      // Directory doesn't exist yet
      res.json({
        success: true,
        files: [],
        count: 0
      });
    }

  } catch (error) {
    res.status(500).json({
      error: 'Failed to list files',
      details: error.message
    });
  }
});

// Handle upload errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        maxSize: '10MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        maxFiles: 5
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Unexpected field name'
      });
    }
  }
  
  res.status(400).json({
    error: error.message
  });
});

module.exports = router;



