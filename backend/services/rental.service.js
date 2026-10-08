const { rentalRepository, productRepository, addressRepository, userRepository } = require('../repository');
const { email } = require('../libs');
const { adminNotificationEventBus } = require('../libs/notification');
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

    // Apply progressive tiered discount:
    // 30+ days: 28% off
    // 15-29 days: 18% off
    // 7-14 days: 10% off
    // 1-6 days: 0% off
    let discountPercent = 0;
    const days = Math.max(1, Number(durationCount) || 1);
    if (days >= 30) {
      discountPercent = 28;
    } else if (days >= 15) {
      discountPercent = 18;
    } else if (days >= 7) {
      discountPercent = 10;
    }

    const effectiveDailyRate = Math.round(rateAmount * (1 - discountPercent / 100));
    const itemRentalTotal = effectiveDailyRate * days * quantity;
    const itemDepositTotal = (parseFloat(product.rent_deposit) || 0) * quantity;

    return {
      rateAmount: effectiveDailyRate,
      baseDailyRate: rateAmount,
      discountPercent,
      itemRentalTotal,
      itemDepositTotal,
    };
  }

  async quote(items) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequest('Rental items must be a non-empty array');
    }

    let totalRentalAmount = 0;
    let totalDepositAmount = 0;
    const quotedItems = [];

    for (const item of items) {
      const productUuid = item.product_uuid;
      if (!productUuid) {
        throw new BadRequest('Product UUID (product_uuid) is required for each rental item');
      }

      const product = await productRepository.findByIdentifier(productUuid, {
        rent_available: true,
        status: 'active',
      });

      if (!product) {
        throw new BadRequest(`Product '${productUuid}' is not available for rental`);
      }

      const durationType = item.duration_type || 'daily';
      const durationCount = Number(item.duration_count) || 7;
      const quantity = Number(item.quantity) || 1;

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
        product_uuid: product.uuid,
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
    const delivery = data.delivery_address;

    let address = null;
    if (address_id) {
      address = await addressRepository.findUserAddress(userId, address_id);
    } else if (delivery) {
      address = await addressRepository.findOrCreateAddress(userId, {
        label: 'Home',
        line1: delivery.line1,
        line2: delivery.line2 || null,
        city: delivery.city,
        state: delivery.state,
        pincode: delivery.pincode,
      });
    }

    if (!address) {
      throw new BadRequest('Invalid or missing delivery address');
    }

    // Deduplication check on creation
    // Check whether an active PENDING rental order already exists for this user with matching cart contents.
    // If found and not expired (< 60 minutes), reuse the existing rental order instead of duplicating.
    if (userId && items && items.length > 0) {
      const activePendingRentals = await rentalRepository.findActivePendingRentalsByUser(userId, 60);
      for (const pendingRental of activePendingRentals) {
        if (pendingRental.items && pendingRental.items.length === items.length) {
          const pendingItemMap = new Map();
          for (const it of pendingRental.items) {
            if (it.product && it.product.uuid) {
              pendingItemMap.set(it.product.uuid, Number(it.quantity));
            }
          }
          let allMatch = true;
          for (const reqItem of items) {
            const reqProductUuid = reqItem.product_uuid;
            const reqQty = Number(reqItem.quantity || 1);
            if (!reqProductUuid || !pendingItemMap.has(reqProductUuid) || pendingItemMap.get(reqProductUuid) !== reqQty) {
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

    const startDate = data.start_date || new Date().toISOString().split('T')[0];
    const endDate = data.end_date || null;

    const quoteResult = await this.quote(items);

    const createdRental = await rentalRepository.handleManagedTransaction(async (transaction) => {
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

    // Asynchronously dispatch rental agreement and sterilization certificate email
    (async () => {
      try {
        if (!createdRental) return;
        const user = userId ? await userRepository.findByPk(userId) : null;
        const targetEmail = (user && user.email) || (delivery && delivery.email);
        if (targetEmail) {
          await email.sendRentalAgreementEmail({
            to: targetEmail,
            name: (user && user.name) || (delivery && delivery.fullName) || 'Valued Patient',
            rentalNumber: createdRental.id,
            items: quoteResult.items.map((it) => ({
              product_name: it.product_name,
              rate_amount: it.rate_amount,
              rate_type: it.duration_type,
            })),
            startDate,
            endDate,
            rentalAmount: quoteResult.total_rental_amount,
            depositAmount: quoteResult.total_deposit_amount,
            deliveryAddress: address,
            transactionId: payment_id || '',
          });
        }
      } catch (mailErr) {
        console.warn('[RentalService] Rental agreement email dispatch failed:', mailErr.message);
      }
    })();

    // Dispatches admin WhatsApp and Email alerts for confirmed rental transactions (COD or pre-paid)
    const rawMethod = (data.payment_method || '').toLowerCase();
    const isOnlineAttempt =
      rawMethod.includes('online') ||
      rawMethod.includes('upi') ||
      rawMethod.includes('card') ||
      rawMethod.includes('netbanking') ||
      rawMethod.includes('razorpay');
    const isConfirmedTransaction = Boolean(payment_id) || !isOnlineAttempt;

    if (isConfirmedTransaction && createdRental) {
      adminNotificationEventBus.emitAsync('transaction.rental.successful', {
        rentalId: createdRental.id,
        paymentId: payment_id || null,
        paymentMethod: payment_id ? 'Online Payment' : 'Cash on Delivery (COD)',
      });
    }

    return createdRental;
  }

  enrichRentalOrder(rental) {
    if (!rental) return rental;
    const raw = rental.toJSON ? rental.toJSON() : JSON.parse(JSON.stringify(rental));

    let durationDays = 7;
    if (raw.start_date && raw.end_date) {
      const sStr = String(raw.start_date).split('T')[0];
      const eStr = String(raw.end_date).split('T')[0];
      const [sY, sM, sD] = sStr.split('-').map(Number);
      const [eY, eM, eD] = eStr.split('-').map(Number);
      if (sY && sM && sD && eY && eM && eD) {
        const startUtc = Date.UTC(sY, sM - 1, sD);
        const endUtc = Date.UTC(eY, eM - 1, eD);
        const diff = Math.round((endUtc - startUtc) / 86400000);
        if (diff > 0) durationDays = diff;
      }
    }

    raw.duration_days = durationDays;
    raw.durationDays = durationDays;

    let calculatedRentalTotal = 0;
    if (Array.isArray(raw.items) && raw.items.length > 0) {
      raw.items = raw.items.map((item) => {
        const prod = item.product || {};
        const baseDailyRate = parseFloat(item.rate_amount) || parseFloat(prod.rent_price_daily) || 350;
        let discountPercent = 0;
        if (durationDays >= 30) discountPercent = 28;
        else if (durationDays >= 15) discountPercent = 18;
        else if (durationDays >= 7) discountPercent = 10;

        const effectiveDailyRate = Math.round(baseDailyRate * (1 - discountPercent / 100));
        const qty = Number(item.quantity) || 1;
        const subtotal = effectiveDailyRate * durationDays * qty;
        calculatedRentalTotal += subtotal;

        return {
          ...item,
          duration_days: durationDays,
          durationDays,
          base_daily_rate: baseDailyRate,
          daily_rate: baseDailyRate,
          effective_daily_rate: effectiveDailyRate,
          discount_percent: discountPercent,
          subtotal,
          rentalCost: subtotal,
          securityDeposit: (parseFloat(item.deposit_amount) || parseFloat(prod.rent_deposit) || 0) * qty,
        };
      });
    }

    raw.total_rental_fee = calculatedRentalTotal;
    raw.totalRentalFee = calculatedRentalTotal;
    raw.total_deposit = parseFloat(raw.deposit_amount) || 0;
    raw.totalDeposit = parseFloat(raw.deposit_amount) || 0;
    raw.total_amount = calculatedRentalTotal + raw.total_deposit;
    raw.totalPaid = raw.total_amount;

    return raw;
  }

  async getById(uuid, userId = null) {
    const rental = await rentalRepository.findRentalDetails(uuid, userId);
    if (!rental) {
      throw new NotFound('Rental order not found');
    }
    return this.enrichRentalOrder(rental);
  }

  async getUserRentals(userId) {
    const rentals = await rentalRepository.findRentalsByUser(userId);
    return rentals.map((r) => this.enrichRentalOrder(r));
  }

  async getAllRentals(filter = {}) {
    const rentals = await rentalRepository.findAllRentals(filter);
    return rentals.map((r) => this.enrichRentalOrder(r));
  }

  async updateStatus(uuid, updateData) {
    const rental = await rentalRepository.updateRentalStatus(uuid, updateData);
    if (!rental) {
      throw new NotFound('Rental order not found');
    }
    return rental;
  }

  async extendRental(uuid, userId, { days, notes }) {
    const rental = await rentalRepository.findRentalDetails(uuid, userId);
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

    const updatedRental = await rentalRepository.extendRentalDuration(uuid, { newEndDate });

    return {
      message: `Rental agreement extended by ${days} days`,
      new_end_date: newEndDate,
      rental: updatedRental,
    };
  }

  async scheduleReturn(uuid, userId, { return_date, return_slot, pickup_notes }) {
    const rental = await rentalRepository.findRentalDetails(uuid, userId);
    if (!rental) {
      throw new NotFound('Rental agreement not found');
    }

    if (!['confirmed', 'active'].includes(rental.status)) {
      throw new BadRequest(`Cannot schedule return for rental with status '${rental.status}'`);
    }

    // Asynchronously dispatch scheduled return confirmation and 24-hr deposit SLA notice
    (async () => {
      try {
        const user = userId ? await userRepository.findByPk(userId) : null;
        if (user && user.email) {
          await email.sendRentalReturnScheduledEmail({
            to: user.email,
            name: user.name,
            rentalNumber: rental.id,
            returnDate: return_date,
            returnSlot: return_slot,
            pickupAddress: rental.address,
            depositAmount: rental.deposit_amount || 0,
          });
        }
      } catch (mailErr) {
        console.warn('[RentalService] Scheduled return email dispatch failed:', mailErr.message);
      }
    })();

    return {
      message: `Return pickup scheduled for ${return_date} (${return_slot === 'morning' ? '9:00 AM - 1:00 PM' : '2:00 PM - 7:00 PM'}). Technician inspection will initiate the 24-hour security deposit refund SLA.`,
      return_date,
      return_slot,
      rental,
    };
  }
}

module.exports = new RentalService();

