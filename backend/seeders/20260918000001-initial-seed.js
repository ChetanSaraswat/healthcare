'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash('Admin@12345', 10);
    const now = new Date();

    // 1. Users
    const users = await queryInterface.bulkInsert(
      'users',
      [
        {
          uuid: uuidv4(),
          name: 'Super Admin',
          email: 'admin@omkarhealthcare.com',
          phone: '+919876543210',
          password_hash: passwordHash,
          role: 'super_admin',
          created_at: now,
          updated_at: now,
        },
        {
          uuid: uuidv4(),
          name: 'Dr. Ananya Iyer',
          email: 'ananya.iyer@omkarhealthcare.com',
          phone: '+919820111223',
          password_hash: passwordHash,
          role: 'content_editor',
          created_at: now,
          updated_at: now,
        },
        {
          uuid: uuidv4(),
          name: 'Kavita Sundaram',
          email: 'kavita.s@omkarhealthcare.com',
          phone: '+919845199887',
          password_hash: passwordHash,
          role: 'operations_staff',
          created_at: now,
          updated_at: now,
        },
        {
          uuid: uuidv4(),
          name: 'Rohan Deshmukh',
          email: 'rohan.d@omkarhealthcare.com',
          phone: '+919711033445',
          password_hash: passwordHash,
          role: 'catalog_editor',
          created_at: now,
          updated_at: now,
        },
        {
          uuid: uuidv4(),
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@example.com',
          phone: '+919811122233',
          password_hash: passwordHash,
          role: 'customer',
          created_at: now,
          updated_at: now,
        },
      ],
      { returning: true }
    );

    // 2. Categories
    const categories = await queryInterface.bulkInsert(
      'categories',
      [
        {
          uuid: uuidv4(),
          name: 'Respiratory & Sleep',
          slug: 'respiratory-sleep',
          description: 'CPAP, BiPAP, Oxygen Concentrators, Nebulizers and respiratory supplies.',
          display_order: 1,
          is_active: true,
          created_at: now,
          updated_at: now,
        },
      ],
      { returning: true }
    );

    // 3. Subcategories
    const respCat = categories[0];

    const subcategories = await queryInterface.bulkInsert(
      'categories',
      [
        {
          uuid: uuidv4(),
          name: 'CPAP & BiPAP Machines',
          slug: 'cpap-bipap-machines',
          parent_id: respCat.id,
          display_order: 1,
          is_active: true,
          created_at: now,
          updated_at: now,
        },
        {
          uuid: uuidv4(),
          name: 'Oxygen Concentrators',
          slug: 'oxygen-concentrators',
          parent_id: respCat.id,
          display_order: 2,
          is_active: true,
          created_at: now,
          updated_at: now,
        },
        {
          uuid: uuidv4(),
          name: 'Nebulizers & Suction Machines',
          slug: 'nebulizers-suction',
          parent_id: respCat.id,
          display_order: 3,
          is_active: true,
          created_at: now,
          updated_at: now,
        },
      ],
      { returning: true }
    );

    // 4. Tags
    const tags = await queryInterface.bulkInsert(
      'tags',
      [
        { uuid: uuidv4(), name: 'sleep-apnea', display_name: 'Sleep Apnea', created_at: now, updated_at: now },
        { uuid: uuidv4(), name: 'copd', display_name: 'COPD & Lung Care', created_at: now, updated_at: now },
        { uuid: uuidv4(), name: 'post-surgery-mobility', display_name: 'Post-Surgery Mobility', created_at: now, updated_at: now },
        { uuid: uuidv4(), name: 'elderly-care', display_name: 'Elderly Home Care', created_at: now, updated_at: now },
      ],
      { returning: true }
    );

    // 5. Products
    const products = await queryInterface.bulkInsert(
      'products',
      [
        {
          uuid: uuidv4(),
          name: 'ResMed AirSense 10 AutoSet CPAP Machine',
          slug: 'resmed-airsense-10-autoset-cpap',
          category_id: respCat.id,
          subcategory_id: subcategories[0].id,
          brand: 'ResMed',
          description: 'The world’s leading auto-adjusting CPAP machine with integrated HumidAir heated humidifier and climate control. Designed for comfortable, whisper-quiet sleep apnea therapy.',
          images: JSON.stringify(['/images/oxygen_concentrator.png', '/images/elderly_couple.png']),
          videos: JSON.stringify([]),
          specifications: JSON.stringify([
            { label: 'Pressure Range', value: '4 to 20 cm H2O' },
            { label: 'Sound Level', value: '26.6 dBA (Whisper Quiet)' },
            { label: 'Weight', value: '1.25 kg' },
            { label: 'Humidification', value: 'Integrated HumidAir Heated Chamber' },
            { label: 'Data Connectivity', value: 'Built-in 4G Wireless' },
          ]),
          buy_price: 64999.00,
          buy_mrp: 75000.00,
          buy_available: true,
          rent_price_daily: 250.00,
          rent_price_weekly: 1400.00,
          rent_price_monthly: 4500.00,
          rent_deposit: 8000.00,
          rent_min_period_days: 7,
          rent_available: true,
          stock_quantity: 25,
          warranty_info: '3-Year Manufacturer Warranty with Doorstep Replacement Guarantee',
          status: 'active',
          related_product_ids: JSON.stringify([]),
          created_at: now,
          updated_at: now,
        },
        {
          uuid: uuidv4(),
          name: 'Philips EverFlo 5L Home Oxygen Concentrator',
          slug: 'philips-everflo-5l-oxygen-concentrator',
          category_id: respCat.id,
          subcategory_id: subcategories[1].id,
          brand: 'Philips Respironics',
          description: 'Compact 5-liter stationary oxygen concentrator delivering continuous flow medical oxygen with low power consumption and ultra-durable recessed flow meter.',
          images: JSON.stringify(['/images/oxygen_concentrator.png', '/images/caregiver.png']),
          videos: JSON.stringify([]),
          specifications: JSON.stringify([
            { label: 'Flow Rate', value: '0.5 to 5 LPM' },
            { label: 'Oxygen Purity', value: '93% ± 3%' },
            { label: 'Sound Level', value: '< 45 dBA' },
            { label: 'Power Consumption', value: '350 Watts' },
            { label: 'Weight', value: '14 kg' },
          ]),
          buy_price: 52000.00,
          buy_mrp: 62000.00,
          buy_available: true,
          rent_price_daily: 220.00,
          rent_price_weekly: 1250.00,
          rent_price_monthly: 4000.00,
          rent_deposit: 7000.00,
          rent_min_period_days: 7,
          rent_available: true,
          stock_quantity: 18,
          warranty_info: '2-Year Onsite Warranty',
          status: 'active',
          related_product_ids: JSON.stringify([]),
          created_at: now,
          updated_at: now,
        },
      ],
      { returning: true }
    );

    // 6. Link Products to Tags
    await queryInterface.bulkInsert('product_tags', [
      { product_id: products[0].id, tag_id: tags[0].id, created_at: now, updated_at: now },
      { product_id: products[1].id, tag_id: tags[1].id, created_at: now, updated_at: now },
    ]);

    // 7. Condition Pages
    await queryInterface.bulkInsert('condition_pages', [
      {
        uuid: uuidv4(),
        title: 'Sleep Apnea: Symptoms, Testing & CPAP Therapy',
        slug: 'sleep-apnea',
        subtitle: 'Understand Obstructive Sleep Apnea (OSA) and explore proven respiratory therapy solutions.',
        body: 'Sleep apnea is a common sleep disorder characterized by repeated interruptions in breathing during sleep. The gold-standard treatment is Continuous Positive Airway Pressure (CPAP) therapy, which keeps the upper airway open throughout the night.',
        symptoms: JSON.stringify([
          'Loud, disruptive chronic snoring',
          'Waking up gasping or choking for breath',
          'Excessive daytime sleepiness and fatigue',
          'Morning dry mouth and headaches',
        ]),
        treatments: JSON.stringify([
          'Auto-titrating CPAP (Continuous Positive Airway Pressure) therapy',
          'Bi-level PAP therapy for high-pressure intolerance',
          'Heated humidification to prevent nasal dryness',
        ]),
        related_tag_id: tags[0].id,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        uuid: uuidv4(),
        title: 'Post-Surgery Mobility & In-Home Recovery',
        slug: 'post-surgery-mobility',
        subtitle: 'Accelerate patient recovery with ergonomic wheelchairs, walking aids, and mobility support.',
        body: 'Following orthopedic or abdominal surgery, minimizing strain while ensuring safe transfers is critical for healing and caregiver safety. Ergonomic lightweight wheelchairs and transfer aids empower patients to recover with dignity.',
        symptoms: JSON.stringify([
          'Restricted weight-bearing ability',
          'Pain during seated transfers',
          'Need for assisted mobility positioning',
        ]),
        treatments: JSON.stringify([
          'Ergonomic wheelchairs for safe transport',
          'Lightweight walking frames and mobility aids',
          'Physical therapy recovery protocols',
        ]),
        related_tag_id: tags[2].id,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    // 8. Banners
    await queryInterface.bulkInsert('banners', [
      {
        uuid: uuidv4(),
        title: 'Hospital-Grade Care Delivered to Your Doorstep',
        image_url: '/images/banners/hero-banner-1.png',
        link_url: '/shop/respiratory',
        display_order: 1,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('banners', null, {});
    await queryInterface.bulkDelete('condition_pages', null, {});
    await queryInterface.bulkDelete('product_tags', null, {});
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('tags', null, {});
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
