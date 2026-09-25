'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Package,
  Layers,
  IndianRupee,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { LanguageTabs } from '@/components/admin/LanguageTabs';
import { useAppDispatch } from '@/store/hooks';
import { addProduct } from '@/features/products/products.slice';
import { Product } from '@/domain/entities/product.entity';

export default function NewProductAdminPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Active language tab in admin
  const [selectedLocale, setSelectedLocale] = useState<'en' | 'hi'>('en');

  // Base product fields (Language-agnostic)
  const [brand, setBrand] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('cat-respiratory');
  const [buyPrice, setBuyPrice] = useState<number>(45000);
  const [rentDailyRate, setRentDailyRate] = useState<number>(350);
  const [securityDeposit, setSecurityDeposit] = useState<number>(10000);
  const [stock, setStock] = useState<number>(15);
  const [tagsInput, setTagsInput] = useState('respiratory, sleep-apnea, hospital-grade');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800'
  );

  // English content
  const [nameEn, setNameEn] = useState('');
  const [descEn, setDescEn] = useState('');
  const [warrantyEn, setWarrantyEn] = useState('2 Years Comprehensive Manufacturer Warranty + AarogyaMed Replacement Guarantee');
  const [specsEn, setSpecsEn] = useState<{ label: string; value: string }[]>([
    { label: 'Sound Level', value: '26.6 dBA (Whisper Quiet)' },
    { label: 'Operating Pressure', value: '4 to 20 cm H2O' },
    { label: 'Weight', value: '1.24 kg' },
  ]);

  // Hindi content
  const [nameHi, setNameHi] = useState('');
  const [descHi, setDescHi] = useState('');
  const [warrantyHi, setWarrantyHi] = useState('2 वर्ष की संपूर्ण निर्माता वारंटी + आरोग्यमेड प्रतिस्थापन गारंटी');
  const [specsHi, setSpecsHi] = useState<{ label: string; value: string }[]>([
    { label: 'ध्वनि स्तर', value: '26.6 dBA (शांत संचालन)' },
    { label: 'दबाव सीमा', value: '4 से 20 cm H2O' },
    { label: 'वजन', value: '1.24 किग्रा' },
  ]);

  const hasHindiTranslation = Boolean(nameHi.trim() && descHi.trim());

  // Spec row helpers
  const handleAddSpec = () => {
    if (selectedLocale === 'en') {
      setSpecsEn([...specsEn, { label: '', value: '' }]);
    } else {
      setSpecsHi([...specsHi, { label: '', value: '' }]);
    }
  };

  const handleRemoveSpec = (index: number) => {
    if (selectedLocale === 'en') {
      setSpecsEn(specsEn.filter((_, i) => i !== index));
    } else {
      setSpecsHi(specsHi.filter((_, i) => i !== index));
    }
  };

  const handleSpecChange = (index: number, field: 'label' | 'value', value: string) => {
    if (selectedLocale === 'en') {
      const updated = [...specsEn];
      updated[index][field] = value;
      setSpecsEn(updated);
    } else {
      const updated = [...specsHi];
      updated[index][field] = value;
      setSpecsHi(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim()) {
      alert('Please enter a product name in English.');
      return;
    }

    const generatedSlug =
      slug.trim() ||
      nameEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: nameEn,
      slug: generatedSlug,
      sku: generatedSlug.toUpperCase(),
      brand: brand || 'AarogyaMed Clinical',
      categoryId,
      description: descEn,
      primaryImage: imageUrl,
      images: [imageUrl],
      buyPrice: Number(buyPrice),
      mrp: Math.round(Number(buyPrice) * 1.15),
      stock: Number(stock),
      isAvailableForBuy: true,
      isAvailableForRent: true,
      rentalDailyRate: Number(rentDailyRate),
      rentalMonthlyRate: Number(rentDailyRate) * 25,
      rentalSecurityDeposit: Number(securityDeposit),
      rentalMinDays: 7,
      specifications: specsEn,
      warrantyInfo: warrantyEn,
      conditionTags: tags,
      rating: 5.0,
      reviewsCount: 1,
      translations: {
        en: {
          locale: 'en',
          name: nameEn,
          description: descEn,
          specifications: specsEn,
          warrantyInfo: warrantyEn,
        },
        ...(hasHindiTranslation
          ? {
              hi: {
                locale: 'hi',
                name: nameHi,
                description: descHi,
                specifications: specsHi,
                warrantyInfo: warrantyHi,
              },
            }
          : {}),
      },
    };

    dispatch(addProduct(newProd));
    alert('Equipment successfully added to the AarogyaMed medical catalog!');
    router.push('/admin/products');
  };

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Back Button & Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/admin/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: '#006398',
            textDecoration: 'none',
            marginBottom: '0.75rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
          Add Medical Equipment
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6e7977', margin: '4px 0 0' }}>
          Create hospital-grade equipment with bilingual Hindi/English specifications and buy/rent terms.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Top Language Tabs Component */}
        <LanguageTabs
          selectedLocale={selectedLocale}
          onSelectLocale={setSelectedLocale}
          hasHindiTranslation={hasHindiTranslation}
          onAutoTranslate={() => {
            if (!nameHi) setNameHi(`आरोग्यमेड ${nameEn}`);
            if (!descHi) setDescHi(`क्लिनिकल ग्रेड चिकित्सा उपकरण - ${descEn}`);
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem' }}>
          {/* LEFT: Localized Content Section */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '1.5rem',
              border: '1px solid #dae2fd',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div style={{ borderBottom: '1px solid #f2f3ff', paddingBottom: 10 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#005c55', letterSpacing: '0.06em' }}>
                {selectedLocale === 'en' ? 'English (Primary)' : 'हिन्दी (Hindi Translation)'}
              </span>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#131b2e', margin: '4px 0 0' }}>
                {selectedLocale === 'en' ? 'Clinical Descriptions & Specifications' : 'विवरण एवं तकनीकी विशिष्टता'}
              </h2>
            </div>

            {/* Product Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                {selectedLocale === 'en' ? 'Product Title *' : 'उपकरण का नाम (हिन्दी)'}
              </label>
              <input
                type="text"
                required={selectedLocale === 'en'}
                placeholder={selectedLocale === 'en' ? 'e.g., ResMed AirSense 10 AutoSet CPAP' : 'उदा., रेसमेड एयरसेंस 10 ऑटोसेट सीपैक'}
                value={selectedLocale === 'en' ? nameEn : nameHi}
                onChange={(e) =>
                  selectedLocale === 'en' ? setNameEn(e.target.value) : setNameHi(e.target.value)
                }
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #dae2fd',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Clinical Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                {selectedLocale === 'en' ? 'Clinical Description *' : 'क्लिनिकल विवरण (हिन्दी)'}
              </label>
              <textarea
                rows={4}
                required={selectedLocale === 'en'}
                placeholder={
                  selectedLocale === 'en'
                    ? 'Enter clinical summary, hospital certifications, and patient benefits...'
                    : 'चिकित्सकीय विवरण, अस्पताल प्रमाणन एवं मरीज के लाभ दर्ज करें...'
                }
                value={selectedLocale === 'en' ? descEn : descHi}
                onChange={(e) =>
                  selectedLocale === 'en' ? setDescEn(e.target.value) : setDescHi(e.target.value)
                }
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #dae2fd',
                  fontSize: '0.875rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Dynamic Specifications Builder */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e' }}>
                  {selectedLocale === 'en' ? 'Technical Specifications (JSONB)' : 'तकनीकी विशिष्टता (JSONB)'}
                </label>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#005c55',
                    background: '#e8f5f3',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} />
                  <span>Add Spec Row</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(selectedLocale === 'en' ? specsEn : specsHi).map((spec, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Parameter (e.g. Sound Level)"
                      value={spec.label}
                      onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: '1px solid #dae2fd',
                        fontSize: '0.8125rem',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. 26.6 dBA)"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: '1px solid #dae2fd',
                        fontSize: '0.8125rem',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      style={{
                        padding: 6,
                        border: 'none',
                        background: '#fff0ee',
                        color: '#ba1a1a',
                        borderRadius: 6,
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Warranty Info */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                {selectedLocale === 'en' ? 'Warranty / Guarantee Info' : 'वारंटी / गारंटी विवरण'}
              </label>
              <input
                type="text"
                value={selectedLocale === 'en' ? warrantyEn : warrantyHi}
                onChange={(e) =>
                  selectedLocale === 'en' ? setWarrantyEn(e.target.value) : setWarrantyHi(e.target.value)
                }
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #dae2fd',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* RIGHT: Base Settings (Price, Rent, Stock, Category) */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '1.5rem',
              border: '1px solid #dae2fd',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div style={{ borderBottom: '1px solid #f2f3ff', paddingBottom: 10 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#006398', letterSpacing: '0.06em' }}>
                Inventory &amp; Commerce Rules
              </span>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#131b2e', margin: '4px 0 0' }}>
                Buy &amp; Rent Equal Footing
              </h2>
            </div>

            {/* Brand & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                  Brand Name * (Untranslated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., ResMed, Philips"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #dae2fd',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #dae2fd',
                    fontSize: '0.875rem',
                    background: '#ffffff',
                  }}
                >
                  <option value="cat-respiratory">Respiratory Care</option>
                  <option value="cat-mobility">Mobility Aids</option>
                  <option value="cat-homecare">Home Care &amp; ICU Beds</option>
                </select>
              </div>
            </div>

            {/* Buy Price & Rent Daily Rate */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#005c55', marginBottom: 6 }}>
                  Buy Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #dae2fd',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#006398', marginBottom: 6 }}>
                  Daily Rent Rate (₹/day) *
                </label>
                <input
                  type="number"
                  required
                  min={10}
                  value={rentDailyRate}
                  onChange={(e) => setRentDailyRate(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #dae2fd',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                  }}
                />
              </div>
            </div>

            {/* Security Deposit & Stock */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#913200', marginBottom: 6 }}>
                  Refundable Deposit (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #dae2fd',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                  Stock Quantity (Units) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #dae2fd',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            {/* Tags (for Condition Linking) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                Tags for Condition Linking (Comma separated)
              </label>
              <input
                type="text"
                placeholder="sleep-apnea, respiratory, cpap"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #dae2fd',
                  fontSize: '0.875rem',
                }}
              />
              <span style={{ fontSize: '0.6875rem', color: '#6e7977', display: 'block', marginTop: 4 }}>
                Matches tags on `/learn/[slug]` condition pages for tag-based linking.
              </span>
            </div>

            {/* Image URL */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>
                Product Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #dae2fd',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            {/* Submit Action */}
            <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #f2f3ff' }}>
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #005c55 0%, #004b46 100%)',
                  color: '#ffffff',
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(0,92,85,0.3)',
                }}
              >
                <Save size={18} />
                <span>Save Equipment to Catalog</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
