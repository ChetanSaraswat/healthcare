'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Search,
  Filter,
  Layers,
  ChevronRight,
  Stethoscope,
  Activity,
  Award,
  Zap,
} from 'lucide-react';

interface Hub {
  id: string;
  name: string;
  city: string;
  metro: string;
  address: string;
  pincode: string;
  phone: string;
  hours: string;
  isOpen: boolean;
  distance: string;
  hasDemos: boolean;
  hasAutoclaveLab: boolean;
  isPriorityDispatch: boolean;
  demoEquipment: string[];
  latPercent: number; // for SVG map pin placement
  lngPercent: number;
}

const HUBS_DATA: Hub[] = [
  {
    id: 'hub-del-1',
    name: 'South Delhi Flagship Experience Studio & Biomedical Hub',
    city: 'New Delhi',
    metro: 'Delhi NCR',
    address: 'B-14, Okhla Industrial Area Phase III, Near Modi Mill',
    pincode: '110020',
    phone: '+91 11 4982 3344',
    hours: 'Open 24/7 (Emergency Dispatch & Demo Appointments)',
    isOpen: true,
    distance: '3.2 km away',
    hasDemos: true,
    hasAutoclaveLab: true,
    isPriorityDispatch: true,
    demoEquipment: ['Whisper-quiet CPAP Sound Chamber', 'Motorized 5-Function ICU Bed', '10L Oxygen Purity Testing'],
    latPercent: 32,
    lngPercent: 46,
  },
  {
    id: 'hub-del-2',
    name: 'Gurugram Cyber City Care Center',
    city: 'Gurugram',
    metro: 'Delhi NCR',
    address: 'Ground Floor, Tower B, DLF Cyber City Phase II',
    pincode: '122002',
    phone: '+91 124 456 7890',
    hours: '8:00 AM – 10:00 PM (Daily)',
    isOpen: true,
    distance: '8.5 km away',
    hasDemos: true,
    hasAutoclaveLab: false,
    isPriorityDispatch: true,
    demoEquipment: ['Portable Oxygen Concentrator Trial', 'Active Air Ripple Mattress'],
    latPercent: 45,
    lngPercent: 38,
  },
  {
    id: 'hub-del-3',
    name: 'Noida Sector 62 Biomedical Dispatch Station',
    city: 'Noida',
    metro: 'Delhi NCR',
    address: 'C-22, Stellar IT Park, Sector 62',
    pincode: '201309',
    phone: '+91 120 678 1234',
    hours: '9:00 AM – 9:00 PM (Daily)',
    isOpen: true,
    distance: '12 km away',
    hasDemos: false,
    hasAutoclaveLab: true,
    isPriorityDispatch: true,
    demoEquipment: ['Autoclave Sterilization Facility', 'Reconditioned Rental Exchange Hub'],
    latPercent: 28,
    lngPercent: 62,
  },
  {
    id: 'hub-blr-1',
    name: 'Bengaluru Indiranagar Flagship Experience Studio',
    city: 'Bengaluru',
    metro: 'Bengaluru',
    address: '100ft Road, HAL 2nd Stage, Opposite Metro Pillar 42',
    pincode: '560038',
    phone: '+91 80 4321 8899',
    hours: 'Open 24/7 (Continuous Emergency Dispatch)',
    isOpen: true,
    distance: '2.4 km away',
    hasDemos: true,
    hasAutoclaveLab: true,
    isPriorityDispatch: true,
    demoEquipment: ['Motorized ICU Bed Trial', 'Philips Respironics BiPAP Fitting Lab', 'Ultralight Wheelchair Ergonomics'],
    latPercent: 68,
    lngPercent: 52,
  },
  {
    id: 'hub-blr-2',
    name: 'Koramangala 4th Block Clinical Hub',
    city: 'Bengaluru',
    metro: 'Bengaluru',
    address: '80ft Road, Sony World Junction, 4th Block Koramangala',
    pincode: '560034',
    phone: '+91 80 2553 4411',
    hours: '8:00 AM – 10:00 PM',
    isOpen: true,
    distance: '5.1 km away',
    hasDemos: true,
    hasAutoclaveLab: false,
    isPriorityDispatch: true,
    demoEquipment: ['Pediatric Oxygen & Nebulizer Fitting', 'Electric Mobility Scooters'],
    latPercent: 78,
    lngPercent: 56,
  },
  {
    id: 'hub-mum-1',
    name: 'Mumbai Andheri West Experience Studio',
    city: 'Mumbai',
    metro: 'Mumbai & MMR',
    address: 'Off New Link Road, Near Infiniti Mall, Andheri West',
    pincode: '400053',
    phone: '+91 22 6655 4433',
    hours: 'Open 24/7 (Emergency Hospital Bed & O2 Dispatch)',
    isOpen: true,
    distance: '4.6 km away',
    hasDemos: true,
    hasAutoclaveLab: true,
    isPriorityDispatch: true,
    demoEquipment: ['ICU Bed & Air Mattress Setup', 'Soundproof Sleep Therapy Chamber', 'Class 10 Autoclave Room'],
    latPercent: 54,
    lngPercent: 24,
  },
];

export default function HubsPage() {
  const [selectedMetro, setSelectedMetro] = useState<string>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeHubId, setActiveHubId] = useState<string>('hub-del-1');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [bookedHub, setBookedHub] = useState<Hub | null>(null);

  const filteredHubs = HUBS_DATA.filter((h) => {
    const matchesMetro = selectedMetro === 'all' || h.metro === selectedMetro;
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.pincode.includes(searchQuery);

    let matchesFilter = true;
    if (selectedFilter === 'demos') matchesFilter = h.hasDemos;
    if (selectedFilter === 'autoclave') matchesFilter = h.hasAutoclaveLab;
    if (selectedFilter === 'priority') matchesFilter = h.isPriorityDispatch;

    return matchesMetro && matchesSearch && matchesFilter;
  });

  const activeHub = HUBS_DATA.find((h) => h.id === activeHubId) || filteredHubs[0] || HUBS_DATA[0];

  const handleBookDemo = (hub: Hub) => {
    setBookedHub(hub);
    setModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#faf8ff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div>
        {/* Top Breadcrumb & Live Strip */}
        <section style={{ background: '#f2f3ff', borderBottom: '1px solid #dae2fd', padding: '10px 1.5rem' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', color: '#6e7977' }}>
              <Link href="/" style={{ color: '#005c55', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
              <span>/</span>
              <span>Caregiver Resources</span>
              <span>/</span>
              <strong style={{ color: '#131b2e' }}>Service Network &amp; Hub Locator</strong>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: '#e8f5f3',
                  color: '#005c55',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#005c55' }} />
                42 Authorized Care Hubs Active Across India
              </span>
              <span style={{ fontSize: '0.75rem', color: '#3e4947' }}>
                Average Emergency Response: <strong>14 Mins</strong>
              </span>
            </div>
          </div>
        </section>

        {/* Hero Banner */}
        <section style={{ padding: '2.5rem 1.5rem 1.5rem', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ maxWidth: 840, marginBottom: '2rem' }}>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 800,
                color: '#006398',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 8,
              }}
            >
              <Award size={16} /> Pan-India Clinical Logistics &amp; Experience Studios
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#131b2e', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
              Find an AarogyaMed Experience Center &amp; Biomedical Hub Near You
            </h1>
            <p style={{ fontSize: '1rem', color: '#3e4947', lineHeight: 1.6, margin: 0 }}>
              Walk in to inspect motorized hospital beds, evaluate whisper-quiet CPAP sound profiles in dedicated acoustic booths, test 10L oxygen purity, or instantly dispatch sanitized equipment with fast doorstep delivery across 40+ Indian metros.
            </p>
          </div>

          {/* Search & City Filter Bar */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '1.25rem 1.5rem',
              border: '1px solid #dae2fd',
              boxShadow: '0 4px 16px rgba(19, 27, 46, 0.05)',
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 280 }}>
                <Search size={18} color="#005c55" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Enter pincode (e.g., 110020, 560038) or area name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 10,
                    border: '1px solid #dae2fd',
                    background: '#f8f9ff',
                    fontSize: '0.9375rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ minWidth: 200 }}>
                <select
                  value={selectedMetro}
                  onChange={(e) => setSelectedMetro(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid #dae2fd',
                    background: '#ffffff',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: '#131b2e',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="all">All Metros (42 Hubs)</option>
                  <option value="Delhi NCR">Delhi NCR (4 Hubs)</option>
                  <option value="Bengaluru">Bengaluru (5 Hubs)</option>
                  <option value="Mumbai & MMR">Mumbai &amp; MMR (6 Hubs)</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingTop: 6, borderTop: '1px solid #f2f3ff' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6e7977', textTransform: 'uppercase', marginRight: 4 }}>
                Filter Facilities:
              </span>
              {[
                { id: 'all', label: 'All Authorized Hubs' },
                { id: 'demos', label: 'Live Experience Studios' },
                { id: 'autoclave', label: 'Class 10 Autoclave Labs' },
                { id: 'priority', label: 'Priority Emergency Dispatch' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setSelectedFilter(chip.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    border: selectedFilter === chip.id ? '1px solid #005c55' : '1px solid #dae2fd',
                    background: selectedFilter === chip.id ? '#005c55' : '#f8f9ff',
                    color: selectedFilter === chip.id ? '#ffffff' : '#3e4947',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Split View: Map (Left) + Hub Cards (Right) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            {/* Left Column: Stylized Interactive SVG Topography Map */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: 20,
                border: '1px solid #dae2fd',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(19, 27, 46, 0.04)',
                position: 'sticky',
                top: 150,
              }}
            >
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f2f3ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#131b2e', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Navigation size={16} color="#005c55" /> Interactive Hub Locator Map
                </span>
                <span style={{ fontSize: '0.75rem', color: '#005c55', fontWeight: 700 }}>
                  ● Click a pin to view studio details
                </span>
              </div>

              {/* Map Canvas with SVG Grid & Pins */}
              <div
                style={{
                  height: 380,
                  position: 'relative',
                  background: 'linear-gradient(135deg, #dae2fd 0%, #eaedff 50%, #f2f3ff 100%)',
                  overflow: 'hidden',
                }}
              >
                {/* SVG Topography & Roads Simulation */}
                <svg
                  style={{ width: '100%', height: '100%', opacity: 0.35 }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#005c55" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  {/* Road curves */}
                  <path d="M 10 80 Q 150 120 300 240 T 600 350" fill="none" stroke="#006398" strokeWidth="4" />
                  <path d="M 80 350 Q 220 200 450 180 T 800 60" fill="none" stroke="#005c55" strokeWidth="3" strokeDasharray="6,6" />
                </svg>

                {/* Hub Location Pins */}
                {filteredHubs.map((hub) => {
                  const isActive = hub.id === activeHub.id;
                  return (
                    <div
                      key={hub.id}
                      onClick={() => setActiveHubId(hub.id)}
                      style={{
                        position: 'absolute',
                        left: `${hub.lngPercent}%`,
                        top: `${hub.latPercent}%`,
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                        zIndex: isActive ? 20 : 10,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          width: isActive ? 44 : 32,
                          height: isActive ? 44 : 32,
                          borderRadius: '50%',
                          background: isActive ? '#005c55' : '#006398',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: isActive
                            ? '0 0 0 8px rgba(0, 92, 85, 0.25), 0 4px 12px rgba(0,0,0,0.3)'
                            : '0 2px 8px rgba(0,0,0,0.2)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <MapPin size={isActive ? 22 : 16} />
                      </div>

                      {isActive && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            marginBottom: 8,
                            padding: '6px 12px',
                            background: '#131b2e',
                            color: '#ffffff',
                            borderRadius: 8,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          }}
                        >
                          {hub.city} Hub
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Active Studio Quick Highlight Footer */}
              <div style={{ padding: '1.25rem', background: '#ffffff' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#005c55', textTransform: 'uppercase' }}>
                  Selected Studio Location
                </span>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#131b2e', margin: '4px 0 6px' }}>
                  {activeHub.name}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#6e7977', margin: '0 0 10px' }}>
                  {activeHub.address}, {activeHub.city} - {activeHub.pincode}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#006398', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Phone size={14} /> {activeHub.phone}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleBookDemo(activeHub)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 8,
                      background: '#005c55',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Book Free Trial
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Scrollable List of Detailed Hub Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#6e7977' }}>
                  Showing <strong>{filteredHubs.length} Experience Centers</strong>
                </span>
              </div>

              {filteredHubs.map((hub) => {
                const isSelected = hub.id === activeHub.id;
                return (
                  <div
                    key={hub.id}
                    onClick={() => setActiveHubId(hub.id)}
                    style={{
                      background: '#ffffff',
                      borderRadius: 16,
                      padding: '1.5rem',
                      border: isSelected ? '2px solid #005c55' : '1px solid #dae2fd',
                      boxShadow: isSelected
                        ? '0 6px 20px rgba(0, 92, 85, 0.08)'
                        : '0 2px 8px rgba(19, 27, 46, 0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 4,
                              background: '#eaedff',
                              color: '#006398',
                              textTransform: 'uppercase',
                            }}
                          >
                            {hub.metro}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#005c55', fontWeight: 700 }}>
                            {hub.distance}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
                          {hub.name}
                        </h3>
                      </div>

                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 999,
                          background: '#e8f5f3',
                          color: '#005c55',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Open Now
                      </span>
                    </div>

                    {/* Address & Hours */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8125rem', color: '#3e4947' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MapPin size={15} color="#6e7977" />
                        <span>{hub.address}, {hub.city} - {hub.pincode}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Clock size={15} color="#6e7977" />
                        <span>{hub.hours}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Phone size={15} color="#005c55" />
                        <span style={{ fontWeight: 700, color: '#005c55' }}>{hub.phone}</span>
                      </div>
                    </div>

                    {/* Available Demos Tag List */}
                    {hub.demoEquipment.length > 0 && (
                      <div style={{ paddingTop: 8, borderTop: '1px solid #f2f3ff' }}>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#6e7977', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                          Live Clinical Demos Available:
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {hub.demoEquipment.map((demo, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '0.75rem',
                                padding: '3px 8px',
                                borderRadius: 6,
                                background: '#f2f3ff',
                                color: '#131b2e',
                                fontWeight: 600,
                              }}
                            >
                              ✓ {demo}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 6 }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookDemo(hub);
                        }}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          borderRadius: 10,
                          background: '#005c55',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Book Free Clinical Trial
                      </button>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(hub.name + ' ' + hub.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 10,
                          background: '#f2f3ff',
                          color: '#006398',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Navigation size={14} />
                        <span>Directions</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Free Clinical Trial Booking Modal */}
        {modalOpen && bookedHub && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(19, 27, 46, 0.5)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: 20,
                maxWidth: 480,
                width: '100%',
                padding: '2rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#e8f5f3', color: '#005c55', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Stethoscope size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
                    Schedule Free Studio Trial
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#6e7977' }}>
                    {bookedHub.name}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', color: '#3e4947', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Walk in to test CPAP machines, oxygen concentrators, and electric hospital beds with our certified biomedical engineers before deciding to buy or rent.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Thank you! Your trial appointment at ${bookedHub.city} studio has been booked. Our clinical team will contact you via WhatsApp.`);
                  setModalOpen(false);
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 4 }}>
                    Patient / Caregiver Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Rajesh Sharma"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #dae2fd' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 4 }}>
                    Mobile Number (for WhatsApp Confirmation)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #dae2fd' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 4 }}>
                    Preferred Equipment for Demonstration
                  </label>
                  <select style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #dae2fd', background: '#ffffff' }}>
                    <option>Motorized 5-Function ICU Hospital Bed</option>
                    <option>ResMed AirSense 10 AutoSet CPAP</option>
                    <option>Philips EverFlo 10L Oxygen Concentrator</option>
                    <option>Ultralight Foldable Electric Wheelchair</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 10,
                      background: '#f2f3ff',
                      color: '#3e4947',
                      border: 'none',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 2,
                      padding: '12px',
                      borderRadius: 10,
                      background: '#005c55',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Confirm Free Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
