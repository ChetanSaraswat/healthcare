'use strict';

const crypto = require('crypto');
const path = require('path');

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);

const ALLOWED_MIMETYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

/**
 * Inspects buffer header bytes to identify known image signatures.
 * @param {Buffer} buffer
 * @returns {string|null} Detected MIME type or null if unrecognized
 */
function detectMimeTypeFromBuffer(buffer) {
  if (!buffer || buffer.length < 4) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  // GIF: GIF87a or GIF89a
  if (
    buffer.length >= 6 &&
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return 'image/gif';
  }

  // WebP: RIFF (bytes 0-3) and WEBP (bytes 8-11)
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return 'image/webp';
  }

  // SVG: Inspect text content for XML/SVG indicators
  try {
    const textSnippet = buffer.subarray(0, 512).toString('utf8').trim();
    if (
      (textSnippet.startsWith('<?xml') || textSnippet.startsWith('<svg') || textSnippet.includes('<svg')) &&
      /<svg[^>]*>/i.test(textSnippet)
    ) {
      return 'image/svg+xml';
    }
  } catch (_) {
    // Binary decoding error, not valid SVG
  }

  return null;
}

/**
 * Deep security check for SVG buffers to prevent Stored XSS attacks.
 * @param {Buffer} buffer
 * @returns {{ safe: boolean, reason?: string }}
 */
function inspectSvgSafety(buffer) {
  const content = buffer.toString('utf8');
  const dangerousPatterns = [
    /<script[\s>]/i,
    /<\/script>/i,
    /javascript:/i,
    /data:text\/html/i,
    /onload[\s=]/i,
    /onerror[\s=]/i,
    /onclick[\s=]/i,
    /onmouseover[\s=]/i,
    /<foreignObject[\s>]/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(content)) {
      return {
        safe: false,
        reason: 'Malicious payload or executable script detected in SVG',
      };
    }
  }

  return { safe: true };
}

/**
 * Validates an uploaded file's metadata, size, MIME type, and binary magic bytes.
 * @param {object} file Express Multer file object with memory buffer
 * @returns {{ valid: boolean, error?: string }}
 */
function validateUploadedImage(file) {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!file.buffer || !Buffer.isBuffer(file.buffer) || file.buffer.length === 0) {
    return { valid: false, error: 'Empty file buffer received' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  const rawExt = path.extname(file.originalname || '').toLowerCase();
  if (rawExt && !ALLOWED_EXTENSIONS.has(rawExt)) {
    return {
      valid: false,
      error: `Invalid file extension '${rawExt}'. Allowed: JPEG, PNG, WebP, GIF, SVG`,
    };
  }

  const declaredMime = (file.mimetype || '').toLowerCase();
  if (!ALLOWED_MIMETYPES.has(declaredMime)) {
    return {
      valid: false,
      error: `Invalid MIME type '${file.mimetype}'. Only authentic image types are allowed`,
    };
  }

  const detectedMime = detectMimeTypeFromBuffer(file.buffer);
  if (!detectedMime) {
    return {
      valid: false,
      error: 'File signature verification failed: Corrupted or unrecognizable image header',
    };
  }

  if (declaredMime !== detectedMime) {
    const isJpegVariant =
      (declaredMime === 'image/jpeg' || declaredMime === 'image/pjpeg') &&
      detectedMime === 'image/jpeg';
    if (!isJpegVariant) {
      return {
        valid: false,
        error: `File signature mismatch: Claimed '${declaredMime}' but detected binary magic bytes for '${detectedMime}'`,
      };
    }
  }

  if (detectedMime === 'image/svg+xml') {
    const svgCheck = inspectSvgSafety(file.buffer);
    if (!svgCheck.safe) {
      return { valid: false, error: svgCheck.reason };
    }
  }

  return { valid: true };
}

/**
 * Generates an unguessable, cryptographically secure public ID for cloud storage.
 * Completely ignores user-supplied filenames to prevent directory traversal and injection.
 * @param {string} folder Destination folder (default 'products')
 * @returns {string} Safe public_id path e.g. "products/img_1791785000000_a1b2c3d4e5f60718"
 */
function generateSafePublicId(folder = 'products') {
  const cleanFolder = (folder || 'products').replace(/^\/+|\/+$/g, '');
  const timestamp = Date.now();
  const randomSuffix = crypto.randomBytes(8).toString('hex');
  return `${cleanFolder}/img_${timestamp}_${randomSuffix}`;
}

module.exports = {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIMETYPES,
  MAX_FILE_SIZE,
  detectMimeTypeFromBuffer,
  inspectSvgSafety,
  validateUploadedImage,
  generateSafePublicId,
};
