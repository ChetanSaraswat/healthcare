const validateEnvironment = () => {
  if (process.env.NODE_ENV === 'production') {
    const required = ['JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE'];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(
        `[Fatal Configuration Error]: Missing required production environment variables: ${missing.join(', ')}`
      );
    }
  }
};

validateEnvironment();

module.exports = {
  dbConnection: require('./db/db-connection'),
};

