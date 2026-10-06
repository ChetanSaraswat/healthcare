const { addressRepository, userRepository } = require('../repository');
const { NotFound } = require('../libs/error');

class UserService {
  async getAddresses(userId) {
    return await addressRepository.findByUserId(userId);
  }

  async createAddress(userId, data) {
    return await addressRepository.handleManagedTransaction(async (transaction) => {
      const existingAddresses = await addressRepository.findByUserId(userId);
      const isFirst = existingAddresses.length === 0;
      const shouldBeDefault = Boolean(data.is_default || isFirst);

      if (shouldBeDefault) {
        await addressRepository.clearDefaults(userId, { transaction });
      }

      return await addressRepository.create(
        {
          ...data,
          user_id: userId,
          is_default: shouldBeDefault,
        },
        { transaction }
      );
    });
  }

  async updateAddress(userId, addressId, data) {
    return await addressRepository.handleManagedTransaction(async (transaction) => {
      const address = await addressRepository.findUserAddress(userId, addressId, { transaction });
      if (!address) {
        throw new NotFound('Address not found');
      }

      if (data.is_default) {
        await addressRepository.clearDefaults(userId, { transaction });
      }

      await address.update(data, { transaction });
      return address.toJSON ? address.toJSON() : address;
    });
  }

  async deleteAddress(userId, addressId) {
    const address = await addressRepository.findUserAddress(userId, addressId);
    if (!address) {
      throw new NotFound('Address not found');
    }

    await address.destroy();
    return { message: 'Address deleted successfully' };
  }

  async getProfile(userId) {
    const user = await userRepository.findProfile(userId);
    if (!user) {
      throw new NotFound('User not found');
    }

    const userData = user.toJSON ? user.toJSON() : user;
    const addresses = userData.addresses || (await addressRepository.findByUserId(userId));
    return {
      ...userData,
      addresses,
    };
  }

  async getAllCustomers(filters = {}) {
    const rawCustomers = await userRepository.findAllCustomersWithMetrics(filters);

    return rawCustomers.map((c) => {
      const customer = c.toJSON ? c.toJSON() : c;
      const orders = customer.orders || [];
      const rentals = customer.rentals || [];
      const addresses = customer.addresses || [];

      const buyTotal = orders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);

      const rentTotal = rentals
        .filter((r) => r.status !== 'cancelled')
        .reduce((sum, r) => sum + (parseFloat(r.total_amount) || 0), 0);

      const defaultAddress = addresses.find((a) => a.is_default) || addresses[0];
      const primaryCity = defaultAddress ? `${defaultAddress.city}, ${defaultAddress.state}` : 'Not Specified';

      const allDates = [
        ...orders.map((o) => new Date(o.created_at)),
        ...rentals.map((r) => new Date(r.created_at)),
        new Date(customer.created_at),
      ].filter((d) => !isNaN(d.getTime()));

      const lastActive = new Date(Math.max(...allDates)).toISOString();

      return {
        id: customer.id,
        uuid: customer.uuid,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        role: customer.role,
        createdAt: customer.created_at,
        primaryCity,
        totalOrdersCount: orders.length,
        totalRentalsCount: rentals.length,
        totalSpend: Math.round(buyTotal + rentTotal),
        lastActive,
        addresses,
      };
    });
  }

  async getCustomerCareHistory(userId) {
    const rawCustomer = await userRepository.findCustomerCareHistory(userId);
    if (!rawCustomer) {
      throw new NotFound('Customer not found');
    }

    const customer = rawCustomer.toJSON ? rawCustomer.toJSON() : rawCustomer;
    const orders = customer.orders || [];
    const rentals = customer.rentals || [];
    const addresses = customer.addresses || [];

    const buyTotal = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);

    const rentTotal = rentals
      .filter((r) => r.status !== 'cancelled')
      .reduce((sum, r) => sum + (parseFloat(r.total_amount) || 0), 0);

    const defaultAddress = addresses.find((a) => a.is_default) || addresses[0];
    const primaryCity = defaultAddress ? `${defaultAddress.city}, ${defaultAddress.state}` : 'Not Specified';

    return {
      id: customer.id,
      uuid: customer.uuid,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      role: customer.role,
      createdAt: customer.created_at,
      primaryCity,
      totalOrdersCount: orders.length,
      totalRentalsCount: rentals.length,
      totalSpend: Math.round(buyTotal + rentTotal),
      addresses,
      orders,
      rentals,
    };
  }
}

module.exports = new UserService();

