const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const cleanBase = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${cleanBase || 'product'}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 }, // 12MB limit per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, SVG, GIF) are allowed'), false);
    }
  },
});

router.post('/', (req, res) => {
  upload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const host = req.get('host') || 'localhost:8080';
    const protocol = req.protocol || 'http';
    const baseUrl = `${protocol}://${host}`;
    const urls = req.files.map((file) => `${baseUrl}/uploads/${file.filename}`);

    return res.status(200).json({
      success: true,
      message: `${req.files.length} file(s) uploaded successfully`,
      data: {
        url: urls[0],
        urls,
        files: req.files.map((f) => ({
          filename: f.filename,
          originalName: f.originalname,
          size: f.size,
          mimetype: f.mimetype,
          url: `${baseUrl}/uploads/${f.filename}`,
          relativeUrl: `/uploads/${f.filename}`,
        })),
      },
    });
  });
});

module.exports = router;
