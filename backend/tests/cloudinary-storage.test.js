'use strict';

/**
 * Cloudinary Storage & Media Service Automated Test Suite
 */

process.env.NODE_ENV = 'test';
if (!process.env.DB_PORT) process.env.DB_PORT = '5434';
if (!process.env.DB_TEST_PORT) process.env.DB_TEST_PORT = process.env.DB_PORT || '5434';
if (!process.env.DB_HOST) process.env.DB_HOST = 'localhost';
if (!process.env.DB_TEST_HOST) process.env.DB_TEST_HOST = process.env.DB_HOST || 'localhost';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { storageService, cloudinaryProvider } = require('../services/storage');
const fileValidator = require('../libs/storage/file-validator');
const productService = require('../services/product.service');
const { Product, Category } = require('../models');

async function runStorageTests() {
  console.log('\n===============================================================');
  console.log('   STARTING CLOUDINARY STORAGE & MEDIA INTEGRATION TESTS');
  console.log('===============================================================');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    process.stdout.write(`• ${name} ... `);
    try {
      await fn();
      console.log('PASSED');
      passed++;
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      console.error(err);
      failed++;
    }
  }

  // 1. File Validator - Magic Bytes Inspection
  await test('1. File Validator detects authentic PNG header', () => {
    const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
    const detected = fileValidator.detectMimeTypeFromBuffer(pngBuffer);
    assert.strictEqual(detected, 'image/png');
  });

  await test('2. File Validator detects authentic JPEG header', () => {
    const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    const detected = fileValidator.detectMimeTypeFromBuffer(jpegBuffer);
    assert.strictEqual(detected, 'image/jpeg');
  });

  await test('3. File Validator detects authentic WebP header', () => {
    const webpBuffer = Buffer.from([
      0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
    ]);
    const detected = fileValidator.detectMimeTypeFromBuffer(webpBuffer);
    assert.strictEqual(detected, 'image/webp');
  });

  await test('4. File Validator rejects mismatched magic bytes (fake image payload)', () => {
    const fakeBuffer = Buffer.from('<?php echo "evil payload"; ?>');
    const fakeFile = {
      buffer: fakeBuffer,
      size: fakeBuffer.length,
      originalname: 'shell.jpg',
      mimetype: 'image/jpeg',
    };
    const validation = fileValidator.validateUploadedImage(fakeFile);
    assert.strictEqual(validation.valid, false);
    assert.match(validation.error, /signature/i);
  });

  await test('5. File Validator rejects malicious SVG script payloads (Stored XSS mitigation)', () => {
    const maliciousSvg = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg"><script>alert("XSS")</script></svg>'
    );
    const svgFile = {
      buffer: maliciousSvg,
      size: maliciousSvg.length,
      originalname: 'vector.svg',
      mimetype: 'image/svg+xml',
    };
    const validation = fileValidator.validateUploadedImage(svgFile);
    assert.strictEqual(validation.valid, false);
    assert.match(validation.error, /Malicious payload/i);
  });

  await test('6. Safe Public ID generation ignores user filename and uses random crypto suffix', () => {
    const id1 = fileValidator.generateSafePublicId('products');
    const id2 = fileValidator.generateSafePublicId('products');
    assert.ok(id1.startsWith('products/img_'));
    assert.ok(id2.startsWith('products/img_'));
    assert.notStrictEqual(id1, id2);
  });

  // 2. Storage Service & Cloudinary Public ID Extraction
  await test('7. Extracts public_id correctly from diverse Cloudinary URL patterns', () => {
    const url1 = 'https://res.cloudinary.com/aarogyamed/image/upload/v1728712345/products/img_12345.jpg';
    assert.strictEqual(storageService.extractPublicId(url1), 'products/img_12345');

    const url2 = 'https://res.cloudinary.com/aarogyamed/image/upload/f_auto,q_auto,w_400/v1728712345/products/img_67890.png';
    assert.strictEqual(storageService.extractPublicId(url2), 'products/img_67890');

    const url3 = 'https://res.cloudinary.com/aarogyamed/image/upload/products/img_abc.webp';
    assert.strictEqual(storageService.extractPublicId(url3), 'products/img_abc');

    const rawId = 'products/img_direct_id';
    assert.strictEqual(storageService.extractPublicId(rawId), 'products/img_direct_id');

    const localUrl = '/images/oxygen_concentrator.png';
    assert.strictEqual(storageService.extractPublicId(localUrl), null);
  });

  // 3. Variant Generation
  await test('8. Generates optimized variants with sensible dimensions (thumbnail, card, detail)', () => {
    const publicId = 'products/sample_unit';
    const rawUrl = 'https://res.cloudinary.com/aarogyamed/image/upload/v1234/products/sample_unit.jpg';
    const variants = storageService.getVariants(publicId, rawUrl);

    assert.ok(variants.thumbnail);
    assert.ok(variants.card);
    assert.ok(variants.detail);
    assert.ok(variants.optimized);

    assert.ok(variants.thumbnail.includes('150'));
    assert.ok(variants.card.includes('400'));
    assert.ok(variants.detail.includes('1000'));
    assert.ok(variants.optimized.includes('f_auto') || variants.optimized.includes('auto'));
  });

  // 4. Memory-Only Storage Verification
  await test('9. File uploads operate in-memory with ZERO writes to backend/uploads disk', async () => {
    const uploadsDir = path.join(__dirname, '../uploads');
    const filesBefore = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];

    const fakeBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
    process.env.MOCK_STORAGE = 'true';

    const uploadRes = await storageService.upload(fakeBuffer, {
      folder: 'products',
      public_id: 'products/test_memory_only_unit',
    });

    assert.ok(uploadRes.secure_url);
    assert.strictEqual(uploadRes.public_id, 'products/test_memory_only_unit');

    const filesAfter = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];
    assert.strictEqual(
      filesBefore.length,
      filesAfter.length,
      'No files should ever be written to local backend/uploads disk'
    );
  });

  // 5. Graceful Cloud Asset Deletion
  await test('10. Asset deletion handles errors gracefully without throwing', async () => {
    const result = await storageService.delete('products/non_existent_asset_id_9999');
    assert.ok(result);
  });

  // 6. Product Creation & Cloudinary public_id Synchronization
  await test('11. Product creation synchronizes image_public_ids from Cloudinary URLs', async () => {
    const testCat = await Category.findOne();
    const catId = testCat ? testCat.id : 1;

    const cloudImageUrl =
      'https://res.cloudinary.com/aarogyamed/image/upload/v1234/products/img_auto_sync_test.jpg';

    const testSlug = `test-cloud-sync-${Date.now()}`;
    const product = await productService.create({
      name: 'Cloudinary Test Product',
      slug: testSlug,
      category_id: catId,
      brand: 'Omkar Test Brand',
      description: 'Product for testing Cloudinary public_id synchronization',
      images: [cloudImageUrl],
      buy_price: 1500,
      buy_mrp: 1800,
      buy_available: true,
      stock_quantity: 10,
    });

    assert.ok(product);
    assert.ok(Array.isArray(product.image_public_ids));
    assert.strictEqual(product.image_public_ids.includes('products/img_auto_sync_test'), true);

    await productService.delete(product.id);
  });

  // 7. Product Update & Removed Cloud Asset Cleanup
  await test('12. Product update tracks and purges removed Cloudinary asset IDs', async () => {
    const testCat = await Category.findOne();
    const catId = testCat ? testCat.id : 1;

    const initialImg =
      'https://res.cloudinary.com/aarogyamed/image/upload/v1234/products/img_to_replace_1.jpg';
    const testSlug = `test-cloud-update-${Date.now()}`;

    const product = await productService.create({
      name: 'Cloudinary Replacement Test',
      slug: testSlug,
      category_id: catId,
      brand: 'Omkar Test Brand',
      description: 'Testing image replacement purge',
      images: [initialImg],
      buy_price: 2000,
      buy_mrp: 2500,
      buy_available: true,
    });

    assert.strictEqual(product.image_public_ids.includes('products/img_to_replace_1'), true);

    const newImg =
      'https://res.cloudinary.com/aarogyamed/image/upload/v1234/products/img_replacement_2.jpg';

    const updated = await productService.update(product.id, {
      images: [newImg],
    });

    assert.strictEqual(updated.image_public_ids.includes('products/img_replacement_2'), true);
    assert.strictEqual(updated.image_public_ids.includes('products/img_to_replace_1'), false);

    await productService.delete(product.id);
  });

  // 8. Fail-Fast Production Startup Check
  await test('13. Production environment fails fast at startup if Cloudinary config is missing', () => {
    const prevEnv = process.env.NODE_ENV;
    const prevCloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const prevApiKey = process.env.CLOUDINARY_API_KEY;
    const prevApiSecret = process.env.CLOUDINARY_API_SECRET;

    try {
      process.env.NODE_ENV = 'production';
      delete process.env.CLOUDINARY_CLOUD_NAME;
      delete process.env.CLOUDINARY_API_KEY;
      delete process.env.CLOUDINARY_API_SECRET;

      let threw = false;
      try {
        cloudinaryProvider.cloudName = undefined;
        cloudinaryProvider.apiKey = undefined;
        cloudinaryProvider.apiSecret = undefined;
        cloudinaryProvider.validateStartupConfig();
      } catch (err) {
        threw = true;
        assert.match(err.message, /Missing mandatory Cloudinary configuration in production/);
      }
      assert.strictEqual(threw, true, 'Must fail fast on missing production Cloudinary credentials');
    } finally {
      process.env.NODE_ENV = prevEnv;
      if (prevCloudName) process.env.CLOUDINARY_CLOUD_NAME = prevCloudName;
      if (prevApiKey) process.env.CLOUDINARY_API_KEY = prevApiKey;
      if (prevApiSecret) process.env.CLOUDINARY_API_SECRET = prevApiSecret;
      cloudinaryProvider.init();
    }
  });

  console.log('\n===============================================================');
  console.log(`CLOUDINARY STORAGE TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log('===============================================================\n');

  try {
    const { sequelize } = require('../models');
    await sequelize.close();
  } catch (_) {}

  process.exit(failed > 0 ? 1 : 0);
}

runStorageTests().catch((err) => {
  console.error('[FATAL] Unhandled test exception:', err);
  process.exit(1);
});
