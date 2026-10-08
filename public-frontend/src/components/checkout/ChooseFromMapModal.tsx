'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Crosshair,
  Search,
  Check,
  X,
  AlertCircle,
  Navigation,
  Building,
} from 'lucide-react';

export interface SelectedLocationData {
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
}

interface ChooseFromMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (data: SelectedLocationData) => void;
}

const PRESET_HUBS = [
  { name: 'Bengaluru (Koramangala Hub)', lat: 12.9352, lng: 77.6245, city: 'Bengaluru', state: 'Karnataka', pincode: '560034', area: '80 Feet Road, 4th Block' },
  { name: 'Delhi NCR (South Ex Hub)', lat: 28.5684, lng: 77.2215, city: 'Delhi NCR', state: 'Delhi', pincode: '110049', area: 'Ring Road, South Extension Part II' },
  { name: 'Mumbai (Bandra West Hub)', lat: 19.0596, lng: 72.8295, city: 'Mumbai', state: 'Maharashtra', pincode: '400050', area: 'Hill Road, Near Lilavati Hospital' },
  { name: 'Hyderabad (Hitec City Hub)', lat: 17.4474, lng: 78.3762, city: 'Hyderabad', state: 'Telangana', pincode: '500081', area: 'Madhapur Main Road' },
  { name: 'Pune (Kalyani Nagar Hub)', lat: 18.5463, lng: 73.9033, city: 'Pune', state: 'Maharashtra', pincode: '411006', area: 'East Avenue Road' },
  { name: 'Chennai (Anna Nagar Hub)', lat: 13.0850, lng: 80.2101, city: 'Chennai', state: 'Tamil Nadu', pincode: '600040', area: '2nd Avenue, Roundtana' },
];

export const ChooseFromMapModal: React.FC<ChooseFromMapModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
}) => {
  const [selectedHub, setSelectedHub] = useState(PRESET_HUBS[0]);
  const [currentLat, setCurrentLat] = useState(PRESET_HUBS[0].lat);
  const [currentLng, setCurrentLng] = useState(PRESET_HUBS[0].lng);
  const [addressLine1, setAddressLine1] = useState(PRESET_HUBS[0].area);
  const [city, setCity] = useState(PRESET_HUBS[0].city);
  const [state, setState] = useState(PRESET_HUBS[0].state);
  const [pincode, setPincode] = useState(PRESET_HUBS[0].pincode);

  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUseCurrentLocation = () => {
    setLocating(true);
    setGeoError(null);

    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentLat(lat);
        setCurrentLng(lng);

        // Reverse geocoding via Nominatim OpenStreetMap
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        )
          .then((r) => r.json())
          .then((data) => {
            if (data && data.address) {
              const addr = data.address;
              const resolvedCity =
                addr.city || addr.town || addr.state_district || 'Metro Hub';
              const resolvedState = addr.state || 'State';
              const resolvedPin = addr.postcode || '110001';
              const resolvedLine1 =
                data.display_name?.split(',').slice(0, 3).join(', ') ||
                'Current GPS Location Pin';

              setCity(resolvedCity);
              setState(resolvedState);
              setPincode(resolvedPin);
              setAddressLine1(resolvedLine1);
            }
          })
          .catch(() => {
            setAddressLine1(`GPS Pin Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
          })
          .finally(() => {
            setLocating(false);
          });
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError(
            'Location access was denied. Please pick your city from the hub list or enter your address details.'
          );
        } else {
          setGeoError('Could not determine current location. Please select from the list below.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectPreset = (hub: (typeof PRESET_HUBS)[0]) => {
    setSelectedHub(hub);
    setCurrentLat(hub.lat);
    setCurrentLng(hub.lng);
    setAddressLine1(hub.area);
    setCity(hub.city);
    setState(hub.state);
    setPincode(hub.pincode);
    setGeoError(null);
  };

  const handleConfirm = () => {
    onSelectLocation({
      addressLine1,
      city,
      state,
      pincode,
      lat: currentLat,
      lng: currentLng,
    });
    onClose();
  };

  // OpenStreetMap embed URL for the selected coordinate pin
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${currentLng - 0.02}%2C${currentLat - 0.02}%2C${currentLng + 0.02}%2C${currentLat + 0.02}&layer=mapnik&marker=${currentLat}%2C${currentLng}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          maxWidth: 780,
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #dae2fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#faf8ff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#e8f5f3',
                color: '#005c55',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
                Choose Delivery Location on Map
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#6e7977', margin: 0 }}>
                Pinpoint your home or hospital recovery location for 4-hour biomedical technician dispatch.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6e7977' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Action Row: Locate GPS & Quick Presets */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              type="button"
              disabled={locating}
              onClick={handleUseCurrentLocation}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 16px',
                borderRadius: 10,
                background: '#005c55',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: locating ? 'not-allowed' : 'pointer',
                opacity: locating ? 0.7 : 1,
              }}
            >
              <Crosshair size={16} />
              <span>{locating ? 'Detecting GPS...' : 'Use Current GPS Location'}</span>
            </button>

            <span style={{ fontSize: '0.75rem', color: '#6e7977' }}>
              Coordinates: {currentLat.toFixed(4)}, {currentLng.toFixed(4)}
            </span>
          </div>

          {geoError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                borderRadius: 8,
                background: '#fff1f2',
                border: '1px solid #ffe4e6',
                color: '#e11d48',
                fontSize: '0.8125rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{geoError}</span>
            </div>
          )}

          {/* Interactive OpenStreetMap Embed */}
          <div
            style={{
              width: '100%',
              height: 280,
              borderRadius: 14,
              overflow: 'hidden',
              border: '1.5px solid #bdc9c6',
              position: 'relative',
              background: '#e2e8f0',
            }}
          >
            <iframe
              title="Delivery Location Pin"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={osmEmbedUrl}
              style={{ border: 'none' }}
            />
          </div>

          {/* Preset Medical Delivery Hubs */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6e7977', textTransform: 'uppercase', marginBottom: 8 }}>
              Or Quick Select Major Medical Dispatch Hub:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
              {PRESET_HUBS.map((hub) => {
                const isSelected = selectedHub.name === hub.name;
                return (
                  <button
                    key={hub.name}
                    type="button"
                    onClick={() => handleSelectPreset(hub)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: isSelected ? '2px solid #005c55' : '1px solid #dae2fd',
                      background: isSelected ? '#e8f5f3' : '#ffffff',
                      color: isSelected ? '#005c55' : '#131b2e',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: isSelected ? 700 : 500,
                    }}
                  >
                    <div>{hub.name}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#6e7977', marginTop: 2 }}>
                      PIN: {hub.pincode}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Address Preview Box */}
          <div
            style={{
              background: '#faf8ff',
              borderRadius: 12,
              border: '1px solid #dae2fd',
              padding: '12px 16px',
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              gap: 12,
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#6e7977' }}>
                Delivery Address Line
              </label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #bdc9c6', fontSize: '0.8125rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#6e7977' }}>
                City &amp; State
              </label>
              <input
                type="text"
                value={`${city}, ${state}`}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #bdc9c6', fontSize: '0.8125rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#6e7977' }}>
                PIN Code
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #bdc9c6', fontSize: '0.8125rem' }}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid #dae2fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 12,
            background: '#faf8ff',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: 'none',
              background: '#005c55',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Check size={16} />
            <span>Confirm Delivery Location</span>
          </button>
        </div>
      </div>
    </div>
  );
};
