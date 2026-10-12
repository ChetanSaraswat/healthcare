'use strict';

const cloudinaryProvider = require('./cloudinary.provider');

/**
 * StorageService provides an abstract interface for object storage operations.
 * Decouples the application layer and controllers from specific cloud providers.
 */
class StorageService {
  constructor(provider = cloudinaryProvider) {
    this.provider = provider;
  }

  /**
   * Set or swap the underlying storage provider (e.g. S3, Cloudflare R2, Cloudinary).
   * @param {object} provider
   */
  setProvider(provider) {
    this.provider = provider;
  }

  /**
   * Check if the active storage provider has valid credentials.
   * @returns {boolean}
   */
  isConfigured() {
    return this.provider.isConfigured();
  }

  /**
   * Stream a file buffer directly to cloud storage.
   * @param {Buffer} buffer File buffer in memory
   * @param {object} options Upload configuration
   * @returns {Promise<object>} Upload metadata
   */
  async upload(buffer, options = {}) {
    return await this.provider.uploadBuffer(buffer, options);
  }

  /**
   * Delete an asset by its public ID.
   * Must handle failures gracefully without throwing unhandled exceptions.
   * @param {string} publicId
   * @param {object} options
   * @returns {Promise<object>}
   */
  async delete(publicId, options = {}) {
    return await this.provider.deleteFile(publicId, options);
  }

  /**
   * Generates optimized variant links for responsive rendering.
   * @param {string} publicId
   * @param {string} rawSecureUrl
   * @returns {object} Variants map (thumbnail, card, detail, optimized)
   */
  getVariants(publicId, rawSecureUrl = '') {
    return this.provider.generateVariants(publicId, rawSecureUrl);
  }

  /**
   * Extracts public ID from an asset URL.
   * @param {string} urlOrPath
   * @returns {string|null}
   */
  extractPublicId(urlOrPath) {
    return this.provider.extractPublicId(urlOrPath);
  }
}

module.exports = new StorageService();
