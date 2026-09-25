const jwt = require('jsonwebtoken');
const { userRepository } = require('../repository');
const { hashPassword, comparePassword } = require('../libs/hash');
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
    const secret = process.env.JWT_SECRET || 'aarogyamed_secret_key_default';
    const expiresIn = process.env.JWT_EXPIRATION || '7d';

    return jwt.sign(payload, secret, { expiresIn });
  }

  async register(data) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new Conflict('A user with this email address already exists');
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      password_hash: hashedPassword,
      role: 'customer',
    });

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

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Unauthorized('Invalid email or password');
    }

    if (!user.password_hash) {
      throw new Unauthorized('Account does not have password login enabled');
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      throw new Unauthorized('Invalid email or password');
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
