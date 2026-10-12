'use strict';

const cloudinary = require('cloudinary').v2;
const stream = require('stream');

class CloudinaryProvider {
  constructor() {
    this.name = 'cloudinary';
    this.init();
  }

  init() {
    this.cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    this.apiKey = process.env.CLOUDINARY_API_KEY;
    this.apiSecret = process.env.CLOUDINARY_API_SECRET;
    this.defaultFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'products';

    if (this.isConfigured()) {
      cloudinary.config({
        cloud_name: this.cloudName,
        api_key: this.apiKey,
        api_secret: this.apiSecret,
        secure: true,
      });
    }

    this.validateStartupConfig();
  }

  /**
   * Validates mandatory environment configuration.
   * Fails fast at startup in production environments.
   */
  validateStartupConfig() {
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction && !this.isConfigured()) {
      const missing = [];
      if (!this.cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
      if (!this.apiKey) missing.push('CLOUDINARY_API_KEY');
      if (!this.apiSecret) missing.push('CLOUDINARY_API_SECRET');
      throw new Error(
        `[CRITICAL STARTUP ERROR] Missing mandatory Cloudinary configuration in production: ${missing.join(', ')}. ` +
        `Multi-instance ephemeral deployments require persistent cloud media storage.`
      );
    }
  }

  /**
   * Returns true if all required credentials are present.
   * @returns {boolean}
   */
  isConfigured() {
    return Boolean(this.cloudName && this.apiKey && this.apiSecret);
  }

  /**
   * Uploads a file buffer to Cloudinary via stream.
   * Never persists to local disk.
   *
   * @param {Buffer} buffer File buffer in memory
   * @param {object} options Upload configuration
   * @returns {Promise<object>} Upload result with secure_url, public_id, and optimized variants
   */
  async uploadBuffer(buffer, options = {}) {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      throw new Error('Valid file buffer is required for upload');
    }

    if (!this.isConfigured()) {
      if (process.env.NODE_ENV === 'test' && process.env.MOCK_STORAGE === 'true') {
        const publicId = options.public_id || `${this.defaultFolder}/mock_${Date.now()}`;
        return {
          public_id: publicId,
          secure_url: `https://res.cloudinary.com/mock-cloud/image/upload/v1/${publicId}.jpg`,
          format: 'jpg',
          bytes: buffer.length,
          resource_type: 'image',
          variants: this.generateVariants(
            publicId,
            `https://res.cloudinary.com/mock-cloud/image/upload/v1/${publicId}.jpg`
          ),
        };
      }

      throw new Error(
        'Cloud storage provider is not configured. Please define CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables.'
      );
    }

    const folder = (options.folder || this.defaultFolder).replace(/^\/+|\/+$/g, '');
    const resourceType = options.resource_type || 'auto';
    const timeoutMs = options.timeoutMs || 25000;

    const uploadPromise = new Promise((resolve, reject) => {
      const uploadParams = {
        folder,
        resource_type: resourceType,
        overwrite: options.overwrite !== undefined ? options.overwrite : true,
      };

      if (options.public_id) {
        uploadParams.public_id = options.public_id;
      }

      const uploadStream = cloudinary.uploader.upload_stream(uploadParams, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });

      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);
      bufferStream.pipe(uploadStream);
    });

    let timeoutHandle;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutHandle = setTimeout(() => {
        reject(new Error(`Cloud storage upload timed out after ${timeoutMs / 1000} seconds`));
      }, timeoutMs);
    });

    try {
      const rawResult = await Promise.race([uploadPromise, timeoutPromise]);
      clearTimeout(timeoutHandle);

      const variants = this.generateVariants(rawResult.public_id, rawResult.secure_url);

      return {
        public_id: rawResult.public_id,
        secure_url: variants.optimized || rawResult.secure_url,
        raw_secure_url: rawResult.secure_url,
        format: rawResult.format,
        bytes: rawResult.bytes,
        width: rawResult.width,
        height: rawResult.height,
        resource_type: rawResult.resource_type,
        variants,
      };
    } catch (err) {
      clearTimeout(timeoutHandle);
      throw new Error(`Cloudinary upload failed: ${err.message || 'Unknown network error'}`);
    }
  }

  /**
   * Deletes an asset by public_id.
   * Gracefully logs and continues on failure; never crashes the request.
   *
   * @param {string} publicId
   * @param {object} options
   * @returns {Promise<object>}
   */
  async deleteFile(publicId, options = {}) {
    if (!publicId || typeof publicId !== 'string') {
      return { result: 'ignored', reason: 'empty_or_invalid_public_id' };
    }

    if (!this.isConfigured()) {
      console.warn(`[CloudinaryProvider] Skip deletion for '${publicId}': Cloudinary credentials not configured.`);
      return { result: 'skipped_not_configured' };
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
        resource_type: options.resource_type || 'image',
        ...options,
      });

      console.log(`[CloudinaryProvider] Asset deletion response for '${publicId}':`, result?.result || result);
      return result;
    } catch (err) {
      console.error(`[CloudinaryProvider] Asset deletion failure for '${publicId}':`, err.message);
      return { result: 'error', error: err.message };
    }
  }

  /**
   * Generates responsive variant URLs and optimized delivery links.
   * @param {string} publicId
   * @param {string} rawSecureUrl
   * @returns {object}
   */
  generateVariants(publicId, rawSecureUrl = '') {
    if (!publicId) return { original: rawSecureUrl };

    try {
      if (this.isConfigured()) {
        return {
          optimized: cloudinary.url(publicId, {
            fetch_format: 'auto',
            quality: 'auto',
            secure: true,
          }),
          thumbnail: cloudinary.url(publicId, {
            width: 150,
            height: 150,
            crop: 'fill',
            gravity: 'auto',
            fetch_format: 'auto',
            quality: 'auto',
            secure: true,
          }),
          card: cloudinary.url(publicId, {
            width: 400,
            height: 400,
            crop: 'limit',
            fetch_format: 'auto',
            quality: 'auto',
            secure: true,
          }),
          detail: cloudinary.url(publicId, {
            width: 1000,
            height: 1000,
            crop: 'limit',
            fetch_format: 'auto',
            quality: 'auto',
            secure: true,
          }),
          original: rawSecureUrl || cloudinary.url(publicId, { secure: true }),
        };
      }
    } catch (_) {
      // Fallback below
    }

    if (rawSecureUrl && rawSecureUrl.includes('/image/upload/')) {
      const transform = (t) => rawSecureUrl.replace('/image/upload/', `/image/upload/${t}/`);
      return {
        optimized: transform('f_auto,q_auto'),
        thumbnail: transform('f_auto,q_auto,w_150,h_150,c_fill'),
        card: transform('f_auto,q_auto,w_400,h_400,c_limit'),
        detail: transform('f_auto,q_auto,w_1000,h_1000,c_limit'),
        original: rawSecureUrl,
      };
    }

    return {
      optimized: rawSecureUrl,
      thumbnail: rawSecureUrl,
      card: rawSecureUrl,
      detail: rawSecureUrl,
      original: rawSecureUrl,
    };
  }

  /**
   * Extracts public_id from a Cloudinary URL or raw path.
   * Handles transformed URLs, versions, and extensions.
   *
   * @param {string} urlOrPath
   * @returns {string|null}
   */
  extractPublicId(urlOrPath) {
    if (!urlOrPath || typeof urlOrPath !== 'string') return null;
    const trimmed = urlOrPath.trim();

    if (!trimmed.includes('res.cloudinary.com')) {
      if (!trimmed.startsWith('http') && !trimmed.startsWith('/')) {
        return trimmed.replace(/\.[a-zA-Z0-9]+$/, '');
      }
      return null;
    }

    const uploadIndex = trimmed.indexOf('/upload/');
    if (uploadIndex === -1) return null;

    const pathAfterUpload = trimmed.slice(uploadIndex + '/upload/'.length);
    const parts = pathAfterUpload.split('/');

    const resourceParts = parts.filter((part) => {
      if (/^v\d+$/.test(part)) return false;
      if (part.includes(',') || /^(w_|h_|c_|q_|f_|b_|e_|fl_|dpr_|g_)/.test(part)) return false;
      return true;
    });

    if (resourceParts.length === 0) return null;
    const cleanPath = resourceParts.join('/');
    return cleanPath.replace(/\.[a-zA-Z0-9]+$/, '');
  }
}

module.exports = new CloudinaryProvider();
