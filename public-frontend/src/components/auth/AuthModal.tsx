'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/features/auth/login/login.action';
import { registerUser } from '@/features/auth/register/register.action';
import { clearAuthError } from '@/features/auth/auth.slice';
import { useTranslation } from '@/locales';
import styles from './AuthModal.module.scss';
import {
  X,
  ShieldCheck,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, 'Please enter a valid email address or phone number'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .refine((val) => !val || /^[6-9]\d{9}$/.test(val), {
      message: 'Mobile number must be a valid 10-digit number (e.g. 9876543210)',
    })
    .optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  redirectUrl?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  redirectUrl,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { locale } = useTranslation();
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);

  // Sign In Form via React Hook Form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
    setValue: setLoginValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  // Register Form via React Hook Form
  const {
    register: registerSignUp,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetSignUp,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (isOpen) {
      dispatch(clearAuthError());
      resetLogin();
      resetSignUp();
    }
  }, [isOpen, activeTab, dispatch, resetLogin, resetSignUp]);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    }
  }, [isAuthenticated, isOpen, onClose, redirectUrl, router]);

  if (!isOpen) return null;

  const onLogin = async (data: LoginFormData) => {
    const result = await dispatch(
      loginUser({
        email: data.identifier.trim(),
        password: data.password,
      })
    );

    if (loginUser.fulfilled.match(result)) {
      onClose();
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    const result = await dispatch(
      registerUser({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || undefined,
        password: data.password,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      onClose();
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    }
  };

  const handleQuickFill = (email: string, pass: string) => {
    setActiveTab('login');
    setLoginValue('identifier', email, { shouldValidate: true });
    setLoginValue('password', pass, { shouldValidate: true });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Close Button firmly pinned to the card top-right */}
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.badgePill}>
            <ShieldCheck size={14} />
            {locale === 'hi' ? 'सुरक्षित बायोमेडिकल रोगी पोर्टल' : 'Clinical & Patient Verified Portal'}
          </div>
          <h2 className={styles.modalTitle}>
            {activeTab === 'login'
              ? (locale === 'hi' ? 'ओमकार हेल्थकेयर में प्रवेश करें' : 'Welcome to Omkar Healthcare')
              : (locale === 'hi' ? 'नया रोगी खाता बनाएं' : 'Create Patient Account')}
          </h2>
          <p className={styles.modalSubtitle}>
            {activeTab === 'login'
              ? (locale === 'hi' ? 'सक्रिय रेंटल, खरीद आदेश और पते प्रबंधित करें' : 'Manage active equipment rentals, orders, and clinical delivery.')
              : (locale === 'hi' ? 'अस्पताल-स्तरीय चिकित्सा उपकरण रेंटल एवं खरीद हेतु' : 'Pan-India access to medical equipment buy & rental care.')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className={styles.tabBar}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'login' ? styles.active : ''}`}
            onClick={() => setActiveTab('login')}
          >
            {locale === 'hi' ? 'लॉग इन' : 'Sign In'}
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'register' ? styles.active : ''}`}
            onClick={() => setActiveTab('register')}
          >
            {locale === 'hi' ? 'नया खाता' : 'Create Account'}
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {/* Error Banner */}
          {error && (
            <div className={styles.errorBanner}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit(onLogin)} noValidate>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {locale === 'hi' ? 'ईमेल या मोबाइल नंबर' : 'Email Address or Mobile'} <span style={{ color: '#ba1a1a' }}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <Mail size={16} className={styles.inputIcon} />
                  <input
                    type="text"
                    className={styles.textInput}
                    placeholder="patient@example.com or 9876543210"
                    {...registerLogin('identifier')}
                    style={loginErrors.identifier ? { borderColor: '#ba1a1a' } : undefined}
                  />
                </div>
                {loginErrors.identifier && (
                  <span style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                    {loginErrors.identifier.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className={styles.label}>
                    {locale === 'hi' ? 'पासवर्ड' : 'Password'} <span style={{ color: '#ba1a1a' }}>*</span>
                  </label>
                </div>
                <div className={styles.inputWrapper}>
                  <Lock size={16} className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={styles.textInput}
                    placeholder="••••••••"
                    {...registerLogin('password')}
                    style={loginErrors.password ? { borderColor: '#ba1a1a' } : undefined}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {loginErrors.password && (
                  <span style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                    {loginErrors.password.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading
                  ? (locale === 'hi' ? 'प्रमाणीकरण हो रहा है...' : 'Verifying Session...')
                  : (locale === 'hi' ? 'लॉग इन करें' : 'Sign In to Account')}
                <ArrowRight size={16} />
              </button>

              {/* Demo Login Quick Fill */}
              <div className={styles.demoBox}>
                <div className={styles.demoTitle}>
                  <Sparkles size={13} color="#16453A" />
                  <span>{locale === 'hi' ? 'त्वरित परीक्षण (डेमो खाते):' : 'Quick Demo Test Accounts:'}</span>
                </div>
                <div className={styles.demoButtons}>
                  <button
                    type="button"
                    className={styles.demoBtn}
                    onClick={() => handleQuickFill('ramesh.verma@example.com', 'Admin@12345')}
                  >
                    {locale === 'hi' ? 'रोगी डेमो (रमेश)' : 'Patient Demo'}
                  </button>
                  <button
                    type="button"
                    className={styles.demoBtn}
                    onClick={() => handleQuickFill('admin@omkarhealthcare.com', 'Admin@12345')}
                  >
                    {locale === 'hi' ? 'एडमिन डेमो' : 'Admin Demo'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit(onRegister)} noValidate>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {locale === 'hi' ? 'पूरा नाम' : 'Full Name'} <span style={{ color: '#ba1a1a' }}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <User size={16} className={styles.inputIcon} />
                  <input
                    type="text"
                    className={styles.textInput}
                    placeholder="e.g. Ramesh Patel"
                    {...registerSignUp('name')}
                    style={registerErrors.name ? { borderColor: '#ba1a1a' } : undefined}
                  />
                </div>
                {registerErrors.name && (
                  <span style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                    {registerErrors.name.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {locale === 'hi' ? 'ईमेल पता' : 'Email Address'} <span style={{ color: '#ba1a1a' }}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <Mail size={16} className={styles.inputIcon} />
                  <input
                    type="email"
                    className={styles.textInput}
                    placeholder="patient@example.com"
                    {...registerSignUp('email')}
                    style={registerErrors.email ? { borderColor: '#ba1a1a' } : undefined}
                  />
                </div>
                {registerErrors.email && (
                  <span style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                    {registerErrors.email.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {locale === 'hi' ? 'मोबाइल नंबर (वैकल्पिक)' : 'Mobile Number (for delivery updates)'}
                </label>
                <div className={styles.inputWrapper}>
                  <Phone size={16} className={styles.inputIcon} />
                  <input
                    type="tel"
                    className={styles.textInput}
                    placeholder="9876543210"
                    {...registerSignUp('phone')}
                    style={registerErrors.phone ? { borderColor: '#ba1a1a' } : undefined}
                  />
                </div>
                {registerErrors.phone && (
                  <span style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                    {registerErrors.phone.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {locale === 'hi' ? 'पासवर्ड (कम से कम 6 अक्षर)' : 'Create Password (min. 6 characters)'} <span style={{ color: '#ba1a1a' }}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <Lock size={16} className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={styles.textInput}
                    placeholder="••••••••"
                    {...registerSignUp('password')}
                    style={registerErrors.password ? { borderColor: '#ba1a1a' } : undefined}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {registerErrors.password && (
                  <span style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                    {registerErrors.password.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading
                  ? (locale === 'hi' ? 'खाता बनाया जा रहा है...' : 'Creating Account...')
                  : (locale === 'hi' ? 'खाता बनाएं' : 'Create Patient Account')}
                <CheckCircle2 size={16} />
              </button>
            </form>
          )}

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link
              href="/login"
              onClick={onClose}
              style={{
                fontSize: '0.75rem',
                color: '#16453A',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>{locale === 'hi' ? 'पूर्ण स्क्रीन साइन इन पोर्टल खोलें →' : 'Open dedicated sign in portal →'}</span>
            </Link>
          </div>

          <div className={styles.termsText}>
            {locale === 'hi'
              ? 'साइन इन करके आप ओमकार हेल्थकेयर के रेंटल एवं वारंटी नियमों से सहमत होते हैं।'
              : 'By continuing, you agree to Omkar Biomedical Terms of Rental & CDSCO Privacy Policy.'}
          </div>
        </div>
      </div>
    </div>
  );
};
