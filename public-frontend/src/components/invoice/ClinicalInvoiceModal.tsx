'use client';

import React from 'react';
import { InvoiceEntity } from '@/domain/entities/invoice.entity';
import { useTranslation } from '@/locales';
import { Printer, X, ShieldCheck, CheckCircle2, Download } from 'lucide-react';

interface ClinicalInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  orderType?: 'buy' | 'rent';
}

export const ClinicalInvoiceModal: React.FC<ClinicalInvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
  orderType = 'buy',
}) => {
  const { locale } = useTranslation();

  if (!isOpen || !order) return null;

  const orderNum = order.orderNumber || order.rentalOrderNumber || 'ARM-2026-9871';
  const invoiceNum = InvoiceEntity.generateInvoiceNumber(orderNum, orderType === 'rent' ? 'RNT-INV' : 'TAX-INV');
  const invoiceDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const subtotal = order.subtotal || order.totalRentalPrice || order.totalAmount || 50000;
  const gstBreakdown = InvoiceEntity.calculateGst(subtotal, false);
  const isRental = orderType === 'rent';
  const hsnSacCode = InvoiceEntity.getHsnSacCode(isRental);

  const customerName = order.deliveryAddress?.name || order.shippingAddress?.name || 'Sunita Sharma';
  const customerAddress = order.deliveryAddress?.addressLine1 || order.shippingAddress?.addressLine1 || 'Suite 402, Metro Complex';
  const customerCity = order.deliveryAddress?.city || order.shippingAddress?.city || 'Bengaluru';
  const customerPincode = order.deliveryAddress?.pincode || order.shippingAddress?.pincode || '560001';

  const items = order.items && order.items.length > 0
    ? order.items
    : [
        {
          id: 'item-1',
          productName: orderType === 'rent' ? 'ResMed AirSense 10 AutoSet CPAP (Rental)' : 'ResMed AirSense 10 AutoSet CPAP Machine',
          unitPrice: subtotal,
          quantity: 1,
        },
      ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(19, 27, 46, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          width: '100%',
          maxWidth: 780,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Modal Top Bar (Hidden in Print) */}
        <div
          className="no-print"
          style={{
            padding: '1rem 1.75rem',
            borderBottom: '1px solid #eaedff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#faf8ff',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                background: '#16453A',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {isRental ? 'Rental Agreement Invoice' : 'GST Tax Invoice'}
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#131b2e' }}>
              {invoiceNum}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                background: '#16453A',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Printer size={16} />
              <span>{locale === 'hi' ? 'चालान प्रिंट करें / PDF' : 'Print / Download PDF'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#6e7977',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div
          id="printable-invoice"
          style={{
            padding: '2.5rem',
            color: '#131b2e',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid #16453A',
              paddingBottom: '1.5rem',
              marginBottom: '1.75rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <img src="/images/logo.png" alt="Omkar Healthcare" width={40} height={40} style={{ objectFit: 'contain' }} />
                <div style={{ display: 'inline-flex', flexDirection: 'column', width: 'fit-content' }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '1.45rem',
                      fontWeight: 900,
                      color: '#16453A',
                      letterSpacing: '0.06em',
                      lineHeight: 1,
                      width: '100%',
                    }}
                  >
                    OMKAR
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      marginTop: 3,
                    }}
                  >
                    <span style={{ flex: 1, height: '1.5px', background: '#B75932', marginRight: 4 }} />
                    <span
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        color: '#B75932',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      HEALTHCARE
                    </span>
                    <span style={{ flex: 1, height: '1.5px', background: '#B75932', marginLeft: 4 }} />
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#6e7977', lineHeight: 1.5 }}>
                Regd. Office: 14/B, Hosur Road, Koramangala 5th Block<br />
                Bengaluru, Karnataka — 560095<br />
                <strong>GSTIN:</strong> {InvoiceEntity.GSTIN} | <strong>PAN:</strong> {InvoiceEntity.PAN}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#16453A', fontWeight: 700, marginTop: 4 }}>
                CDSCO License: {InvoiceEntity.CDSCO_LICENSE} • {InvoiceEntity.ISO_CERTIFICATION}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#131b2e', margin: '0 0 4px', textTransform: 'uppercase' }}>
                {isRental ? 'Medical Equipment Rental Invoice' : 'Tax Invoice (GST Compliant)'}
              </h1>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#16453A' }}>
                {invoiceNum}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#6e7977', marginTop: 2 }}>
                <strong>Date:</strong> {invoiceDate}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#6e7977' }}>
                <strong>Order Ref:</strong> {orderNum}
              </div>
            </div>
          </div>

          {/* Bill To & Dispatch Details */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 24,
              marginBottom: '2rem',
              background: '#faf8ff',
              padding: '1.25rem 1.5rem',
              borderRadius: 12,
              border: '1px solid #eaedff',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: '#16453A', marginBottom: 4 }}>
                Billed To (Patient / Caregiver):
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#131b2e' }}>
                {customerName}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#3e4947', marginTop: 2, lineHeight: 1.4 }}>
                {customerAddress}<br />
                {customerCity} — {customerPincode}, India<br />
                State: Karnataka (Code: 29)
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: '#16453A', marginBottom: 4 }}>
                Fulfillment & Delivery Details:
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#3e4947', lineHeight: 1.5 }}>
                <strong>Doorstep Delivery Mode:</strong> Biomedical Temperature-Controlled Logistics<br />
                <strong>Installation & Demo:</strong> Certified Biomedical Technician<br />
                <strong>Payment Mode:</strong> Razorpay Online / UPI Gateway (Completed)<br />
                <strong>Place of Supply:</strong> Karnataka (Intra-State)
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '1.75rem',
              fontSize: '0.8125rem',
            }}
          >
            <thead>
              <tr style={{ background: '#f2f3ff', borderBottom: '2px solid #dae2fd', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', fontWeight: 800, color: '#131b2e' }}>#</th>
                <th style={{ padding: '10px 12px', fontWeight: 800, color: '#131b2e' }}>Description of Medical Goods / Services</th>
                <th style={{ padding: '10px 12px', fontWeight: 800, color: '#131b2e' }}>HSN / SAC</th>
                <th style={{ padding: '10px 12px', fontWeight: 800, color: '#131b2e', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '10px 12px', fontWeight: 800, color: '#131b2e', textAlign: 'right' }}>Taxable Value</th>
                <th style={{ padding: '10px 12px', fontWeight: 800, color: '#131b2e', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, idx: number) => {
                const itemTotal = (item.unitPrice || subtotal) * (item.quantity || 1);
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #eaedff' }}>
                    <td style={{ padding: '12px' }}>{idx + 1}</td>
                    <td style={{ padding: '12px' }}>
                      <strong style={{ color: '#131b2e' }}>{item.productName || item.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#6e7977', marginTop: 2 }}>
                        {isRental
                          ? '10-Step Autoclave Sterilized • 24-Hour Deposit Refund SLA'
                          : 'Brand New Sealed Factory Packaging • OEM Comprehensive Warranty'}
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#6e7977' }}>{hsnSacCode}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{item.quantity || 1}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      ₹{itemTotal.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#131b2e' }}>
                      ₹{itemTotal.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Tax Calculation & Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
            <div style={{ width: 340, background: '#faf8ff', padding: '1.25rem', borderRadius: 12, border: '1px solid #eaedff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.8125rem' }}>
                <span style={{ color: '#6e7977' }}>Taxable Subtotal:</span>
                <strong style={{ color: '#131b2e' }}>₹{gstBreakdown.taxableAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.8125rem' }}>
                <span style={{ color: '#6e7977' }}>CGST (6.0%):</span>
                <span style={{ color: '#3e4947' }}>+ ₹{gstBreakdown.cgstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.8125rem' }}>
                <span style={{ color: '#6e7977' }}>SGST (6.0%):</span>
                <span style={{ color: '#3e4947' }}>+ ₹{gstBreakdown.sgstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div
                style={{
                  borderTop: '2px solid #16453A',
                  paddingTop: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.125rem',
                  fontWeight: 900,
                }}
              >
                <span style={{ color: '#16453A' }}>Grand Total (INR):</span>
                <span style={{ color: '#16453A' }}>₹{gstBreakdown.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer & Compliance Note */}
          <div
            style={{
              borderTop: '1px solid #eaedff',
              paddingTop: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              fontSize: '0.75rem',
              color: '#6e7977',
            }}
          >
            <div style={{ maxWidth: 460 }}>
              <strong>Biomedical Compliance Notice:</strong><br />
              This equipment is classified under CDSCO Medical Devices Rules (2017). All serialized units undergo batch calibration and 10-step sterilization prior to dispatch. This is a computer-generated tax invoice and requires no physical signature under the Information Technology Act, 2000.
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, color: '#16453A', fontSize: '0.875rem' }}>
                For Omkar Healthcare India
              </div>
              <div style={{ fontStyle: 'italic', color: '#3e4947', marginTop: 14 }}>
                Authorized Biomedical Signatory
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
