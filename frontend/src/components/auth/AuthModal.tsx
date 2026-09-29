'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/features/auth/login/login.action';
import { registerUser } from '@/features/auth/register/register.action';
import { clearAuthError, setDemoCustomer, setDemoAdmin } from '@/features/auth/auth.slice';
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
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

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

  // Sign In Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [localValidationErr, setLocalValidationErr] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (isOpen) {
      dispatch(clearAuthError());
      setLocalValidationErr(null);
    }
  }, [isOpen, activeTab, dispatch]);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    }
  }, [isAuthenticated, isOpen, onClose, redirectUrl, router]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalValidationErr(null);

    if (!loginIdentifier.trim()) {
      setLocalValidationErr(locale === 'hi' ? 'कृपया ईमेल या मोबाइल नंबर दर्ज करें' : 'Please enter your email or phone number.');
      return;
    }
    if (!loginPassword) {
      setLocalValidationErr(locale === 'hi' ? 'कृपया पासवर्ड दर्ज करें' : 'Please enter your password.');
      return;
    }

    const result = await dispatch(
      loginUser({
        email: loginIdentifier.trim(),
        password: loginPassword,
      })
    );

    if (loginUser.fulfilled.match(result)) {
      onClose();
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalValidationErr(null);

    if (!registerName.trim()) {
      setLocalValidationErr(locale === 'hi' ? 'कृपया पूरा नाम दर्ज करें' : 'Full name is required.');
      return;
    }
    if (!registerEmail.trim() || !registerEmail.includes('@')) {
      setLocalValidationErr(locale === 'hi' ? 'कृपया मान्य ईमेल दर्ज करें' : 'Please enter a valid email address.');
      return;
    }
    if (registerPassword.length < 6) {
      setLocalValidationErr(locale === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए' : 'Password must be at least 6 characters.');
      return;
    }

    const result = await dispatch(
      registerUser({
        name: registerName.trim(),
        email: registerEmail.trim(),
        phone: registerPhone.trim() || undefined,
        password: registerPassword,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      onClose();
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    }
  };

  const handleQuickDemoCustomer = () => {
    dispatch(setDemoCustomer());
    onClose();
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  const handleQuickDemoAdmin = () => {
    dispatch(setDemoAdmin());
    onClose();
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
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
              ? (locale === 'hi' ? 'आरोग्यमेड में प्रवेश करें' : 'Welcome to AarogyaMed')
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
          {(localValidationErr || error) && (
            <div className={styles.errorBanner}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{localValidationErr || error}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {locale === 'hi' ? 'ईमेल या मोबाइल नंबर' : 'Email Address or Mobile'}
                </label>
                <div className={styles.inputWrapper}>
                  <Mail size={16} className={styles.inputIcon} />
                  <input
                    type="text"
                    className={styles.textInput}
                    placeholder="patient@example.com or 9876543210"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className={styles.label}>
                    {locale === 'hi' ? 'पासवर्ड' : 'Password'}
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#005c55', cursor: 'pointer', fontWeight: 600 }}>
                    {locale === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
                  </span>
                </div>
                <div className={styles.inputWrapper}>
                  <Lock size={16} className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={styles.textInput}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
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
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {locale === 'hi' ? 'पूरा नाम' : 'Full Name'}
                </label>
                <div className={styles.inputWrapper}>
                  <User size={16} className={styles.inputIcon} />
                  <input
                    type="text"
                    className={styles.textInput}
                    placeholder="e.g. Sunita Sharma"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {locale === 'hi' ? 'ईमेल पता' : 'Email Address'}
                </label>
                <div className={styles.inputWrapper}>
                  <Mail size={16} className={styles.inputIcon} />
                  <input
                    type="email"
                    className={styles.textInput}
                    placeholder="sunita@example.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
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
                    placeholder="+91 98765 43210"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  {locale === 'hi' ? 'पासवर्ड (कम से कम 6 अक्षर)' : 'Create Password (min. 6 characters)'}
                </label>
                <div className={styles.inputWrapper}>
                  <Lock size={16} className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={styles.textInput}
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
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

          {/* Quick Demo Pre-fill Box for instant review */}
          <div className={styles.divider}>
            <span>{locale === 'hi' ? 'त्वरित डेमो परीक्षण' : 'Quick Demo Access'}</span>
          </div>

          <div className={styles.demoBox}>
            <div className={styles.demoTitle}>
              <Sparkles size={13} color="#005c55" />
              <span>{locale === 'hi' ? '1-क्लिक टेस्ट क्रेडेंशियल्स' : '1-Click Review Credentials'}</span>
            </div>
            <div className={styles.demoButtons}>
              <button
                type="button"
                className={styles.demoBtn}
                onClick={handleQuickDemoCustomer}
                title="Log in instantly as Patient Sunita Sharma"
              >
                {locale === 'hi' ? 'रोगी डेमो (सुनीता शर्मा)' : 'Patient Demo (Sunita)'}
              </button>
              <button
                type="button"
                className={styles.demoBtn}
                onClick={handleQuickDemoAdmin}
                title="Log in instantly as Super Admin Dr. Rajesh Verma"
              >
                {locale === 'hi' ? 'व्यवस्थापक (डॉ. राजेश)' : 'Admin Demo (Dr. Rajesh)'}
              </button>
            </div>
          </div>

          <div className={styles.termsText}>
            {locale === 'hi'
              ? 'साइन इन करके आप आरोग्यमेड के रेंटल एवं वारंटी नियमों से सहमत होते हैं।'
              : 'By continuing, you agree to AarogyaMed Biomedical Terms of Rental & CDSCO Privacy Policy.'}
          </div>
        </div>
      </div>
    </div>
  );
};
