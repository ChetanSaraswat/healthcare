'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add idempotency_key column to payments table
    await queryInterface.addColumn('payments', 'idempotency_key', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    // 2. Add partial unique index ensuring at most ONE payment with status = 'captured' per order_id
    // This provides database-level protection against duplicate captured payments even under concurrent race conditions.
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX unique_captured_order_payment
      ON payments (order_id)
      WHERE status = 'captured' AND order_id IS NOT NULL;
    `);

    // 3. Add partial unique index ensuring at most ONE payment with status = 'captured' per rental_order_id
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX unique_captured_rental_payment
      ON payments (rental_order_id)
      WHERE status = 'captured' AND rental_order_id IS NOT NULL;
    `);

    // 4. Add unique index ensuring idempotency_key is unique per order_id
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX unique_order_idempotency_key
      ON payments (order_id, idempotency_key)
      WHERE order_id IS NOT NULL AND idempotency_key IS NOT NULL;
    `);

    // 5. Add unique index ensuring idempotency_key is unique per rental_order_id
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX unique_rental_idempotency_key
      ON payments (rental_order_id, idempotency_key)
      WHERE rental_order_id IS NOT NULL AND idempotency_key IS NOT NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS unique_rental_idempotency_key;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS unique_order_idempotency_key;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS unique_captured_rental_payment;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS unique_captured_order_payment;`);
    await queryInterface.removeColumn('payments', 'idempotency_key');
  },
};
