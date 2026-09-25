const { addressRepository, userRepository } = require('../repository');
const { NotFound, BadRequest, Conflict } = require('../libs/error');
const { hashPassword } = require('../libs/hash');

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

  async getAllStaff(filters = {}) {
    const rawStaff = await userRepository.findAllStaff(filters);

    return rawStaff.map((s) => {
      const staff = s.toJSON ? s.toJSON() : s;
      return {
        id: staff.id,
        uuid: staff.uuid,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        role: staff.role,
        isActive: !staff.deleted_at,
        createdAt: staff.created_at,
        updatedAt: staff.updated_at,
        deletedAt: staff.deleted_at,
      };
    });
  }

  async createStaffMember({ name, email, phone, role, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new Conflict('A user or staff account with this email address already exists');
    }

    const hashedPassword = await hashPassword(password);
    const createdUser = await userRepository.create({
      name,
      email,
      phone: phone || null,
      role,
      password_hash: hashedPassword,
    });

    const staff = createdUser.toJSON ? createdUser.toJSON() : createdUser;
    return {
      id: staff.id,
      uuid: staff.uuid,
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      isActive: true,
      createdAt: staff.created_at,
      updatedAt: staff.updated_at,
    };
  }

  async updateStaffRole(staffId, newRole, requestingUser) {
    const validRoles = ['super_admin', 'catalog_editor', 'operations_staff', 'content_editor'];
    if (!validRoles.includes(newRole)) {
      throw new BadRequest(`Invalid staff role: ${newRole}`);
    }

    const staff = await userRepository.findStaffById(staffId);
    if (!staff) {
      throw new NotFound('Staff member not found');
    }

    // Guardrail 1: Prevent self-demotion from super_admin
    if (
      requestingUser &&
      (requestingUser.id == staff.id || requestingUser.uuid === staff.uuid) &&
      newRole !== 'super_admin'
    ) {
      throw new BadRequest('Security restriction: You cannot demote your own Super Admin account.');
    }

    // Guardrail 2: Prevent demoting the last active super_admin
    if (staff.role === 'super_admin' && newRole !== 'super_admin') {
      const activeSuperAdmins = await userRepository.countActiveSuperAdmins();
      if (activeSuperAdmins <= 1) {
        throw new BadRequest('Security restriction: Cannot demote the sole active Super Admin on the platform.');
      }
    }

    const updated = await userRepository.updateStaffRole(staffId, newRole);
    const staffData = updated.toJSON ? updated.toJSON() : updated;
    return {
      id: staffData.id,
      uuid: staffData.uuid,
      name: staffData.name,
      email: staffData.email,
      phone: staffData.phone,
      role: staffData.role,
      isActive: !staffData.deleted_at,
      createdAt: staffData.created_at,
      updatedAt: staffData.updated_at,
    };
  }

  async toggleStaffStatus(staffId, isActive, requestingUser) {
    const staff = await userRepository.findStaffById(staffId);
    if (!staff) {
      throw new NotFound('Staff member not found');
    }

    // Guardrail 1: Prevent deactivating oneself while logged in
    if (
      requestingUser &&
      (requestingUser.id == staff.id || requestingUser.uuid === staff.uuid) &&
      !isActive
    ) {
      throw new BadRequest('Security restriction: You cannot suspend your own administrative account.');
    }

    // Guardrail 2: Prevent suspending the last active super_admin
    if (staff.role === 'super_admin' && !isActive) {
      const activeSuperAdmins = await userRepository.countActiveSuperAdmins();
      if (activeSuperAdmins <= 1) {
        throw new BadRequest('Security restriction: Cannot suspend the sole active Super Admin on the platform.');
      }
    }

    const updated = await userRepository.setStaffStatus(staffId, isActive);
    const staffData = updated ? (updated.toJSON ? updated.toJSON() : updated) : staff;
    return {
      id: staffData.id,
      uuid: staffData.uuid,
      name: staffData.name,
      email: staffData.email,
      phone: staffData.phone,
      role: staffData.role,
      isActive: Boolean(isActive),
      createdAt: staffData.created_at,
      updatedAt: staffData.updated_at,
      deletedAt: isActive ? null : new Date().toISOString(),
    };
  }
}

module.exports = new UserService();

