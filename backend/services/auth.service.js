const jwt = require('jsonwebtoken');
const { userRepository } = require('../repository');
const { hashPassword, comparePassword } = require('../libs/hash');
const { email } = require('../libs');
const { BadRequest, Unauthorized, Conflict, NotFound } = require('../libs/error');

class AuthService {
  generateToken(user) {
    const payload = {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const secret = process.env.JWT_SECRET;
    if (!secret && process.env.NODE_ENV === 'production') {
      throw new Error('Fatal configuration: JWT_SECRET environment variable is missing.');
    }
    const effectiveSecret = secret || 'aarogyamed_secret_key_default';
    const expiresIn = process.env.JWT_EXPIRATION || '7d';

    return jwt.sign(payload, effectiveSecret, { expiresIn });
  }

  async register(data) {
    const normalizedEmail = data.email.toLowerCase().trim();
    const existing = await userRepository.findByEmail(normalizedEmail);
    if (existing) {
      throw new Conflict('A user with this email address already exists');
    }

    if (data.phone) {
      const normalizedPhone = data.phone.trim();
      const existingPhone = await userRepository.findByPhone(normalizedPhone);
      if (existingPhone) {
        throw new Conflict('A user with this phone number already exists');
      }
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepository.create({
      name: data.name.trim(),
      email: normalizedEmail,
      phone: data.phone ? data.phone.trim() : null,
      password_hash: hashedPassword,
      role: 'customer',
    });

    const token = this.generateToken(user);

    // Asynchronously dispatch patient welcome email without blocking registration
    if (user.email) {
      email.sendPatientWelcomeEmail({ to: user.email, name: user.name }).catch((err) => {
        console.warn('[AuthService] Welcome email dispatch error:', err.message);
      });
    }

    return {
      token,
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async login(identifier, password) {
    const cleanId = (identifier || '').trim();
    let user = null;

    if (cleanId.includes('@')) {
      user = await userRepository.findByEmail(cleanId.toLowerCase());
    } else {
      user = await userRepository.findByPhone(cleanId);
      if (!user) {
        user = await userRepository.findByEmail(cleanId.toLowerCase());
      }
    }

    if (!user) {
      throw new Unauthorized('Invalid email/phone or password');
    }

    if (!user.password_hash) {
      throw new Unauthorized('Account does not have password login enabled');
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      throw new Unauthorized('Invalid email/phone or password');
    }

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async getProfile(userId) {
    const user = await userRepository.findProfile(userId);
    if (!user) {
      throw new NotFound('User not found');
    }

    const userData = user.toJSON ? user.toJSON() : user;
    const { password_hash, ...profile } = userData;
    return profile;
  }
}

module.exports = new AuthService();
