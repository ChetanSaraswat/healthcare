'use strict';

const crypto = require('crypto');
const { email } = require('../libs');

class EmailController {
  async sendTestEmail(req, res, next) {
    try {
      const {
        to,
        name = 'Sunita Sharma',
        template,
        orderNumber = 1042,
        rentalNumber = 2055,
        totalAmount = 45999,
        depositAmount = 15000,
        returnDate = '2026-10-05',
        returnSlot = 'morning',
      } = req.body;

      let result;

      switch (template) {
        case 'welcome':
          result = await email.sendPatientWelcomeEmail({ to, name });
          break;

        case 'order_confirmation':
          result = await email.sendOrderConfirmationEmail({
            to,
            name,
            orderNumber,
            items: [
              { name: 'ResMed AirSense 10 AutoSet CPAP Machine', price: totalAmount, quantity: 1 },
            ],
            totalAmount,
            deliveryAddress: {
              line1: 'Flat 402, Green Glen Layout, Bellandur',
              city: 'Bengaluru',
              state: 'Karnataka',
              pincode: '560103',
            },
            paymentMethod: 'Online Payment (Razorpay)',
            transactionId: crypto.randomUUID(),
          });
          break;

        case 'rental_agreement':
          result = await email.sendRentalAgreementEmail({
            to,
            name,
            rentalNumber,
            items: [
              {
                product_name: 'Philips EverFlo 5L Oxygen Concentrator (Hospital Grade)',
                rate_amount: 3500,
                rate_type: 'monthly',
              },
            ],
            startDate: '2026-10-01',
            endDate: '2026-11-01',
            rentalAmount: 3500,
            depositAmount,
            deliveryAddress: {
              line1: 'Flat 402, Green Glen Layout, Bellandur',
              city: 'Bengaluru',
              state: 'Karnataka',
              pincode: '560103',
            },
            transactionId: crypto.randomUUID(),
          });
          break;

        case 'rental_return':
          result = await email.sendRentalReturnScheduledEmail({
            to,
            name,
            rentalNumber,
            returnDate,
            returnSlot,
            pickupAddress: {
              line1: 'Flat 402, Green Glen Layout, Bellandur',
              city: 'Bengaluru',
              state: 'Karnataka',
              pincode: '560103',
            },
            depositAmount,
          });
          break;

        default:
          return res.status(400).json({ success: false, message: `Unknown template: ${template}` });
      }

      return res.status(200).json({
        success: true,
        message: `Test email for template '${template}' processed`,
        deliveryResult: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async listTemplates(req, res) {
    const templates = [
      {
        id: 'welcome',
        name: 'Patient Welcome & Clinical Onboarding',
        description: 'Sent upon successful patient account registration with care hotline and portal links.',
      },
      {
        id: 'order_confirmation',
        name: 'Order Confirmation & Clinical GST Receipt',
        description: 'Sent upon purchase payment with itemized HSN 9018 tax breakdown and calibration status.',
      },
      {
        id: 'rental_agreement',
        name: 'Rental Agreement & Sterilization Assurance',
        description: 'Sent upon rental confirmation with 10-step sterilization certification and 24-hr deposit SLA notice.',
      },
      {
        id: 'rental_return',
        name: 'Rental Return Scheduled & Inspection Notice',
        description: 'Sent upon return scheduling with technician visit details, pre-pickup checklist, and refund timeline.',
      },
    ];

    return res.status(200).json({
      success: true,
      templates,
    });
  }
}

module.exports = new EmailController();
