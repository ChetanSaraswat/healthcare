'use strict';

const { productRepository } = require('../repository');
const { BadRequest } = require('../libs/error');

class OrderValidationService {
  /**
   * Validates purchase items:
   * - Product UUID lookup
   * - Product availability and active status
   * - Stock quantity validation
   * - Price calculation
   * - Building validated order items
   *
   * @param {Array} items - Array of { product_id / productId, quantity }
   * @returns {Promise<Array>} Array of validated order items with attached totalAmount
   */
  async validatePurchaseItems(items) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequest('Order items must be a non-empty array');
    }

    const validatedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const productUuid = item.product_uuid;
      if (!productUuid) {
        throw new BadRequest('Product UUID (product_uuid) is required for each item');
      }

      const product = await productRepository.findByIdentifier(
        productUuid,
        { buy_available: true, status: 'active' },
        true
      );

      if (!product) {
        throw new BadRequest(`Product '${productUuid}' is not available for purchase`);
      }

      const quantity = Number(item.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        throw new BadRequest(`Invalid quantity for product #${productUuid}`);
      }

      if (product.stock_quantity < quantity) {
        throw new BadRequest(
          `Insufficient stock for '${product.name}'. Only ${product.stock_quantity} units available.`
        );
      }

      const unitPrice = parseFloat(product.buy_price) || 0;
      const subtotal = unitPrice * quantity;
      totalAmount += subtotal;

      validatedItems.push({
        product,
        quantity,
        unit_price: unitPrice,
        subtotal,
      });
    }

    validatedItems.totalAmount = totalAmount;
    return validatedItems;
  }
}

module.exports = new OrderValidationService();
