const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);
const ALLOWED_MIMETYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return cb(new Error(`Invalid file extension '${ext}'. Allowed: JPEG, PNG, WebP, GIF, SVG`));
    }
    if (!ALLOWED_MIMETYPES.has(file.mimetype.toLowerCase())) {
      return cb(new Error(`Invalid MIME type '${file.mimetype}'. Only authentic image types are allowed`));
    }
    cb(null, true);
  },
});

router.post('/', authenticate, authorize('super_admin'), (req, res) => {
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

    // Verify SVGs do not contain embedded scripts (Stored XSS mitigation)
    for (const file of req.files) {
      if (path.extname(file.filename).toLowerCase() === '.svg') {
        const content = fs.readFileSync(file.path, 'utf8');
        if (/<script|javascript:|onload=|onerror=/i.test(content)) {
          req.files.forEach((f) => {
            if (fs.existsSync(f.path)) {
              try { fs.unlinkSync(f.path); } catch (_) {}
            }
          });
          return res.status(400).json({
            success: false,
            message: 'Malicious SVG payload detected (embedded scripts or active event handlers)',
          });
        }
      }
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
