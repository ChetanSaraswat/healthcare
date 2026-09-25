'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import {
  PhoneCall,
  MessageCircle,
  Clock,
  ShieldCheck,
  Send,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Truck,
  HeartHandshake,
} from 'lucide-react';

export default function ContactPage() {
  const [inquiryType, setInquiryType] = useState('emergency');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
                color: '#005c55',
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
              Whether you need rapid 4-hour emergency hospital bed dispatch, CPAP calibration assistance, or wish to schedule a physical demo trial at our experience centers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            {/* LEFT: Quick Contact Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Emergency Helpline Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #005c55 0%, #004b46 100%)',
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
                  Toll-free across all Indian networks. Direct priority line to clinical coordinators for ICU bed discharges and urgent respiratory support.
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
                    color: '#005c55',
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
                <a
                  href="https://wa.me/919876543210?text=Hello%20AarogyaMed%2C%20I%20need%20assistance%20with%20medical%20equipment"
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
              </div>

              {/* Experience Centers Card */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 20,
                  padding: '1.5rem',
                  border: '1px solid #dae2fd',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <MapPin size={20} color="#006398" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
                    Experience Studios Across 40+ Metros
                  </h3>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#6e7977', margin: '0 0 12px', lineHeight: 1.5 }}>
                  Visit our physical biomedical studios in Bengaluru, Delhi NCR, and Mumbai to evaluate equipment in person.
                </p>
                <Link
                  href="/hubs"
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: '#006398',
                    textDecoration: 'none',
                  }}
                >
                  Find Nearby Studio Location &rarr;
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
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e8f5f3', color: '#005c55', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: '0 0 8px' }}>
                    Inquiry Received
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#3e4947', lineHeight: 1.6, margin: '0 0 20px' }}>
                    A dedicated clinical care coordinator will call you at <strong>{phone}</strong> within 15 minutes.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      background: '#f2f3ff',
                      color: '#006398',
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
                      background: '#005c55',
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
