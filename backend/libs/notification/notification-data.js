'use strict';

/**
 * Pure Domain Value Object for Transaction Notification Data.
 * Encapsulates backend-verified details for a BUY or RENT transaction.
 */
class TransactionNotificationData {
  constructor({
    transactionType,
    transactionId,
    transactionUuid,
    transactionDate,
    status,
    paymentStatus,
    paymentMethod,
    paymentId,
    totalAmount,
    currency = 'INR',
    customer,
    items = [],
    address = null,
    rentalDetails = null,
  }) {
    this.transactionType = transactionType; // 'BUY' | 'RENT'
    this.transactionId = transactionId;
    this.transactionUuid = transactionUuid;
    this.transactionDate = transactionDate;
    this.status = status;
    this.paymentStatus = paymentStatus;
    this.paymentMethod = paymentMethod;
    this.paymentId = paymentId;
    this.totalAmount = Number(totalAmount) || 0;
    this.currency = currency;
    this.customer = customer || { name: 'Customer', email: null, phone: null, id: null };
    this.items = items;
    this.address = address;
    this.rentalDetails = rentalDetails;
  }

  /**
   * Factory method to build backend-verified notification data from an Order DB record.
   */
  static fromOrder(order, payment = null) {
    if (!order) {
      throw new Error('Order instance is required to build notification data');
    }

    const orderData = typeof order.get === 'function' ? order.get({ plain: true }) : order;
    const user = orderData.user || null;
    const addr = orderData.address || null;

    const isPaid =
      orderData.status === 'paid' ||
      orderData.payment_status === 'paid' ||
      (payment && payment.status === 'captured');

    const paymentMethod =
      (payment && payment.payment_method) ||
      (orderData.payment_id ? 'Online Payment' : 'Cash on Delivery (COD)');

    const paymentId =
      (payment && payment.gateway_payment_id) ||
      orderData.payment_id ||
      null;

    const items = (orderData.items || []).map((it) => {
      const product = it.product || {};
      const unitPrice = parseFloat(it.unit_price) || 0;
      const quantity = parseInt(it.quantity, 10) || 1;
      const subtotal = parseFloat(it.subtotal) || unitPrice * quantity;
      return {
        id: it.product_id || product.id,
        name: product.name || 'Medical Equipment',
        quantity,
        unitPrice,
        subtotal,
        sku: product.sku || null,
        specifications: product.specifications || null,
      };
    });

    const customerAddress = addr
      ? {
          name: addr.name || (user && user.name) || null,
          phone: addr.phone || (user && user.phone) || null,
          line1: addr.line1 || '',
          line2: addr.line2 || null,
          city: addr.city || '',
          state: addr.state || '',
          pincode: addr.pincode || '',
          country: addr.country || 'India',
        }
      : null;

    return new TransactionNotificationData({
      transactionType: 'BUY',
      transactionId: orderData.id,
      transactionUuid: orderData.uuid,
      transactionDate: orderData.created_at || orderData.createdAt || new Date(),
      status: orderData.status,
      paymentStatus: isPaid ? 'Paid' : 'Pending (COD)',
      paymentMethod,
      paymentId,
      totalAmount: parseFloat(orderData.total_amount) || 0,
      currency: 'INR',
      customer: {
        id: user ? user.id : orderData.user_id,
        uuid: user ? user.uuid : null,
        name: (user && user.name) || (addr && addr.name) || 'Valued Customer',
        email: (user && user.email) || null,
        phone: (user && user.phone) || (addr && addr.phone) || null,
      },
      items,
      address: customerAddress,
    });
  }

  /**
   * Factory method to build backend-verified notification data from a RentalOrder DB record.
   */
  static fromRental(rental, payment = null) {
    if (!rental) {
      throw new Error('Rental instance is required to build notification data');
    }

    const rentalData = typeof rental.get === 'function' ? rental.get({ plain: true }) : rental;
    const user = rentalData.user || null;
    const addr = rentalData.address || null;

    const isPaid =
      rentalData.status === 'confirmed' ||
      rentalData.status === 'active' ||
      (payment && payment.status === 'captured');

    const paymentMethod =
      (payment && payment.payment_method) ||
      (rentalData.payment_id ? 'Online Payment' : 'Cash on Delivery (COD)');

    const paymentId =
      (payment && payment.gateway_payment_id) ||
      rentalData.payment_id ||
      null;

    let calculatedRentalAmount = 0;
    const items = (rentalData.items || []).map((it) => {
      const product = it.product || {};
      const rateAmount = parseFloat(it.rate_amount) || 0;
      const quantity = parseInt(it.quantity, 10) || 1;
      const subtotal = parseFloat(it.subtotal) || rateAmount * quantity;
      const itemDeposit = parseFloat(it.deposit_amount) || 0;
      calculatedRentalAmount += subtotal;

      return {
        id: it.product_id || product.id,
        name: product.name || 'Rental Equipment',
        quantity,
        rateType: it.rate_type || 'daily',
        rateAmount,
        subtotal,
        depositAmount: itemDeposit,
        startDate: rentalData.start_date,
        endDate: rentalData.end_date,
      };
    });

    const depositAmount = parseFloat(rentalData.deposit_amount) || 0;
    const totalPayable = calculatedRentalAmount + depositAmount;

    const customerAddress = addr
      ? {
          name: addr.name || (user && user.name) || null,
          phone: addr.phone || (user && user.phone) || null,
          line1: addr.line1 || '',
          line2: addr.line2 || null,
          city: addr.city || '',
          state: addr.state || '',
          pincode: addr.pincode || '',
          country: addr.country || 'India',
        }
      : null;

    return new TransactionNotificationData({
      transactionType: 'RENT',
      transactionId: rentalData.id,
      transactionUuid: rentalData.uuid,
      transactionDate: rentalData.created_at || rentalData.createdAt || new Date(),
      status: rentalData.status,
      paymentStatus: isPaid ? 'Paid' : 'Pending (COD)',
      paymentMethod,
      paymentId,
      totalAmount: totalPayable,
      currency: 'INR',
      customer: {
        id: user ? user.id : rentalData.user_id,
        uuid: user ? user.uuid : null,
        name: (user && user.name) || (addr && addr.name) || 'Valued Customer',
        email: (user && user.email) || null,
        phone: (user && user.phone) || (addr && addr.phone) || null,
      },
      items,
      address: customerAddress,
      rentalDetails: {
        startDate: rentalData.start_date,
        endDate: rentalData.end_date,
        rentalAmount: calculatedRentalAmount,
        depositAmount,
        depositStatus: rentalData.deposit_status || 'held',
      },
    });
  }
}

module.exports = TransactionNotificationData;
