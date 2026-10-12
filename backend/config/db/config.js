const env = require('../env');

module.exports = {
  development: {
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    logging: false,
    define: {
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
  test: {
    username: process.env.DB_TEST_USER || env.DB_USER,
    password: process.env.DB_TEST_PASSWORD || env.DB_PASSWORD,
    database: process.env.DB_TEST_DATABASE || env.DB_TEST_DATABASE,
    host: process.env.DB_TEST_HOST || env.DB_HOST,
    port: process.env.DB_TEST_PORT ? parseInt(process.env.DB_TEST_PORT, 10) : env.DB_PORT,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    logging: false,
    pool: {
      max: 20,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
  production: {
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    logging: false,
    pool: {
      max: env.DB_POOL_MAX,
      min: env.DB_POOL_MIN,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions:
      env.DB_SSL === 'true'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    define: {
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
};
