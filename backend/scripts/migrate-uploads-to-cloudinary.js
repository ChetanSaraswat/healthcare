'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Product, Category, Banner, BlogPost } = require('../models');
const { storageService } = require('../services');

async function migrateUploads() {
  const isDryRun = process.argv.includes('--dry-run');
  const uploadsDir = path.join(__dirname, '../uploads');
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'products';

  console.log('===============================================================');
  console.log('   AAROGYAMED - LOCAL DISK TO CLOUDINARY MEDIA MIGRATION');
  console.log('===============================================================');
  console.log(`Mode:            ${isDryRun ? 'DRY-RUN (Simulated, no changes made)' : 'LIVE EXECUTION'}`);
  console.log(`Source Folder:   ${uploadsDir}`);
  console.log(`Cloud Folder:    ${folder}`);
  console.log(`Storage Status:  ${storageService.isConfigured() ? 'Cloudinary Configured' : 'Credentials Missing'}`);
  console.log('---------------------------------------------------------------\n');

  if (!fs.existsSync(uploadsDir)) {
    console.log(`Source uploads folder '${uploadsDir}' does not exist. Nothing to migrate.`);
    process.exit(0);
  }

  const allEntries = fs.readdirSync(uploadsDir);
  const files = allEntries.filter((file) => {
    if (file.startsWith('.') || file === '.gitkeep') return false;
    const fullPath = path.join(uploadsDir, file);
    try {
      return fs.statSync(fullPath).isFile();
    } catch (_) {
      return false;
    }
  });

  if (files.length === 0) {
    console.log('No media files found in backend/uploads. Nothing to migrate.');
    process.exit(0);
  }

  console.log(`Found ${files.length} file(s) in backend/uploads:\n${files.map((f) => ` - ${f}`).join('\n')}\n`);

  if (!isDryRun && !storageService.isConfigured()) {
    console.error('[ERROR] Cannot run live migration: Cloudinary environment variables are missing.');
    console.error('Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.');
    console.error('Or run with --dry-run to simulate.');
    process.exit(1);
  }

  const products = await Product.findAll();
  const categories = await Category.findAll();
  const banners = await Banner.findAll();
  const blogPosts = await BlogPost.findAll();

  let migratedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    const fileStats = fs.statSync(filePath);

    const matchingProducts = products.filter((p) => {
      const imgString = JSON.stringify(p.images || []);
      return imgString.includes(file);
    });

    const matchingCategories = categories.filter((c) => c.image_url && c.image_url.includes(file));
    const matchingBanners = banners.filter((b) => b.image_url && b.image_url.includes(file));
    const matchingBlogs = blogPosts.filter((bp) => bp.cover_image && bp.cover_image.includes(file));

    const totalRefs =
      matchingProducts.length +
      matchingCategories.length +
      matchingBanners.length +
      matchingBlogs.length;

    if (isDryRun) {
      console.log(`[DRY-RUN] File: ${file} (${(fileStats.size / 1024).toFixed(1)} KB)`);
      console.log(`          Planned Cloudinary target: ${folder}/${file}`);
      console.log(
        `          References found: Products: ${matchingProducts.length}, ` +
        `Categories: ${matchingCategories.length}, Banners: ${matchingBanners.length}, BlogPosts: ${matchingBlogs.length}`
      );
      migratedCount++;
      continue;
    }

    try {
      console.log(`[MIGRATING] Uploading ${file} (${(fileStats.size / 1024).toFixed(1)} KB) to Cloudinary...`);
      const fileBuffer = fs.readFileSync(filePath);

      const uploadResult = await storageService.upload(fileBuffer, {
        folder,
        resource_type: 'auto',
      });

      const { secure_url, public_id } = uploadResult;
      console.log(`  ✓ Cloudinary uploaded: ${secure_url} (public_id: ${public_id})`);

      for (const p of matchingProducts) {
        let updated = false;
        const newImages = (p.images || []).map((img) => {
          if (typeof img === 'string' && img.includes(file)) {
            updated = true;
            return secure_url;
          }
          return img;
        });

        if (updated) {
          const publicIds = Array.isArray(p.image_public_ids) ? [...p.image_public_ids] : [];
          if (!publicIds.includes(public_id)) {
            publicIds.push(public_id);
          }
          await p.update({ images: newImages, image_public_ids: publicIds });
          console.log(`  ✓ Updated Product ID ${p.id} (${p.name})`);
        }
      }

      for (const c of matchingCategories) {
        await c.update({ image_url: secure_url });
        console.log(`  ✓ Updated Category ID ${c.id} (${c.name})`);
      }

      for (const b of matchingBanners) {
        await b.update({ image_url: secure_url });
        console.log(`  ✓ Updated Banner ID ${b.id}`);
      }

      for (const bp of matchingBlogs) {
        await bp.update({ cover_image: secure_url });
        console.log(`  ✓ Updated BlogPost ID ${bp.id} (${bp.title})`);
      }

      if (totalRefs === 0) {
        console.log(`  ℹ File uploaded to Cloudinary, but no existing DB records referenced '${file}'.`);
      }

      migratedCount++;
    } catch (err) {
      failedCount++;
      console.error(`  ✗ [ERROR] Failed to migrate ${file}: ${err.message}`);
    }
  }

  console.log('\n===============================================================');
  console.log('                     MIGRATION SUMMARY');
  console.log('===============================================================');
  console.log(`Total files scanned:    ${files.length}`);
  console.log(`Successfully processed: ${migratedCount}`);
  console.log(`Failed:                 ${failedCount}`);
  console.log(`Skipped:                ${skippedCount}`);
  console.log('Note: Local files in backend/uploads were NOT deleted automatically.');
  console.log('===============================================================\n');

  process.exit(failedCount > 0 ? 1 : 0);
}

migrateUploads().catch((err) => {
  console.error('[FATAL] Migration script failed:', err);
  process.exit(1);
});
