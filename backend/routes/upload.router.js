'use strict';

const express = require('express');
const multer = require('multer');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { storageService } = require('../services');
const {
  validateUploadedImage,
  MAX_FILE_SIZE,
} = require('../libs/storage/file-validator');

const router = express.Router();

// Ephemeral memory storage: never persists uploaded bytes to local disk
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
});

/**
 * POST /uploads
 * Secure administrative media upload directly to cloud storage via in-memory streaming.
 */
router.post('/', authenticate, authorize('super_admin'), (req, res) => {
  upload.any()(req, res, async (err) => {
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

    // Step 1: Strict validation of magic bytes, MIME types, and payload safety
    for (const file of req.files) {
      const validation = validateUploadedImage(file);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.error || 'Invalid or unauthorized file format',
        });
      }
    }

    // Step 2: Stream in-memory buffers directly to cloud storage
    try {
      const uploadResults = [];
      const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'products';

      for (const file of req.files) {
        const uploadResult = await storageService.upload(file.buffer, {
          folder,
          resource_type: 'auto',
        });
        uploadResults.push({
          ...uploadResult,
          originalName: file.originalname,
          mimetype: file.mimetype,
        });
      }

      const urls = uploadResults.map((r) => r.secure_url);
      const primaryResult = uploadResults[0];

      return res.status(200).json({
        success: true,
        message: `${uploadResults.length} file(s) uploaded successfully`,
        data: {
          url: primaryResult.secure_url,
          public_id: primaryResult.public_id,
          urls,
          files: uploadResults.map((r) => ({
            url: r.secure_url,
            secure_url: r.secure_url,
            public_id: r.public_id,
            variants: r.variants,
            size: r.bytes,
            format: r.format,
            mimetype: r.mimetype,
          })),
        },
      });
    } catch (uploadError) {
      console.error('[UploadRouter] Media cloud upload failed:', uploadError.message);
      return res.status(500).json({
        success: false,
        message: 'Image upload to cloud storage failed. Please check storage configuration and try again.',
        error: process.env.NODE_ENV === 'production' ? undefined : uploadError.message,
      });
    }
  });
});

/**
 * DELETE /uploads/:publicId(*)
 * Administrative deletion of cloud assets by public_id.
 */
router.delete('/:publicId(*)', authenticate, authorize('super_admin'), async (req, res) => {
  const publicId = req.params.publicId;

  if (!publicId) {
    return res.status(400).json({
      success: false,
      message: 'public_id is required for deletion',
    });
  }

  try {
    const result = await storageService.delete(publicId);
    return res.status(200).json({
      success: true,
      message: `Asset '${publicId}' deletion processed`,
      data: result,
    });
  } catch (deleteError) {
    console.error(`[UploadRouter] Deletion failed for '${publicId}':`, deleteError.message);
    return res.status(200).json({
      success: true,
      message: 'Asset deletion completed with notice',
      notice: deleteError.message,
    });
  }
});

module.exports = router;
