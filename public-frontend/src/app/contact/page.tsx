'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/locales';
import { CONTACT_CONFIG } from '@/config/contact.config';

import {
  PhoneCall,
  MessageCircle,
  Send,
  CheckCircle2,
  Truck,
  HeartHandshake,
} from 'lucide-react';

export default function ContactPage() {
  const { locale } = useTranslation();
  const [inquiryType, setInquiryType] = useState('emergency');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [whatsappSentUrl, setWhatsappSentUrl] = useState('');

  const inquiryLabels: Record<string, string> = {
    emergency: 'Emergency Equipment Dispatch (4-Hour Response)',
    demo: 'Book Studio Demonstration Trial',
    'rental-ext': 'Rental Extension / Pickup Assistance',
    prescription: 'Prescription & Equipment Advice',
    bulk: 'Bulk Hospital / Clinic Solutions',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const waText = [
      `*New Clinical Care Request - Omkar Healthcare*`,
      `• *Assistance Type:* ${inquiryLabels[inquiryType] || inquiryType}`,
      `• *Caregiver Name:* ${name.trim()}`,
      `• *Phone Number:* ${phone.trim()}`,
      `• *Delivery Location:* ${city}`,
      message.trim() ? `• *Requirements / Notes:* ${message.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const waUrl = CONTACT_CONFIG.getWhatsAppHref(locale, waText);
    setWhatsappSentUrl(waUrl);

    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#faf8ff', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '2.5rem 0 4rem' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 1.5rem' }}>
          {/* Top Title */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 999,
                background: '#e8f5f3',
                color: '#16453A',
                fontSize: '0.8125rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 10,
              }}
            >
              <HeartHandshake size={16} /> Caregiver Assistance &amp; Biomedical Helpline
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
              We Are Here to Support Your Family
            </h1>
            <p style={{ fontSize: '1rem', color: '#6e7977', maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}>
              Whether you need rapid 4-hour emergency oxygen concentrator dispatch, CPAP titration and pressure calibration assistance, or respiratory care guidance.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            {/* LEFT: Quick Contact Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Emergency Helpline Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #16453A 0%, #004b46 100%)',
                  borderRadius: 20,
                  padding: '1.75rem',
                  color: '#ffffff',
                  boxShadow: '0 8px 24px rgba(0,92,85,0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PhoneCall size={22} color="#9cf2e8" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9cf2e8' }}>
                      24/7 Clinical Emergency Helpline
                    </span>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '2px 0 0' }}>
                      1800-889-2273
                    </h2>
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, lineHeight: 1.5, margin: '0 0 16px' }}>
                  Toll-free across all Indian networks. Direct priority line to clinical coordinators for urgent oxygen dispatch and respiratory support.
                </p>
                <a
                  href="tel:18008892273"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 18px',
                    borderRadius: 10,
                    background: '#ffffff',
                    color: '#16453A',
                    fontSize: '0.875rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                  }}
                >
                  <PhoneCall size={16} /> Call Immediately
                </a>
              </div>

              {/* WhatsApp Consultation Card */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 20,
                  padding: '1.75rem',
                  border: '1px solid #dae2fd',
                  boxShadow: '0 4px 16px rgba(19, 27, 46, 0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: '#e7f9ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageCircle size={22} color="#16a34a" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
                      WhatsApp Bio-Medical Chat
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                      ● Active Now (Avg response: 3 mins)
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#3e4947', lineHeight: 1.5, margin: '0 0 16px' }}>
                  Send photos of doctor prescriptions, ask titration questions, or share location pins for rapid delivery coordination.
                </p>
                {CONTACT_CONFIG.whatsappEnabled && (
                  <a
                    href={CONTACT_CONFIG.getWhatsAppHref(locale)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 18px',
                      borderRadius: 10,
                      background: '#16a34a',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <MessageCircle size={16} /> Open WhatsApp Specialist
                  </a>
                )}
              </div>

              {/* Delivery & Dispatch SLA Card */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 20,
                  padding: '1.5rem',
                  border: '1px solid #dae2fd',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Truck size={20} color="#B75932" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
                    Pan-India Home Delivery &amp; Setup
                  </h3>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#6e7977', margin: '0 0 12px', lineHeight: 1.5 }}>
                  Doorstep delivery and certified technician installation across all serviceable pincodes in India.
                </p>
                <Link
                  href="/shop"
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: '#B75932',
                    textDecoration: 'none',
                  }}
                >
                  Browse Medical Equipment Catalog &rarr;
                </Link>
              </div>
            </div>

            {/* RIGHT: Structured Inquiry Form */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: 20,
                padding: '2rem',
                border: '1px solid #dae2fd',
                boxShadow: '0 4px 20px rgba(19, 27, 46, 0.04)',
              }}
            >
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e8f5f3', color: '#16453A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 8px' }}>
                    Clinical Request Submitted
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#3e4947', lineHeight: 1.6, margin: '0 0 16px' }}>
                    Your request details have been dispatched to our bio-medical coordinator via WhatsApp at <strong>{CONTACT_CONFIG.phoneDisplay}</strong>. A coordinator will also call you at <strong>{phone}</strong> within 15 minutes.
                  </p>
                  {whatsappSentUrl && (
                    <div style={{ marginBottom: 20 }}>
                      <a
                        href={whatsappSentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '10px 20px',
                          borderRadius: 10,
                          background: '#16a34a',
                          color: '#ffffff',
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                        }}
                      >
                        <MessageCircle size={17} /> Open in WhatsApp ({CONTACT_CONFIG.phoneDisplay})
                      </a>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      background: '#f2f3ff',
                      color: '#B75932',
                      border: 'none',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 4px' }}>
                      Send Care Request
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: '#6e7977', margin: 0 }}>
                      We respond to all urgent inquiries in under 15 minutes.
                    </p>
                  </div>

                  {/* Inquiry Type Radio / Dropdown */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                      How can we assist you? *
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1px solid #dae2fd',
                        background: '#ffffff',
                        fontSize: '0.875rem',
                      }}
                    >
                      <option value="emergency">Emergency Equipment Dispatch (4-Hour Response)</option>
                      <option value="demo">Book Studio Demonstration Trial</option>
                      <option value="rental-ext">Rental Extension / Pickup Assistance</option>
                      <option value="prescription">Prescription &amp; Equipment Advice</option>
                      <option value="bulk">Bulk Hospital / Clinic Solutions</option>
                    </select>
                  </div>

                  {/* Name and Mobile */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                        Caregiver Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Ananya Deshmukh"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #dae2fd', fontSize: '0.875rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #dae2fd', fontSize: '0.875rem' }}
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                      Delivery City / Location *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1px solid #dae2fd',
                        background: '#ffffff',
                        fontSize: '0.875rem',
                      }}
                    >
                      <option value="Delhi NCR">Delhi NCR (Same Day Dispatch)</option>
                      <option value="Bengaluru">Bengaluru (Same Day Dispatch)</option>
                      <option value="Mumbai">Mumbai &amp; MMR (Same Day Dispatch)</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Pune">Pune</option>
                      <option value="Other">Other Metro / Pan-India</option>
                    </select>
                  </div>

                  {/* Message / Patient Notes */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                      Patient Requirements / Special Notes
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Mention machine type, hospital discharge date, or prescription flow rate recommendations..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #dae2fd', fontSize: '0.875rem', fontFamily: 'inherit' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: 12,
                      background: '#16453A',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 4px 12px rgba(0,92,85,0.25)',
                    }}
                  >
                    <Send size={18} />
                    <span>Submit Clinical Request</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
