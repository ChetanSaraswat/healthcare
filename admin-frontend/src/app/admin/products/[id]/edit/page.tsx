'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  RefreshCw,
  UploadCloud,
  ImageIcon,
  X,
  AlertCircle,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { LanguageTabs } from '@/components/admin/LanguageTabs';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateProduct } from '@/features/products/products.slice';
import { listCategories } from '@/features/categories/list-categories/list-categories.action';
import { showToast } from '@/features/ui/ui.slice';
import { axiosInterceptorInstanceClient, extractApiErrorMessage } from '@/config/axios';
import { Product, mapRawProductToEntity, ProductSpecification } from '@/domain/entities/product.entity';
import { productFormSchema, ProductFormValues } from '@/features/products/product-form.schema';
import { getProductImageUrl } from '@/utils/image';

export default function EditProductAdminPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const productId = params?.id as string;

  const categories = useAppSelector((state) => state.categories.categories);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Active language tab in admin
  const [selectedLocale, setSelectedLocale] = useState<'en' | 'hi'>('en');

  // Images state
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Specifications
  const [specsEn, setSpecsEn] = useState<ProductSpecification[]>([]);
  const [specsHi, setSpecsHi] = useState<ProductSpecification[]>([]);

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      brand: '',
      categoryId: '',
      description: '',
      buyPrice: 0,
      buyMrp: 0,
      isAvailableForBuy: true,
      isAvailableForRent: true,
      rentalDailyRate: 0,
      rentalSecurityDeposit: 0,
      stock: 0,
      warrantyInfo: '',
      tagsInput: '',
      status: 'active',
      nameHi: '',
      descHi: '',
      warrantyHi: '',
    },
  });

  const nameHiValue = watch('nameHi');
  const descHiValue = watch('descHi');
  const hasHindiTranslation = Boolean(nameHiValue?.trim() && descHiValue?.trim());

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(listCategories());
    }
  }, [dispatch, categories.length]);

  // Load existing product
  useEffect(() => {
    if (!productId) return;

    let isMounted = true;
    async function fetchProduct() {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await axiosInterceptorInstanceClient.get(`/products/${productId}`);
        const raw = res.data?.data;
        if (!raw) throw new Error('Product details not returned by backend');

        const mapped: Product = mapRawProductToEntity(raw);

        if (!isMounted) return;

        // Populate images
        setImages(mapped.images?.length ? mapped.images : mapped.primaryImage ? [mapped.primaryImage] : []);

        // Populate specs
        setSpecsEn(mapped.specifications?.length ? mapped.specifications : [{ label: 'Standard', value: 'Clinical Grade' }]);
        if (mapped.translations?.hi?.specifications?.length) {
          setSpecsHi(mapped.translations.hi.specifications);
        } else {
          setSpecsHi([{ label: 'मानक', value: 'चिकित्सकीय ग्रेड' }]);
        }

        // Form reset
        reset({
          name: mapped.name || '',
          slug: mapped.slug || '',
          brand: mapped.brand || '',
          categoryId: mapped.categoryId || '',
          description: mapped.description || '',
          buyPrice: mapped.buyPrice || 0,
          buyMrp: mapped.mrp || Math.round((mapped.buyPrice || 0) * 1.15),
          isAvailableForBuy: mapped.isAvailableForBuy ?? true,
          isAvailableForRent: mapped.isAvailableForRent ?? true,
          rentalDailyRate: mapped.rentalDailyRate || 0,
          rentalSecurityDeposit: mapped.rentalSecurityDeposit || 0,
          stock: mapped.stock ?? 0,
          warrantyInfo: mapped.warrantyInfo || '',
          tagsInput: mapped.conditionTags?.join(', ') || '',
          status: 'active',
          nameHi: mapped.translations?.hi?.name || '',
          descHi: mapped.translations?.hi?.description || '',
          warrantyHi: mapped.translations?.hi?.warrantyInfo || '',
        });
      } catch (err: any) {
        if (!isMounted) return;
        const msg = extractApiErrorMessage(err, 'Failed to load product details');
        setLoadError(msg);
        dispatch(showToast({ type: 'error', message: msg }));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [productId, reset, dispatch]);

  // Image Upload Handlers
  const handleFiles = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const res = await axiosInterceptorInstanceClient.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrls: string[] =
        res.data?.data?.urls || (res.data?.data?.url ? [res.data.data.url] : []);
      if (uploadedUrls.length > 0) {
        setImages((prev) => [...prev, ...uploadedUrls]);
      }
    } catch (err: any) {
      console.warn('Backend upload fallback to FileReader DataURL:', err);
      const newPreviews: string[] = [];
      const readPromises = Array.from(files).map((file) => {
        return new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              newPreviews.push(e.target.result as string);
            }
            resolve();
          };
          reader.onerror = () => resolve();
          reader.readAsDataURL(file);
        });
      });

      await Promise.all(readPromises);
      if (newPreviews.length > 0) {
        setImages((prev) => [...prev, ...newPreviews]);
      } else {
        setUploadError(err?.response?.data?.message || err?.message || 'Failed to upload images');
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setImages((prev) => [...prev, trimmed]);
    setUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSetPrimaryImage = (indexToPrimary: number) => {
    setImages((prev) => {
      const target = prev[indexToPrimary];
      const rest = prev.filter((_, i) => i !== indexToPrimary);
      return [target, ...rest];
    });
  };

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

  // Form submit
  const onSubmit = async (values: ProductFormValues) => {
    setSubmitting(true);
    try {
      const selectedCat = categories.find((c) => c.id === values.categoryId || c.slug === values.categoryId);
      const parsedCatId = Number(values.categoryId) || (selectedCat?.id ? Number(selectedCat.id) : 1);
      const validCatId = !isNaN(parsedCatId) && parsedCatId > 0 ? parsedCatId : 1;

      const productImages = images.filter(Boolean);
      const primaryImage =
        productImages[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800';

      const tags = values.tagsInput
        ? values.tagsInput
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const translationsPayload: any[] = [];
      if (values.nameHi?.trim()) {
        translationsPayload.push({
          locale: 'hi',
          name: values.nameHi.trim(),
          description: values.descHi || '',
          warranty_info: values.warrantyHi || '',
          specifications: specsHi.filter((s) => s.label.trim() && s.value.trim()),
        });
      }

      const backendPayload = {
        name: values.name,
        slug: values.slug || values.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category_id: validCatId,
        brand: values.brand,
        description: values.description,
        images: productImages.length > 0 ? productImages : [primaryImage],
        specifications: specsEn.filter((s) => s.label.trim() && s.value.trim()),
        buy_price: Number(values.buyPrice),
        buy_mrp: Number(values.buyMrp) || Math.round(Number(values.buyPrice) * 1.15),
        buy_available: values.isAvailableForBuy,
        rent_price_daily: Number(values.rentalDailyRate),
        rent_price_weekly: Number(values.rentalDailyRate) * 6,
        rent_price_monthly: Number(values.rentalDailyRate) * 25,
        rent_deposit: Number(values.rentalSecurityDeposit),
        rent_min_period_days: 1,
        rent_available: values.isAvailableForRent,
        stock_quantity: Number(values.stock),
        warranty_info: values.warrantyInfo || '',
        status: values.status || 'active',
        translations: translationsPayload,
      };

      const response = await axiosInterceptorInstanceClient.put(`/products/${productId}`, backendPayload);
      const saved = response.data?.data;

      const updatedProd: Product = {
        id: String(saved?.id || productId),
        uuid: saved?.uuid,
        name: values.name,
        slug: backendPayload.slug,
        sku: backendPayload.slug.toUpperCase(),
        brand: values.brand,
        categoryId: String(validCatId),
        categoryName: selectedCat?.name || 'Medical Equipment',
        description: values.description,
        primaryImage: primaryImage,
        images: backendPayload.images,
        buyPrice: Number(values.buyPrice),
        mrp: backendPayload.buy_mrp,
        stock: Number(values.stock),
        isAvailableForBuy: values.isAvailableForBuy,
        isAvailableForRent: values.isAvailableForRent,
        rentalDailyRate: Number(values.rentalDailyRate),
        rentalMonthlyRate: Number(values.rentalDailyRate) * 25,
        rentalSecurityDeposit: Number(values.rentalSecurityDeposit),
        rentalMinDays: 1,
        specifications: backendPayload.specifications,
        warrantyInfo: values.warrantyInfo,
        conditionTags: tags,
        status: values.status,
      };

      dispatch(updateProduct(updatedProd));
      dispatch(showToast({ type: 'success', message: `Product "${values.name}" updated successfully!` }));
      router.push('/admin/products');
    } catch (err: any) {
      const msg = extractApiErrorMessage(err, 'Failed to update product');
      console.error('[EditProductAdminPage] Submit error:', err);
      dispatch(showToast({ type: 'error', message: msg }));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 1040, margin: '0 auto', paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
          <div style={{ width: 140, height: 24, borderRadius: 6, background: '#e2e8f0' }} />
        </div>
        <div style={{ width: 260, height: 32, borderRadius: 8, background: '#e2e8f0', marginBottom: 8 }} />
        <div style={{ width: 400, height: 18, borderRadius: 6, background: '#edf2f7', marginBottom: '2rem' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                background: '#ffffff',
                borderRadius: 16,
                padding: '2rem',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div style={{ width: 200, height: 24, borderRadius: 6, background: '#e2e8f0' }} />
              <div style={{ width: '100%', height: 44, borderRadius: 8, background: '#f1f5f9' }} />
              <div style={{ width: '80%', height: 44, borderRadius: 8, background: '#f1f5f9' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ maxWidth: 680, margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#fef2f2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <AlertCircle size={28} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#131b2e', margin: '0 0 8px' }}>
          Unable to Load Product
        </h2>
        <p style={{ color: '#6e7977', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>{loadError}</p>
        <Link
          href="/admin/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderRadius: 10,
            background: '#16453A',
            color: '#ffffff',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          <span>Return to Product Catalog</span>
        </Link>
      </div>
    );
  }

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
            color: '#B75932',
            textDecoration: 'none',
            marginBottom: '0.75rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
          Edit Product
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6e7977', margin: '4px 0 0' }}>
          Update medical equipment specifications, bilingual translations, stock, and pricing.
        </p>
      </div>

      {/* Language Switcher */}
      <LanguageTabs
        selectedLocale={selectedLocale}
        onSelectLocale={setSelectedLocale}
        hasHindiTranslation={hasHindiTranslation}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* SECTION 1: Product Identity */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
            <Package size={20} color="#16453A" />
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
              {selectedLocale === 'en' ? 'Product Identity & Classification' : 'उत्पाद पहचान और वर्गीकरण'}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 6 }}>
                {selectedLocale === 'en' ? 'Product Name (English) *' : 'उत्पाद का नाम (हिंदी)'}
              </label>
              {selectedLocale === 'en' ? (
                <>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="e.g. Philips EverFlo 5L Oxygen Concentrator"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: `1px solid ${errors.name ? '#ba1a1a' : '#dae2fd'}`,
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                  {errors.name && (
                    <span style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                      {errors.name.message}
                    </span>
                  )}
                </>
              ) : (
                <input
                  type="text"
                  {...register('nameHi')}
                  placeholder="उदा. फिलिप्स एवरफ्लो 5 लीटर ऑक्सीजन कंसंट्रेटर"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #dae2fd',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              )}
            </div>

            {/* Slug */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 6 }}>
                URL Slug
              </label>
              <input
                type="text"
                {...register('slug')}
                placeholder="philips-everflo-5l-oxygen-concentrator"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `1px solid ${errors.slug ? '#ba1a1a' : '#dae2fd'}`,
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              {errors.slug && (
                <span style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                  {errors.slug.message}
                </span>
              )}
            </div>

            {/* Brand */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 6 }}>
                Brand / Manufacturer *
              </label>
              <input
                type="text"
                {...register('brand')}
                placeholder="e.g. Philips Respironics, ResMed"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `1px solid ${errors.brand ? '#ba1a1a' : '#dae2fd'}`,
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              {errors.brand && (
                <span style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                  {errors.brand.message}
                </span>
              )}
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 6 }}>
                Category *
              </label>
              <select
                {...register('categoryId')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `1px solid ${errors.categoryId ? '#ba1a1a' : '#dae2fd'}`,
                  fontSize: '0.875rem',
                  outline: 'none',
                  background: '#ffffff',
                }}
              >
                <option value="">Select Category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <span style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                  {errors.categoryId.message}
                </span>
              )}
            </div>

            {/* Status */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 6 }}>
                Catalog Status
              </label>
              <select
                {...register('status')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #dae2fd',
                  fontSize: '0.875rem',
                  outline: 'none',
                  background: '#ffffff',
                }}
              >
                <option value="active">Active (Visible on Storefront)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: Product Images */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ImageIcon size={20} color="#16453A" />
              <h2 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
                Product Images
              </h2>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#6e7977' }}>
              First image is designated as primary cover photo
            </span>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed #16453A',
              borderRadius: 12,
              padding: '1.75rem 1rem',
              textAlign: 'center',
              background: '#f8fbfc',
              cursor: 'pointer',
              marginBottom: '1.25rem',
              transition: 'all 0.2s ease',
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*"
              style={{ display: 'none' }}
            />
            <UploadCloud size={32} color="#16453A" style={{ margin: '0 auto 8px' }} />
            <p style={{ margin: '0 0 4px', fontSize: '0.875rem', fontWeight: 700, color: '#131b2e' }}>
              {isUploading ? 'Uploading files to storage...' : 'Click or drag & drop images here to upload'}
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#6e7977' }}>
              Supports JPG, PNG, WEBP, SVG up to 10MB each
            </p>
          </div>

          {uploadError && (
            <div
              style={{
                padding: '8px 12px',
                background: '#fdf2f2',
                border: '1px solid #fecaca',
                borderRadius: 8,
                color: '#b91c1c',
                fontSize: '0.8125rem',
                marginBottom: '1rem',
              }}
            >
              {uploadError}
            </div>
          )}

          {/* Direct URL Add Option */}
          <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
            <input
              type="url"
              placeholder="Or paste external image URL (https://...)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddImageUrl();
                }
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #dae2fd',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                background: '#f2f3ff',
                color: '#B75932',
                border: '1px solid #dae2fd',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Add URL
            </button>
          </div>

          {/* Image Previews */}
          {images.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
              {images.map((img, idx) => (
                <div
                  key={`${img}-${idx}`}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: idx === 0 ? '2px solid #16453A' : '1px solid #dae2fd',
                    background: '#f8f9ff',
                  }}
                >
                  <Image
                    src={getProductImageUrl(img)}
                    alt={`Preview ${idx + 1}`}
                    fill
                    unoptimized
                    sizes="130px"
                    style={{ objectFit: 'cover' }}
                  />
                  {idx === 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 4,
                        left: 4,
                        background: '#16453A',
                        color: '#ffffff',
                        fontSize: '0.625rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      PRIMARY
                    </span>
                  )}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      right: 4,
                      display: 'flex',
                      gap: 4,
                    }}
                  >
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(idx)}
                        title="Set as Primary Cover"
                        style={{
                          background: 'rgba(0,0,0,0.65)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: 4,
                          padding: '3px 5px',
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      title="Remove image"
                      style={{
                        background: 'rgba(186, 26, 26, 0.85)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 4,
                        padding: '3px 5px',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#6e7977', fontSize: '0.8125rem' }}>
              No images added yet. Add at least one image for display on the storefront.
            </div>
          )}
        </div>

        {/* SECTION 3: Pricing, Stock & Terms */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
            <IndianRupee size={20} color="#16453A" />
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
              Pricing, Inventory &amp; Rental Terms
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {/* Buy Price */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 6 }}>
                Outright Buy Price (₹) *
              </label>
              <input
                type="number"
                {...register('buyPrice')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `1px solid ${errors.buyPrice ? '#ba1a1a' : '#dae2fd'}`,
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              {errors.buyPrice && (
                <span style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                  {errors.buyPrice.message}
                </span>
              )}
            </div>

            {/* MRP */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 6 }}>
                MRP Price (₹)
              </label>
              <input
                type="number"
                {...register('buyMrp')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `1px solid ${errors.buyMrp ? '#ba1a1a' : '#dae2fd'}`,
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              {errors.buyMrp && (
                <span style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                  {errors.buyMrp.message}
                </span>
              )}
            </div>

            {/* Daily Rental Rate */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 6 }}>
                Daily Rental Rate (₹/day) *
              </label>
              <input
                type="number"
                {...register('rentalDailyRate')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `1px solid ${errors.rentalDailyRate ? '#ba1a1a' : '#dae2fd'}`,
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              {errors.rentalDailyRate && (
                <span style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                  {errors.rentalDailyRate.message}
                </span>
              )}
            </div>

            {/* Security Deposit */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 6 }}>
                Refundable Security Deposit (₹) *
              </label>
              <input
                type="number"
                {...register('rentalSecurityDeposit')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `1px solid ${errors.rentalSecurityDeposit ? '#ba1a1a' : '#dae2fd'}`,
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              {errors.rentalSecurityDeposit && (
                <span style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                  {errors.rentalSecurityDeposit.message}
                </span>
              )}
            </div>

            {/* Stock Quantity */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 6 }}>
                Stock / Inventory Count *
              </label>
              <input
                type="number"
                {...register('stock')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `1px solid ${errors.stock ? '#ba1a1a' : '#dae2fd'}`,
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              {errors.stock && (
                <span style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                  {errors.stock.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 4: Description & Clinical Specifications */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dae2fd',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
            <Layers size={20} color="#16453A" />
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#131b2e', margin: 0 }}>
              {selectedLocale === 'en'
                ? 'Clinical Description & Technical Specifications'
                : 'चिकित्सकीय विवरण और तकनीकी विनिर्देश'}
            </h2>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 6 }}>
              {selectedLocale === 'en' ? 'Detailed Description (English) *' : 'विस्तृत विवरण (हिंदी)'}
            </label>
            {selectedLocale === 'en' ? (
              <>
                <textarea
                  rows={4}
                  {...register('description')}
                  placeholder="Provide comprehensive medical specifications, sterilization status, and clinical indications..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: `1px solid ${errors.description ? '#ba1a1a' : '#dae2fd'}`,
                    fontSize: '0.875rem',
                    outline: 'none',
                    lineHeight: 1.5,
                  }}
                />
                {errors.description && (
                  <span style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                    {errors.description.message}
                  </span>
                )}
              </>
            ) : (
              <textarea
                rows={4}
                {...register('descHi')}
                placeholder="विस्तृत चिकित्सा विनिर्देश, नसबंदी प्रोटोकॉल, और नैदानिक ​​उपयोग प्रदान करें..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #dae2fd',
                  fontSize: '0.875rem',
                  outline: 'none',
                  lineHeight: 1.5,
                }}
              />
            )}
          </div>

          {/* Warranty & Tags */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 6 }}>
                {selectedLocale === 'en' ? 'Warranty Information' : 'वारंटी की जानकारी (हिंदी)'}
              </label>
              {selectedLocale === 'en' ? (
                <input
                  type="text"
                  {...register('warrantyInfo')}
                  placeholder="e.g. 2 Years Manufacturer Warranty"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #dae2fd',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              ) : (
                <input
                  type="text"
                  {...register('warrantyHi')}
                  placeholder="उदा. 2 वर्ष की निर्माता वारंटी"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #dae2fd',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              )}
            </div>

            {selectedLocale === 'en' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947', marginBottom: 6 }}>
                  Condition &amp; Health Category Tags
                </label>
                <input
                  type="text"
                  {...register('tagsInput')}
                  placeholder="comma separated: respiratory, sleep-apnea, hospital-grade"
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
            )}
          </div>

          {/* Specifications Key-Value Builder */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#3e4947' }}>
                {selectedLocale === 'en' ? 'Technical Specifications (Key - Value Pairs)' : 'तकनीकी विनिर्देश (कुंजी - मूल्य)'}
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
                  color: '#16453A',
                  background: '#e8f5f3',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                <Plus size={14} /> Add Row
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(selectedLocale === 'en' ? specsEn : specsHi).map((spec, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Attribute (e.g. Oxygen Output)"
                    value={spec.label}
                    onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #dae2fd',
                      fontSize: '0.8125rem',
                      outline: 'none',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 5 Liters / min)"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                    style={{
                      flex: 2,
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #dae2fd',
                      fontSize: '0.8125rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    style={{
                      background: '#fff0ee',
                      color: '#ba1a1a',
                      border: 'none',
                      borderRadius: 6,
                      padding: 8,
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Link
            href="/admin/products"
            style={{
              padding: '11px 22px',
              borderRadius: 10,
              background: '#f2f3ff',
              color: '#3e4947',
              fontSize: '0.875rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 26px',
              borderRadius: 10,
              background: submitting ? '#6e7977' : '#16453A',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 700,
              border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px rgba(0,92,85,0.25)',
            }}
          >
            {submitting ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
