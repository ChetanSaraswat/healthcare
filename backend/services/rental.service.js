const { rentalRepository, productRepository, addressRepository } = require('../repository');
const { BadRequest, NotFound } = require('../libs/error');

class RentalService {
  async calculateItemCost(product, durationType, durationCount, quantity = 1) {
    let rateAmount = 0;
    if (durationType === 'daily') {
      rateAmount = parseFloat(product.rent_price_daily) || 0;
    } else if (durationType === 'weekly') {
      rateAmount = parseFloat(product.rent_price_weekly) || 0;
    } else if (durationType === 'monthly') {
      rateAmount = parseFloat(product.rent_price_monthly) || 0;
    } else {
      rateAmount = parseFloat(product.rent_price_daily) || 0;
    }

    const itemRentalTotal = rateAmount * durationCount * quantity;
    const itemDepositTotal = (parseFloat(product.rent_deposit) || 0) * quantity;

    return {
      rateAmount,
      itemRentalTotal,
      itemDepositTotal,
    };
  }

  async quote(items) {
    let totalRentalAmount = 0;
    let totalDepositAmount = 0;
    const quotedItems = [];

    for (const item of items) {
      const pid = item.product_id || item.productId;
      const where = isNaN(Number(pid))
        ? { uuid: pid, rent_available: true, status: 'active' }
        : { id: Number(pid), rent_available: true, status: 'active' };

      const product = await productRepository.findOne(where);

      if (!product) {
        throw new BadRequest(`Product #${pid} is not available for rental`);
      }

      const durationType = item.duration_type || 'daily';
      const durationCount = item.duration_count || item.durationDays || 7;
      const quantity = item.quantity || 1;

      const { rateAmount, itemRentalTotal, itemDepositTotal } = await this.calculateItemCost(
        product,
        durationType,
        durationCount,
        quantity
      );

      totalRentalAmount += itemRentalTotal;
      totalDepositAmount += itemDepositTotal;

      quotedItems.push({
        product_id: product.id,
        product_name: product.name,
        slug: product.slug,
        duration_type: durationType,
        duration_count: durationCount,
        quantity,
        rate_amount: rateAmount,
        subtotal: itemRentalTotal,
        deposit: itemDepositTotal,
      });
    }

    return {
      items: quotedItems,
      total_rental_amount: totalRentalAmount,
      total_deposit_amount: totalDepositAmount,
      total_payable_now: totalRentalAmount + totalDepositAmount,
    };
  }

  async createRentalOrder(userId, data) {
    const { address_id, payment_id, items, notes } = data;
    const delivery = data.delivery_address || data.deliveryAddress;

    let address = null;
    if (address_id) {
      address = await addressRepository.findUserAddress(userId, address_id);
    } else if (delivery) {
      address = await addressRepository.findOrCreateAddress(userId, {
        label: 'Home',
        line1: delivery.addressLine1 || delivery.line1,
        line2: delivery.addressLine2 || delivery.line2 || null,
        city: delivery.city,
        state: delivery.state,
        pincode: delivery.pincode,
      });
    }

    if (!address) {
      throw new BadRequest('Invalid or missing delivery address');
    }

    // SECTION 3: Order-level dedupe check on creation
    // Check whether an active PENDING rental order already exists for this user with matching cart contents.
    // If found and not expired (< 60 minutes), reuse the existing rental order instead of duplicating.
    if (userId && items && items.length > 0) {
      const activePendingRentals = await rentalRepository.findActivePendingRentalsByUser(userId, 60);
      for (const pendingRental of activePendingRentals) {
        if (pendingRental.items && pendingRental.items.length === items.length) {
          const pendingItemMap = new Map();
          for (const it of pendingRental.items) {
            pendingItemMap.set(Number(it.product_id), Number(it.quantity));
          }
          let allMatch = true;
          for (const reqItem of items) {
            const rawPid = reqItem.product_id || reqItem.productId;
            let numericPid = Number(rawPid);
            if (isNaN(numericPid)) {
              const p = await productRepository.findOne({ uuid: rawPid });
              numericPid = p ? p.id : null;
            }
            const reqQty = Number(reqItem.quantity || 1);
            if (!numericPid || !pendingItemMap.has(numericPid) || pendingItemMap.get(numericPid) !== reqQty) {
              allMatch = false;
              break;
            }
          }
          if (allMatch) {
            return pendingRental;
          }
        }
      }
    }

    const startDate = data.start_date || data.startDate || new Date().toISOString().split('T')[0];
    const endDate = data.end_date || data.endDate || null;

    const quoteResult = await this.quote(items);

    return await rentalRepository.handleManagedTransaction(async (transaction) => {
      const orderData = {
        user_id: userId,
        address_id: address.id,
        status: 'pending',
        start_date: startDate,
        end_date: endDate,
        deposit_amount: quoteResult.total_deposit_amount,
        deposit_status: 'held',
        payment_id: payment_id || null,
      };

      const itemsData = quoteResult.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        rate_type: item.duration_type,
        rate_amount: item.rate_amount,
        subtotal: item.subtotal,
        deposit_amount: item.deposit,
      }));

      return await rentalRepository.createWithItems(orderData, itemsData, transaction);
    });
  }

  async getById(id, userId = null) {
    const rental = await rentalRepository.findRentalDetails(id, userId);
    if (!rental) {
      throw new NotFound('Rental order not found');
    }
    return rental;
  }

  async getUserRentals(userId) {
    return await rentalRepository.findRentalsByUser(userId);
  }

  async getAllRentals(filter = {}) {
    return await rentalRepository.findAllRentals(filter);
  }

  async updateStatus(id, updateData) {
    const rental = await rentalRepository.updateRentalStatus(id, updateData);
    if (!rental) {
      throw new NotFound('Rental order not found');
    }
    return rental;
  }

  async extendRental(id, userId, { days, notes }) {
    const rental = await rentalRepository.findRentalDetails(id, userId);
    if (!rental) {
      throw new NotFound('Rental agreement not found');
    }

    if (!['pending', 'confirmed', 'active'].includes(rental.status)) {
      throw new BadRequest(`Cannot extend rental with status '${rental.status}'`);
    }

    const currentEnd = rental.end_date
      ? new Date(rental.end_date)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const newEndDateObj = new Date(currentEnd.getTime() + days * 24 * 60 * 60 * 1000);
    const newEndDate = newEndDateObj.toISOString().split('T')[0];

    const updatedRental = await rentalRepository.extendRentalDuration(id, { newEndDate });

    return {
      message: `Rental agreement extended by ${days} days`,
      new_end_date: newEndDate,
      rental: updatedRental,
    };
  }

  async scheduleReturn(id, userId, { return_date, return_slot, pickup_notes }) {
    const rental = await rentalRepository.findRentalDetails(id, userId);
    if (!rental) {
      throw new NotFound('Rental agreement not found');
    }

    if (!['confirmed', 'active'].includes(rental.status)) {
      throw new BadRequest(`Cannot schedule return for rental with status '${rental.status}'`);
    }

    return {
      message: `Return pickup scheduled for ${return_date} (${return_slot === 'morning' ? '9:00 AM - 1:00 PM' : '2:00 PM - 7:00 PM'}). Technician inspection will initiate the 24-hour security deposit refund SLA.`,
      return_date,
      return_slot,
      rental,
    };
  }
}

module.exports = new RentalService();
