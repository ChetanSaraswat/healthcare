'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash('Admin@12345', 10);
    const now = new Date();

    // 1. Ensure Super Admin exists
    const existingAdmin = await queryInterface.rawSelect(
      'users',
      { where: { email: 'admin@omkarhealthcare.com' } },
      ['id']
    );

    let adminUserId = existingAdmin;
    if (!existingAdmin) {
      const [insertedAdmin] = await queryInterface.bulkInsert(
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
        ],
        { returning: ['id'] }
      );
      adminUserId = insertedAdmin.id;
    }

    // 2. Additional patient & customer users for rich pagination
    const customersData = [
      { name: 'Dr. Ramesh Verma', email: 'ramesh.verma@example.com', phone: '+919811122201', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
      { name: 'Sunita Sharma', email: 'sunita.sharma@example.com', phone: '+919811122202', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
      { name: 'Vikram Malhotra', email: 'vikram.m@example.com', phone: '+919811122203', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
      { name: 'Priya Nair', email: 'priya.nair@example.com', phone: '+919811122204', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
      { name: 'Amitav Roy', email: 'amitav.roy@example.com', phone: '+919811122205', city: 'Kolkata', state: 'West Bengal', pincode: '700001' },
      { name: 'Ananya Sen', email: 'ananya.sen@example.com', phone: '+919811122206', city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
      { name: 'Deepa Joshi', email: 'deepa.joshi@example.com', phone: '+919811122207', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' },
      { name: 'Meera Nambiar', email: 'meera.n@example.com', phone: '+919811122208', city: 'Kochi', state: 'Kerala', pincode: '682001' },
      { name: 'Sanjay Patel', email: 'sanjay.patel@example.com', phone: '+919811122209', city: 'Surat', state: 'Gujarat', pincode: '395001' },
      { name: 'Harpreet Kaur', email: 'harpreet.k@example.com', phone: '+919811122210', city: 'Chandigarh', state: 'Punjab', pincode: '160001' },
      { name: 'Suresh Raina', email: 'suresh.r@example.com', phone: '+919811122211', city: 'Jaipur', state: 'Rajasthan', pincode: '302001' },
      { name: 'Sneha Kulkarni', email: 'sneha.k@example.com', phone: '+919811122212', city: 'Nagpur', state: 'Maharashtra', pincode: '440001' },
      { name: 'Gaurav Singhania', email: 'gaurav.s@example.com', phone: '+919811122213', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001' },
      { name: 'Pooja Bhatt', email: 'pooja.bhatt@example.com', phone: '+919811122214', city: 'Indore', state: 'Madhya Pradesh', pincode: '452001' },
      { name: 'Arjun Das', email: 'arjun.das@example.com', phone: '+919811122215', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641001' },
    ];

    const insertedUserIds = [];
    const insertedAddressIds = [];

    for (const c of customersData) {
      const existingUser = await queryInterface.rawSelect(
        'users',
        { where: { email: c.email } },
        ['id']
      );

      let uId = existingUser;
      if (!existingUser) {
        const [u] = await queryInterface.bulkInsert(
          'users',
          [
            {
              uuid: uuidv4(),
              name: c.name,
              email: c.email,
              phone: c.phone,
              password_hash: passwordHash,
              role: 'customer',
              created_at: now,
              updated_at: now,
            },
          ],
          { returning: ['id'] }
        );
        uId = u.id;
      }
      insertedUserIds.push(uId);

      // Create address for customer
      const existingAddr = await queryInterface.rawSelect(
        'addresses',
        { where: { user_id: uId } },
        ['id']
      );

      let aId = existingAddr;
      if (!existingAddr) {
        const [a] = await queryInterface.bulkInsert(
          'addresses',
          [
            {
              uuid: uuidv4(),
              user_id: uId,
              label: 'Home',
              line1: `Flat ${Math.floor(Math.random() * 500) + 101}, Sector ${Math.floor(Math.random() * 20) + 1}`,
              line2: 'Near Health Center',
              city: c.city,
              state: c.state,
              pincode: c.pincode,
              is_default: true,
              created_at: now,
              updated_at: now,
            },
          ],
          { returning: ['id'] }
        );
        aId = a.id;
      }
      insertedAddressIds.push(aId);
    }

    // Get available products for items
    const products = await queryInterface.sequelize.query(
      `SELECT id, buy_price, rent_price_daily, rent_deposit FROM products ORDER BY id ASC LIMIT 8;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (products.length === 0) return;

    // 3. Seed additional Purchase Orders for multi-page pagination
    const orderStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    for (let i = 0; i < insertedUserIds.length; i++) {
      const uId = insertedUserIds[i];
      const aId = insertedAddressIds[i];
      const prod = products[i % products.length];
      const status = orderStatuses[i % orderStatuses.length];
      const qty = (i % 2) + 1;
      const unitPrice = parseFloat(prod.buy_price) || 25000;
      const totalAmount = unitPrice * qty;

      const [order] = await queryInterface.bulkInsert(
        'orders',
        [
          {
            uuid: uuidv4(),
            user_id: uId,
            address_id: aId,
            status,
            payment_id: status === 'pending' ? null : `pay_seed_${uuidv4().substring(0, 8)}`,
            total_amount: totalAmount,
            created_at: new Date(Date.now() - i * 86400000), // staggered dates
            updated_at: now,
          },
        ],
        { returning: ['id'] }
      );

      await queryInterface.bulkInsert('order_items', [
        {
          uuid: uuidv4(),
          order_id: order.id,
          product_id: prod.id,
          quantity: qty,
          unit_price: unitPrice,
          created_at: now,
          updated_at: now,
        },
      ]);
    }

    // 4. Seed Rental Orders for multi-page pagination
    const rentalStatuses = ['pending', 'confirmed', 'active', 'returned', 'cancelled'];
    const depositStatuses = ['held', 'held', 'held', 'refunded', 'forfeited'];

    for (let i = 0; i < insertedUserIds.length; i++) {
      const uId = insertedUserIds[i];
      const aId = insertedAddressIds[i];
      const prod = products[(i + 2) % products.length];
      const status = rentalStatuses[i % rentalStatuses.length];
      const depStatus = depositStatuses[i % depositStatuses.length];
      const depAmt = parseFloat(prod.rent_deposit) || 5000;
      const dailyRate = parseFloat(prod.rent_price_daily) || 300;

      const startDate = new Date(Date.now() - (i + 1) * 3 * 86400000);
      const endDate = new Date(Date.now() + (14 - i) * 86400000);

      const [rental] = await queryInterface.bulkInsert(
        'rental_orders',
        [
          {
            uuid: uuidv4(),
            user_id: uId,
            address_id: aId,
            status,
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
            deposit_amount: depAmt,
            deposit_status: depStatus,
            payment_id: status === 'pending' ? null : `pay_rent_${uuidv4().substring(0, 8)}`,
            created_at: startDate,
            updated_at: now,
          },
        ],
        { returning: ['id'] }
      );

      await queryInterface.bulkInsert('rental_items', [
        {
          uuid: uuidv4(),
          rental_order_id: rental.id,
          product_id: prod.id,
          quantity: 1,
          rate_type: 'daily',
          rate_amount: dailyRate,
          created_at: now,
          updated_at: now,
        },
      ]);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Delete seeded test users and their cascade/associated rows
    await queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.like]: '%@example.com',
      },
    });
  },
};
