const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

exports.hashPassword = async (plainText) => {
  return await bcrypt.hash(plainText, SALT_ROUNDS);
};

exports.comparePassword = async (plainText, hash) => {
  return await bcrypt.compare(plainText, hash);
};
