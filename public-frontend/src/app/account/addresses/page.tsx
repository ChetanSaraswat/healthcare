'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useTranslation } from '@/locales';
import { Address, AddressEntity } from '@/domain/entities/user.entity';
import { addAddress } from '@/features/user/add-address/add-address.action';
import { updateAddress } from '@/features/user/update-address/update-address.action';
import { deleteAddress } from '@/features/user/delete-address/delete-address.action';
import { setDefaultAddressLocally } from '@/features/user/user.slice';
import {
  MapPin,
  Plus,
  CheckCircle2,
  Trash2,
  Edit2,
  ShieldCheck,
  Building,
  Home,
  HeartPulse,
  X,
  AlertCircle,
} from 'lucide-react';

export default function AccountAddressesPage() {
  const { t, locale } = useTranslation();
  const dispatch = useAppDispatch();
  const { addresses, submitting } = useAppSelector((state) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [formData, setFormData] = useState({
    label: 'Home',
    line1: '',
    line2: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '',
    is_default: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setFormData({
      label: 'Home',
      line1: '',
      line2: '',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '',
      is_default: addresses.length === 0,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingAddress(addr);
    setFormData({
      label: addr.label,
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      is_default: addr.isDefault,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSetDefault = (id: string) => {
    dispatch(setDefaultAddressLocally(id));
    dispatch(
      updateAddress({
        id,
        data: { is_default: true },
      })
    );
  };

  const handleDelete = (id: string, label: string) => {
    if (confirm(locale === 'hi' ? `क्या आप "${label}" पता हटाना चाहते हैं?` : `Are you sure you want to delete "${label}" address?`)) {
      dispatch(deleteAddress({ id }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = AddressEntity.validateAddress({
      line1: formData.line1,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (editingAddress) {
      await dispatch(
        updateAddress({
          id: editingAddress.id,
          data: formData,
        })
      );
    } else {
      await dispatch(addAddress(formData));
    }

    setIsModalOpen(false);
  };

  const getLabelIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'home':
        return <Home size={16} />;
      case 'clinic':
      case 'hospital':
        return <Building size={16} />;
      default:
        return <HeartPulse size={16} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#131b2e', margin: '0 0 4px' }}>
            {locale === 'hi' ? 'सहेजे गए वितरण पते' : 'Saved Delivery Addresses'}
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#6e7977', margin: 0 }}>
            {locale === 'hi'
              ? 'अस्पताल-ग्रेड उपकरण वितरण एवं तकनीशियन स्थापना के लिए पंजीकृत पते।'
              : 'Registered locations for biomedical equipment dispatch and technician doorstep setup.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          style={{
            background: '#16453A',
            color: '#ffffff',
            border: 'none',
            padding: '9px 18px',
            borderRadius: 9999,
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 12px rgba(0, 92, 85, 0.2)',
          }}
        >
          <Plus size={16} />
          <span>{locale === 'hi' ? 'नया पता जोड़ें' : 'Add New Address'}</span>
        </button>
      </div>

      {/* Address Cards Grid */}
      {addresses.length === 0 ? (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
            padding: '3.5rem 2rem',
            textAlign: 'center',
          }}
        >
          <MapPin size={48} color="#bdc9c6" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#131b2e', marginBottom: 6 }}>
            {locale === 'hi' ? 'कोई पता पंजीकृत नहीं है' : 'No Delivery Addresses Saved'}
          </h3>
          <p style={{ color: '#6e7977', fontSize: '0.875rem', margin: '0 auto 1.5rem', maxWidth: 420 }}>
            {locale === 'hi'
              ? 'त्वरित चेकआउट और तकनीशियन स्थापना के लिए अपना घर या क्लिनिक पता जोड़ें।'
              : 'Save home or clinical recovery addresses for expedited 1-click checkout and doorstep delivery.'}
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            style={{
              background: '#16453A',
              color: '#ffffff',
              border: 'none',
              padding: '10px 22px',
              borderRadius: 9999,
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {locale === 'hi' ? 'पहला पता जोड़ें' : 'Add Your First Address'}
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 20,
          }}
        >
          {addresses.map((addr: Address) => (
            <div
              key={addr.id}
              style={{
                background: '#ffffff',
                borderRadius: 16,
                border: addr.isDefault ? '2px solid #16453A' : '1px solid #dae2fd',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: addr.isDefault
                  ? '0 4px 16px rgba(0, 92, 85, 0.08)'
                  : '0 2px 8px rgba(19, 27, 46, 0.03)',
                position: 'relative',
              }}
            >
              <div>
                {/* Header line: Label + Default badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.875rem', color: '#131b2e' }}>
                    <span style={{ color: '#16453A' }}>{getLabelIcon(addr.label)}</span>
                    <span>{addr.label}</span>
                  </div>

                  {addr.isDefault && (
                    <span
                      style={{
                        background: '#eaf8f6',
                        color: '#16453A',
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: 9999,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <CheckCircle2 size={12} />
                      <span>{locale === 'hi' ? 'प्राथमिक पता' : 'Default Delivery'}</span>
                    </span>
                  )}
                </div>

                {/* Address text */}
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#131b2e', lineHeight: 1.4, marginBottom: 4 }}>
                  {addr.line1}
                </div>
                {addr.line2 && (
                  <div style={{ fontSize: '0.8125rem', color: '#6e7977', marginBottom: 6 }}>
                    {addr.line2}
                  </div>
                )}
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#3e4947' }}>
                  {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                </div>
              </div>

              {/* Action buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #eaedff',
                }}
              >
                <div>
                  {!addr.isDefault ? (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(addr.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#16453A',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {locale === 'hi' ? 'प्राथमिक बनाएं' : 'Set as Default'}
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#6e7977' }}>
                      {locale === 'hi' ? 'प्राथमिक गंतव्य' : 'Primary Destination'}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(addr)}
                    style={{
                      background: '#faf8ff',
                      color: '#16453A',
                      border: '1px solid #dae2fd',
                      padding: '5px 10px',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Edit2 size={12} />
                    <span>{locale === 'hi' ? 'संपादित करें' : 'Edit'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id, addr.label)}
                    style={{
                      background: '#fff5f5',
                      color: '#b91c1c',
                      border: '1px solid #fed7d7',
                      padding: '5px 10px',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Trash2 size={12} />
                    <span>{locale === 'hi' ? 'हटाएं' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Address Modal Dialog */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(19, 27, 46, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              maxWidth: 540,
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
                {editingAddress
                  ? (locale === 'hi' ? 'वितरण पता संपादित करें' : 'Edit Delivery Address')
                  : (locale === 'hi' ? 'नया वितरण पता जोड़ें' : 'Add New Delivery Address')}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6e7977',
                  padding: 4,
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Preset Label selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 6 }}>
                  {locale === 'hi' ? 'पते का प्रकार' : 'Address Label'}
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Home', 'Clinic', 'Elderly Care', 'Other'].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setFormData({ ...formData, label: lbl })}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 8,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: formData.label === lbl ? '2px solid #16453A' : '1px solid #dae2fd',
                        background: formData.label === lbl ? '#eaf8f6' : '#ffffff',
                        color: formData.label === lbl ? '#16453A' : '#3e4947',
                      }}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line 1 */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                  {locale === 'hi' ? 'पता पंक्ति 1 (भवन, फ्लैट, सड़क) *' : 'Address Line 1 (House, Flat, Street) *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B-402, Green Glen Layout, Outer Ring Road"
                  value={formData.line1}
                  onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: errors.line1 ? '1px solid #ef4444' : '1px solid #bdc9c6',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
                {errors.line1 && (
                  <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 3, display: 'block' }}>
                    {errors.line1}
                  </span>
                )}
              </div>

              {/* Line 2 */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                  {locale === 'hi' ? 'पता पंक्ति 2 (लैंडमार्क, मंजिल, लिफ्ट सूचना)' : 'Address Line 2 (Landmark, Floor, Lift Info)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Opposite Cloudnine Hospital, 4th Floor (Lift available)"
                  value={formData.line2}
                  onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #bdc9c6',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* City, State, Pincode */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                    {locale === 'hi' ? 'शहर *' : 'City *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: errors.city ? '1px solid #ef4444' : '1px solid #bdc9c6',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                  {errors.city && (
                    <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 3, display: 'block' }}>
                      {errors.city}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                    {locale === 'hi' ? 'राज्य *' : 'State *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: errors.state ? '1px solid #ef4444' : '1px solid #bdc9c6',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                  {errors.state && (
                    <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 3, display: 'block' }}>
                      {errors.state}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 4 }}>
                    {locale === 'hi' ? 'पिनकोड *' : 'Pincode *'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="560103"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: errors.pincode ? '1px solid #ef4444' : '1px solid #bdc9c6',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                  {errors.pincode && (
                    <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 3, display: 'block' }}>
                      {errors.pincode}
                    </span>
                  )}
                </div>
              </div>

              {/* Is Default Checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 4 }}>
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                />
                <span style={{ fontSize: '0.8125rem', color: '#3e4947', fontWeight: 600 }}>
                  {locale === 'hi'
                    ? 'इसे सभी उपकरण आदेशों के लिए प्राथमिक वितरण पता बनाएं'
                    : 'Set as primary delivery address for medical equipment'}
                </span>
              </label>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: '#f8fafc',
                    color: '#6e7977',
                    border: '1px solid #dae2fd',
                    padding: '10px 18px',
                    borderRadius: 8,
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {locale === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: '#16453A',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 22px',
                    borderRadius: 8,
                    fontSize: '0.875rem',
                    fontWeight: 800,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting
                    ? (locale === 'hi' ? 'सहेजा जा रहा है...' : 'Saving...')
                    : editingAddress
                    ? (locale === 'hi' ? 'बदलाव सहेजें' : 'Save Changes')
                    : (locale === 'hi' ? 'पता सहेजें' : 'Save Address')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
