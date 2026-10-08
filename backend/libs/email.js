'use strict';

const nodemailer = require('nodemailer');

// Configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST || 'localhost';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '1026', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'AarogyaMed Healthcare <care@aarogyamed.com>';

/**
 * Creates and configures the Nodemailer transporter.
 * Supports connection pooling and graceful error handling.
 */
let transporter = null;

function getTransporter() {
  if (!transporter) {
    const config = {
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      ignoreTLS: true,
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    };

    if (SMTP_USER && SMTP_PASS) {
      config.auth = {
        user: SMTP_USER,
        pass: SMTP_PASS,
      };
    }

    transporter = nodemailer.createTransport(config);
  }
  return transporter;
}

/**
 * Common HTML wrapper with AarogyaMed Warm Clinical Trust design.
 */
function wrapHtmlTemplate({ title, subtitle, contentHtml, ctaText, ctaUrl }) {
  const currentYear = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f7f6;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 600px;
      margin: 24px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .email-header {
      background: linear-gradient(135deg, #0d5c58 0%, #083c39 100%);
      padding: 32px 28px;
      text-align: center;
      color: #ffffff;
    }
    .brand-logo {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }
    .brand-name {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #ffffff;
    }
    .brand-pill {
      background: rgba(212, 154, 55, 0.2);
      border: 1px solid rgba(212, 154, 55, 0.4);
      color: #e5b358;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-block;
      margin-top: 6px;
    }
    .header-title {
      font-size: 20px;
      font-weight: 600;
      margin: 16px 0 6px;
      color: #ffffff;
    }
    .header-subtitle {
      font-size: 14px;
      color: #99f6e4;
      margin: 0;
    }
    .email-body {
      padding: 32px 28px;
      line-height: 1.6;
    }
    .trust-banner {
      background: #f0fdfa;
      border-left: 4px solid #0d5c58;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 24px;
      font-size: 13px;
      color: #134e4a;
    }
    .card-block {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 18px;
      margin-bottom: 24px;
    }
    .card-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      margin: 0 0 12px;
    }
    .table-list {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 14px;
    }
    .table-list th {
      text-align: left;
      padding: 8px 10px;
      border-bottom: 2px solid #e2e8f0;
      color: #475569;
      font-weight: 600;
    }
    .table-list td {
      padding: 10px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }
    .cta-container {
      text-align: center;
      margin: 32px 0 16px;
    }
    .cta-btn {
      display: inline-block;
      background: #0d5c58;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 15px;
      box-shadow: 0 2px 4px rgba(13, 92, 88, 0.2);
    }
    .email-footer {
      background: #0f172a;
      padding: 28px;
      text-align: center;
      color: #94a3b8;
      font-size: 12px;
      line-height: 1.5;
    }
    .footer-links {
      margin-bottom: 12px;
    }
    .footer-links a {
      color: #cbd5e1;
      text-decoration: none;
      margin: 0 8px;
    }
    .helpline-box {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      padding: 12px;
      margin: 16px 0;
      color: #e2e8f0;
    }
    .helpline-box strong {
      color: #38bdf8;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <div class="brand-logo">
        <span class="brand-name">AarogyaMed</span>
      </div>
      <div>
        <span class="brand-pill">CDSCO Certified Equipment</span>
      </div>
      <h1 class="header-title">${title}</h1>
      <p class="header-subtitle">${subtitle}</p>
    </div>

    <div class="email-body">
      ${contentHtml}

      ${
        ctaText && ctaUrl
          ? `<div class="cta-container">
              <a href="${ctaUrl}" class="cta-btn" target="_blank">${ctaText}</a>
            </div>`
          : ''
      }
    </div>

    <div class="email-footer">
      <div class="helpline-box">
        <strong>24/7 Clinical Emergency Hotline:</strong> 1800-889-2273<br>
        <strong>WhatsApp Specialist Support:</strong> +91 98201 12345
      </div>
      <div class="footer-links">
        <a href="http://localhost:3000/account">My Account</a> &bull;
        <a href="http://localhost:3000/terms/rental">Rental Terms</a> &bull;
        <a href="http://localhost:3000/terms/warranty">Biomedical Warranty</a> &bull;
        <a href="http://localhost:3000/contact">Support</a>
      </div>
      <p style="margin: 0;">
        &copy; ${currentYear} AarogyaMed Healthcare Technologies Pvt. Ltd.<br>
        ISO 13485:2016 Certified &bull; CDSCO Registered Biomedical Provider &bull; Pan-India Express Delivery
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Sends a generic email with error catching and development preview logging.
 */
async function sendMail({ to, subject, html, text }) {
  const mailOptions = {
    from: EMAIL_FROM,
    to,
    subject,
    text: text || subject,
    html,
  };

  try {
    const client = getTransporter();
    const info = await client.sendMail(mailOptions);
    console.log(`[EmailService] Dispatched email '${subject}' to ${to} | MessageID: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
      to,
      subject,
    };
  } catch (err) {
    console.warn(`[EmailService] SMTP delivery failed to ${to}: ${err.message}. (Recorded for audit)`);
    return {
      success: false,
      error: err.message,
      to,
      subject,
    };
  }
}

/**
 * 1. Patient Welcome & Onboarding Email
 */
async function sendPatientWelcomeEmail({ to, name }) {
  const title = `Welcome to AarogyaMed, ${name || 'Valued Patient'}`;
  const subtitle = 'Your trusted partner for hospital-grade medical equipment';

  const contentHtml = `
    <div class="trust-banner">
      <strong>Your Account is Verified & Active:</strong> You now have direct access to hospital-grade respiratory, ICU, and mobility equipment with verified CDSCO standards and 24-hour delivery across India.
    </div>

    <p>Dear ${name || 'Patient'},</p>
    <p>Thank you for choosing AarogyaMed. Whether you are managing chronic respiratory health at home, recovering from a surgical procedure, or caring for an elderly family member, our clinical team is here to support you at every step.</p>

    <div class="card-block">
      <div class="card-title">What You Can Do Now</div>
      <ul style="margin: 0; padding-left: 20px; color: #334155;">
        <li style="margin-bottom: 8px;"><strong>Browse & Compare:</strong> Buy outright or rent on flexible weekly/monthly tenures with transparent pricing.</li>
        <li style="margin-bottom: 8px;"><strong>Manage Rentals:</strong> Track active devices, view sterilization certificates, and schedule returns online.</li>
        <li style="margin-bottom: 8px;"><strong>Fast Delivery:</strong> Save delivery addresses and check local hub fulfillment availability.</li>
        <li style="margin-bottom: 8px;"><strong>Save Wishlist:</strong> Keep prescribed equipment ready for quick 1-click checkout.</li>
      </ul>
    </div>

    <div class="card-block" style="border-left: 4px solid #d49a37;">
      <div class="card-title" style="color: #92400e;">Clinical Assurance Commitment</div>
      <p style="margin: 0; font-size: 13px; color: #78350f;">
        Every rental device undergoes a stringent 10-step medical-grade autoclave sterilization protocol with bacteriological air filters replaced before dispatch. Your security deposit is backed by our strict 24-hour return SLA.
      </p>
    </div>
  `;

  return sendMail({
    to,
    subject: 'Welcome to AarogyaMed Healthcare — Your Account is Ready',
    html: wrapHtmlTemplate({
      title,
      subtitle,
      contentHtml,
      ctaText: 'Access Your Patient Portal',
      ctaUrl: 'http://localhost:3000/account',
    }),
  });
}

/**
 * 2. Order Confirmation & Clinical GST Tax Receipt Email
 */
async function sendOrderConfirmationEmail({
  to,
  name,
  orderNumber,
  items = [],
  totalAmount = 0,
  deliveryAddress = null,
  paymentMethod = 'Online Gateway',
  transactionId = '',
  invoiceNumber = '',
}) {
  const formattedOrderNum = orderNumber ? `ORD-${orderNumber}` : 'ORD-CONFIRMED';
  const formattedInvoiceNum = invoiceNumber || `INV-${new Date().getFullYear()}-${orderNumber || '001'}`;
  const title = `Order Confirmed: ${formattedOrderNum}`;
  const subtitle = `GST Tax Invoice #${formattedInvoiceNum}`;

  const addressText = deliveryAddress
    ? `${deliveryAddress.line1 || deliveryAddress.address_line1 || ''}, ${
        deliveryAddress.city || ''
      }, ${deliveryAddress.state || ''} - ${deliveryAddress.pincode || ''}`
    : 'Registered Patient Address';

  const itemsRows = items
    .map(
      (item) => `
      <tr>
        <td><strong>${item.name || item.product_name || 'Medical Equipment'}</strong><br><span style="font-size: 12px; color: #64748b;">HSN: 9018 &bull; Qty: ${item.quantity || 1}</span></td>
        <td style="text-align: right; font-weight: 600;">₹${Number(item.price || item.unit_price || 0).toLocaleString('en-IN')}</td>
      </tr>
    `
    )
    .join('');

  const contentHtml = `
    <div class="trust-banner">
      <strong>Biomedical Quality Check In Progress:</strong> Your equipment order is being pre-calibrated and prepared for secure dispatch under CDSCO Class B/C guidelines.
    </div>

    <p>Dear ${name || 'Patient'},</p>
    <p>Thank you for your order. We have received your payment and our biomedical logistics team has initiated fulfillment.</p>

    <div class="card-block">
      <div class="card-title">Order Information</div>
      <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Order Number:</td>
          <td style="padding: 4px 0; text-align: right; font-weight: 600;">${formattedOrderNum}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Payment Method:</td>
          <td style="padding: 4px 0; text-align: right; font-weight: 600;">${paymentMethod}</td>
        </tr>
        ${
          transactionId
            ? `<tr>
                <td style="padding: 4px 0; color: #64748b;">Transaction Reference:</td>
                <td style="padding: 4px 0; text-align: right; font-family: monospace; font-size: 12px;">${transactionId}</td>
              </tr>`
            : ''
        }
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Delivery Destination:</td>
          <td style="padding: 4px 0; text-align: right;">${addressText}</td>
        </tr>
      </table>
    </div>

    <div class="card-block">
      <div class="card-title">Purchased Equipment</div>
      <table class="table-list">
        <thead>
          <tr>
            <th>Item & Specification</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
          <tr>
            <td style="padding-top: 14px; font-weight: 700; border-top: 2px solid #e2e8f0;">Total (Inclusive of 12% GST):</td>
            <td style="padding-top: 14px; text-align: right; font-weight: 700; color: #0d5c58; font-size: 16px; border-top: 2px solid #e2e8f0;">
              ₹${Number(totalAmount).toLocaleString('en-IN')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  return sendMail({
    to,
    subject: `Order Confirmed: ${formattedOrderNum} — AarogyaMed Healthcare`,
    html: wrapHtmlTemplate({
      title,
      subtitle,
      contentHtml,
      ctaText: 'View Order Details & Tax Invoice',
      ctaUrl: 'http://localhost:3000/account/orders',
    }),
  });
}

/**
 * 3. Rental Agreement & Deposit Assurance Email
 */
async function sendRentalAgreementEmail({
  to,
  name,
  rentalNumber,
  items = [],
  startDate,
  endDate,
  rentalAmount = 0,
  depositAmount = 0,
  deliveryAddress = null,
  transactionId = '',
}) {
  const formattedRentalNum = rentalNumber ? `RNT-${rentalNumber}` : 'RNT-CONFIRMED';
  const title = `Rental Agreement Active: ${formattedRentalNum}`;
  const subtitle = 'Hospital-Grade Equipment & Sterilization Assurance';

  const addressText = deliveryAddress
    ? `${deliveryAddress.line1 || deliveryAddress.address_line1 || ''}, ${
        deliveryAddress.city || ''
      }, ${deliveryAddress.state || ''} - ${deliveryAddress.pincode || ''}`
    : 'Registered Patient Address';

  const itemsRows = items
    .map(
      (item) => `
      <tr>
        <td>
          <strong>${item.name || item.product_name || 'Rental Device'}</strong><br>
          <span style="font-size: 12px; color: #0d5c58;">&bull; 10-Step Autoclave Sterilized & Tested</span>
        </td>
        <td style="text-align: right; font-weight: 600;">₹${Number(item.rate_amount || item.price || 0).toLocaleString('en-IN')} / ${item.rate_type || 'period'}</td>
      </tr>
    `
    )
    .join('');

  const totalCharged = Number(rentalAmount) + Number(depositAmount);

  const contentHtml = `
    <div class="trust-banner">
      <strong>Sterilization Certificate #SC-${rentalNumber || '2026'}:</strong> Device certified sterile. Filters replaced and pressure calibrated per ISO 13485 standards.
    </div>

    <p>Dear ${name || 'Patient'},</p>
    <p>Your rental agreement with AarogyaMed is confirmed. We ensure prompt doorstep delivery, patient installation guidance, and 24/7 technical assistance.</p>

    <div class="card-block">
      <div class="card-title">Rental Contract Summary</div>
      <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Rental Agreement:</td>
          <td style="padding: 4px 0; text-align: right; font-weight: 600;">${formattedRentalNum}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Contract Period:</td>
          <td style="padding: 4px 0; text-align: right; font-weight: 600;">${startDate || 'Immediate'} to ${endDate || 'Open-ended'}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Delivery Destination:</td>
          <td style="padding: 4px 0; text-align: right;">${addressText}</td>
        </tr>
      </table>
    </div>

    <div class="card-block">
      <div class="card-title">Equipment & Financial Breakdown</div>
      <table class="table-list">
        <thead>
          <tr>
            <th>Equipment</th>
            <th style="text-align: right;">Rental Fee</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
          <tr>
            <td style="padding-top: 10px; color: #475569;">Rental Charges Subtotal:</td>
            <td style="padding-top: 10px; text-align: right; font-weight: 600;">₹${Number(rentalAmount).toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td style="padding-top: 6px; color: #047857; font-weight: 600;">Refundable Security Deposit (Held):</td>
            <td style="padding-top: 6px; text-align: right; font-weight: 600; color: #047857;">₹${Number(depositAmount).toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td style="padding-top: 12px; font-weight: 700; border-top: 2px solid #e2e8f0;">Total Initial Payment:</td>
            <td style="padding-top: 12px; text-align: right; font-weight: 700; color: #0d5c58; font-size: 16px; border-top: 2px solid #e2e8f0;">
              ₹${Number(totalCharged).toLocaleString('en-IN')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-block" style="border-left: 4px solid #0d5c58; background: #f0fdfa;">
      <div class="card-title" style="color: #0f766e;">24-Hour Deposit Refund Guarantee</div>
      <p style="margin: 0; font-size: 13px; color: #134e4a;">
        Your refundable deposit of ₹${Number(depositAmount).toLocaleString('en-IN')} is safeguarded in escrow. Upon scheduling a return and clinical technician inspection, your refund is credited directly to your original payment method within 24 hours.
      </p>
    </div>
  `;

  return sendMail({
    to,
    subject: `Rental Agreement Confirmed: ${formattedRentalNum} — AarogyaMed Healthcare`,
    html: wrapHtmlTemplate({
      title,
      subtitle,
      contentHtml,
      ctaText: 'Manage Active Rental & Extend',
      ctaUrl: 'http://localhost:3000/account/rentals',
    }),
  });
}

/**
 * 4. Rental Return Scheduled & Deposit Refund SLA Notice
 */
async function sendRentalReturnScheduledEmail({
  to,
  name,
  rentalNumber,
  returnDate,
  returnSlot,
  pickupAddress = null,
  depositAmount = 0,
}) {
  const formattedRentalNum = rentalNumber ? `RNT-${rentalNumber}` : 'RNT-CONTRACT';
  const title = `Return Pickup Scheduled: ${formattedRentalNum}`;
  const subtitle = 'Biomedical Inspection & Deposit Refund SLA Initiated';

  const slotText = returnSlot === 'morning' ? '9:00 AM - 1:00 PM (Morning)' : '2:00 PM - 7:00 PM (Evening)';
  const addressText = pickupAddress
    ? `${pickupAddress.line1 || pickupAddress.address_line1 || ''}, ${
        pickupAddress.city || ''
      }, ${pickupAddress.state || ''} - ${pickupAddress.pincode || ''}`
    : 'Your registered location';

  const contentHtml = `
    <div class="trust-banner">
      <strong>Technician Scheduled:</strong> A certified AarogyaMed biomedical technician will visit your location to inspect and collect the equipment.
    </div>

    <p>Dear ${name || 'Patient'},</p>
    <p>We have scheduled the return pickup for your rental equipment under agreement <strong>${formattedRentalNum}</strong>.</p>

    <div class="card-block">
      <div class="card-title">Pickup Appointment Details</div>
      <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Scheduled Date:</td>
          <td style="padding: 4px 0; text-align: right; font-weight: 600;">${returnDate}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Preferred Time Slot:</td>
          <td style="padding: 4px 0; text-align: right; font-weight: 600;">${slotText}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Pickup Address:</td>
          <td style="padding: 4px 0; text-align: right;">${addressText}</td>
        </tr>
      </table>
    </div>

    <div class="card-block">
      <div class="card-title">Pre-Pickup Patient Checklist</div>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155; line-height: 1.6;">
        <li>Ensure power adapters, remote controllers, and user manuals are kept together.</li>
        <li>For oxygen concentrators, empty the humidifier water bottle.</li>
        <li>For CPAP/BiPAP devices, keep the carrying case ready.</li>
        <li>Technician will test basic operation and issue an on-spot digital handover receipt.</li>
      </ul>
    </div>

    <div class="card-block" style="border-left: 4px solid #047857; background: #ecfdf5;">
      <div class="card-title" style="color: #065f46;">Deposit Refund Timeline</div>
      <p style="margin: 0; font-size: 13px; color: #047857;">
        Upon technician clearance, your security deposit of <strong>₹${Number(depositAmount).toLocaleString('en-IN')}</strong> will be released within our 24-hour SLA to your source bank account / payment card.
      </p>
    </div>
  `;

  return sendMail({
    to,
    subject: `Return Pickup Confirmed: ${formattedRentalNum} — AarogyaMed Healthcare`,
    html: wrapHtmlTemplate({
      title,
      subtitle,
      contentHtml,
      ctaText: 'View Rental Agreement Status',
      ctaUrl: 'http://localhost:3000/account/rentals',
    }),
  });
}

/**
 * Sends a transactional admin/owner notification email for new purchases and rentals.
 */
async function sendAdminNotificationEmail({ to, subject, html, text }) {
  const targetEmail = to || process.env.ADMIN_NOTIFICATION_EMAIL || 'care@aarogyamed.com';
  return sendMail({
    to: targetEmail,
    subject,
    html,
    text,
  });
}

module.exports = {
  getTransporter,
  sendMail,
  sendPatientWelcomeEmail,
  sendOrderConfirmationEmail,
  sendRentalAgreementEmail,
  sendRentalReturnScheduledEmail,
  sendAdminNotificationEmail,
};
