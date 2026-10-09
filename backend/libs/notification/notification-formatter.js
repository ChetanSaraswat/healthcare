'use strict';

/**
 * Format date nicely for WhatsApp and Email notifications.
 */
function formatDate(dateInput) {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }) + ' IST';
  } catch (err) {
    return String(dateInput);
  }
}

/**
 * Format currency amount with commas.
 */
function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return '₹' + num.toLocaleString('en-IN');
}

/**
 * Transaction Notification Formatter.
 * Formats backend-verified TransactionNotificationData for WhatsApp and Email.
 */
class TransactionNotificationFormatter {
  /**
   * Formats the WhatsApp message according to the required specification.
   */
  static formatWhatsApp(data) {
    const isBuy = data.transactionType === 'BUY';
    const header = isBuy ? '🛒 New Purchase' : '🏠 New Rental';
    const dateStr = formatDate(data.transactionDate);

    // Customer lines
    const customerLines = [
      `Customer:`,
      `Name: ${data.customer.name || 'N/A'}`,
      `Phone: ${data.customer.phone || 'N/A'}`,
      `Email: ${data.customer.email || 'N/A'}${data.customer.id ? `\nCustomer ID: #${data.customer.id}` : ''}`,
    ].join('\n');

    // Items lines
    let itemsBlock = '';
    if (isBuy) {
      const itemsList = data.items.map(
        (it) => `${it.quantity} × ${it.name} — ${formatCurrency(it.subtotal || it.unitPrice * it.quantity)}`
      );
      itemsBlock = `Items:\n${itemsList.length > 0 ? itemsList.join('\n') : 'No items listed'}`;
    } else {
      const rent = data.rentalDetails || {};
      const periodStr = rent.startDate && rent.endDate
        ? `${rent.startDate} → ${rent.endDate}`
        : `${rent.startDate || 'Immediate'}`;

      const itemsList = data.items.map((it) => {
        const rateLabel = it.rateType ? ` (${it.rateType})` : '';
        return `${it.quantity} × ${it.name}\nRental period: ${periodStr}\nRental rate: ${formatCurrency(it.rateAmount)}${rateLabel} (Subtotal: ${formatCurrency(it.subtotal)})`;
      });

      itemsBlock = `Items:\n${itemsList.join('\n\n')}\nSecurity Deposit: ${formatCurrency(rent.depositAmount || 0)}`;
    }

    // Financial lines
    let totalLine = `Total: ${formatCurrency(data.totalAmount)}`;
    if (!isBuy && data.rentalDetails) {
      totalLine = `Total: ${formatCurrency(data.totalAmount)} (Rent: ${formatCurrency(data.rentalDetails.rentalAmount || 0)} + Deposit: ${formatCurrency(data.rentalDetails.depositAmount || 0)})`;
    }

    const paymentLines = [
      totalLine,
      `Payment: ${data.paymentStatus} (${data.paymentMethod})`,
      `Transaction ID: ${data.paymentId || 'N/A'}`,
    ].join('\n');

    // Address lines
    let addressBlock = 'Customer Address:\nNot provided';
    if (data.address) {
      const addr = data.address;
      const street = [addr.line1, addr.line2].filter(Boolean).join(', ');
      const cityStateZip = [addr.city, addr.state, addr.pincode].filter(Boolean).join(', ');
      const contact = [addr.name, addr.phone].filter(Boolean).join(' | ');
      addressBlock = `Customer Address:\n${contact ? contact + '\n' : ''}${street}\n${cityStateZip}\n${addr.country || 'India'}`;
    }

    return `${header}

Order: #${data.transactionId}
Type: ${data.transactionType}
Date: ${dateStr}

${customerLines}

${itemsBlock}

${paymentLines}

${addressBlock}`;
  }

  /**
   * Formats the Email subject.
   */
  static formatEmailSubject(data) {
    const isBuy = data.transactionType === 'BUY';
    const typeLabel = isBuy ? 'New Purchase' : 'New Rental';
    return `${typeLabel} — Order #${data.transactionId} (${data.paymentStatus})`;
  }

  /**
   * Formats a rich, responsive HTML email matching Omkar Healthcare's Warm Clinical Trust design.
   */
  static formatEmailHtml(data) {
    const isBuy = data.transactionType === 'BUY';
    const title = isBuy ? 'New Purchase Order Received' : 'New Rental Contract Initiated';
    const badgeColor = isBuy ? '#0284c7' : '#0d9488';
    const badgeBg = isBuy ? '#e0f2fe' : '#ccfbf1';
    const dateStr = formatDate(data.transactionDate);

    // Build items table rows
    const itemRows = data.items
      .map((it) => {
        if (isBuy) {
          return `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 8px; font-weight: 600; color: #1e293b;">${it.name}</td>
              <td style="padding: 10px 8px; text-align: center; color: #475569;">${it.quantity}</td>
              <td style="padding: 10px 8px; text-align: right; color: #475569;">${formatCurrency(it.unitPrice)}</td>
              <td style="padding: 10px 8px; text-align: right; font-weight: 600; color: #0f172a;">${formatCurrency(it.subtotal)}</td>
            </tr>
          `;
        } else {
          const rateLabel = it.rateType ? ` / ${it.rateType}` : '';
          return `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 8px; font-weight: 600; color: #1e293b;">
                ${it.name}
                <div style="font-size: 11px; color: #64748b; font-weight: 400; margin-top: 2px;">
                  Period: ${it.startDate || 'Immediate'} → ${it.endDate || 'Open'}
                </div>
              </td>
              <td style="padding: 10px 8px; text-align: center; color: #475569;">${it.quantity}</td>
              <td style="padding: 10px 8px; text-align: right; color: #475569;">${formatCurrency(it.rateAmount)}${rateLabel}</td>
              <td style="padding: 10px 8px; text-align: right; font-weight: 600; color: #0f172a;">${formatCurrency(it.subtotal)}</td>
            </tr>
          `;
        }
      })
      .join('');

    // Rental specific callout
    let rentalSummaryBlock = '';
    if (!isBuy && data.rentalDetails) {
      rentalSummaryBlock = `
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-top: 14px;">
          <table style="width: 100%; font-size: 13px;">
            <tr>
              <td style="color: #166534; padding: 2px 0;">Rental Period:</td>
              <td style="text-align: right; font-weight: 600; color: #166534;">${data.rentalDetails.startDate || 'Immediate'} → ${data.rentalDetails.endDate || 'Open'}</td>
            </tr>
            <tr>
              <td style="color: #166534; padding: 2px 0;">Rental Subtotal:</td>
              <td style="text-align: right; font-weight: 600; color: #166534;">${formatCurrency(data.rentalDetails.rentalAmount || 0)}</td>
            </tr>
            <tr>
              <td style="color: #166534; padding: 2px 0;">Refundable Security Deposit:</td>
              <td style="text-align: right; font-weight: 600; color: #166534;">${formatCurrency(data.rentalDetails.depositAmount || 0)}</td>
            </tr>
          </table>
        </div>
      `;
    }

    // Address block HTML
    let addressHtml = '<p style="color: #64748b; font-size: 13px; margin: 0;">No address on file</p>';
    if (data.address) {
      const a = data.address;
      addressHtml = `
        <div style="font-size: 13px; color: #334155; line-height: 1.5;">
          ${a.name ? `<strong>${a.name}</strong><br>` : ''}
          ${a.phone ? `Phone: ${a.phone}<br>` : ''}
          ${a.line1}${a.line2 ? `, ${a.line2}` : ''}<br>
          ${a.city}, ${a.state} - ${a.pincode}<br>
          ${a.country || 'India'}
        </div>
      `;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          
          <!-- Header Bar -->
          <tr>
            <td style="background: #0f172a; padding: 20px 28px; text-align: left;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">Omkar Healthcare Operations</h1>
                    <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">Admin Transaction Alert System</p>
                  </td>
                  <td align="right">
                    <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
                      ${data.transactionType}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Summary Hero -->
          <tr>
            <td style="padding: 24px 28px 16px; border-bottom: 1px solid #f1f5f9;">
              <h2 style="margin: 0 0 6px; font-size: 18px; color: #0f172a;">${title} — #${data.transactionId}</h2>
              <p style="margin: 0; font-size: 13px; color: #64748b;">Recorded at ${dateStr}</p>
            </td>
          </tr>

          <!-- Customer & Payment Grid -->
          <tr>
            <td style="padding: 16px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48%" valign="top" style="background: #f8fafc; border-radius: 8px; padding: 14px 16px; border: 1px solid #e2e8f0;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">Customer Details</div>
                    <div style="font-size: 14px; font-weight: 600; color: #0f172a;">${data.customer.name}</div>
                    <div style="font-size: 12px; color: #475569; margin-top: 3px;">📧 ${data.customer.email || 'N/A'}</div>
                    <div style="font-size: 12px; color: #475569; margin-top: 2px;">📞 ${data.customer.phone || 'N/A'}</div>
                    ${data.customer.id ? `<div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">User ID: #${data.customer.id}</div>` : ''}
                  </td>
                  <td width="4%"></td>
                  <td width="48%" valign="top" style="background: #f8fafc; border-radius: 8px; padding: 14px 16px; border: 1px solid #e2e8f0;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">Payment Details</div>
                    <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${formatCurrency(data.totalAmount)}</div>
                    <div style="font-size: 12px; color: #0284c7; font-weight: 600; margin-top: 3px;">Status: ${data.paymentStatus}</div>
                    <div style="font-size: 12px; color: #475569; margin-top: 2px;">Method: ${data.paymentMethod}</div>
                    ${data.paymentId ? `<div style="font-size: 11px; color: #64748b; margin-top: 4px; font-family: monospace;">Ref: ${data.paymentId}</div>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 12px 28px;">
              <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Equipment Breakdown</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f1f5f9; color: #475569;">
                    <th align="left" style="padding: 8px; font-weight: 600;">Product</th>
                    <th align="center" style="padding: 8px; font-weight: 600;">Qty</th>
                    <th align="right" style="padding: 8px; font-weight: 600;">Rate</th>
                    <th align="right" style="padding: 8px; font-weight: 600;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>

              ${rentalSummaryBlock}
            </td>
          </tr>

          <!-- Address Section -->
          <tr>
            <td style="padding: 12px 28px 24px;">
              <div style="background: #f8fafc; border-radius: 8px; padding: 14px 16px; border: 1px solid #e2e8f0;">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">Customer Address</div>
                ${addressHtml}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f8fafc; padding: 16px 28px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                Automated Transaction Alert — Omkar Healthcare & Emergency Supplies<br>
                This internal message was automatically generated upon successful order confirmation.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }
}

module.exports = TransactionNotificationFormatter;
