const crypto = require('crypto');

exports.generateOtp = (length = 6) => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(0, 10).toString();
  }
  return otp;
};

exports.addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);
