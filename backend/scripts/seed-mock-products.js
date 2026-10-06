'use strict';

require('dotenv').config();
const { sequelize, Sequelize } = require('../models');
const seeder = require('../seeders/20260929000001-seed-mock-products');

async function runSeed() {
  try {
    console.log('[Seeder] Connecting to database...');
    await sequelize.authenticate();
    console.log('[Seeder] Database connection established.');

    console.log('[Seeder] Seeding mock products from frontend catalog...');
    const queryInterface = sequelize.getQueryInterface();
    await seeder.up(queryInterface, Sequelize);

    console.log('[Seeder] ✅ Mock products successfully seeded / updated into DB!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder] ❌ Error seeding mock products:', error);
    process.exit(1);
  }
}

runSeed();
