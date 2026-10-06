'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/features/auth/login/login.action';
import { registerUser } from '@/features/auth/register/register.action';
import { clearAuthError, setDemoCustomer, setDemoAdmin } from '@/features/auth/auth.slice';
import { useTranslation } from '@/locales';
import styles from './login.module.scss';
import {
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
  Clock,
  Truck,
  RotateCcw,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account';
  const defaultTab = searchParams.get('tab') === 'register' ? 'register' : 'login';

  const dispatch = useAppDispatch();
  const { locale } = useTranslation();
  const { isAuthenticated, loading, error, user } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);

  // Login Form
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Register Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [validationErr, setValidationErr] = useState<string | null>(null);

  useEffect(() => {
    dispatch(clearAuthError());
    setValidationErr(null);
  }, [activeTab, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, redirectUrl, router]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErr(null);

    if (!identifier.trim()) {
      setValidationErr(locale === 'hi' ? 'कृपया ईमेल या मोबाइल नंबर दर्ज करें' : 'Please enter your email or mobile number.');
      return;
    }
    if (!password) {
      setValidationErr(locale === 'hi' ? 'कृपया पासवर्ड दर्ज करें' : 'Please enter your password.');
      return;
    }

    const result = await dispatch(
      loginUser({
        email: identifier.trim(),
        password,
      })
    );

    if (loginUser.fulfilled.match(result)) {
      router.push(redirectUrl);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErr(null);

    if (!name.trim()) {
      setValidationErr(locale === 'hi' ? 'कृपया पूरा नाम दर्ज करें' : 'Full name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationErr(locale === 'hi' ? 'कृपया मान्य ईमेल दर्ज करें' : 'Please enter a valid email address.');
      return;
    }
    if (registerPassword.length < 6) {
      setValidationErr(locale === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए' : 'Password must be at least 6 characters.');
      return;
    }

    const result = await dispatch(
      registerUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password: registerPassword,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      router.push(redirectUrl);
    }
  };

  const handleQuickDemoCustomer = () => {
    dispatch(setDemoCustomer());
    router.push(redirectUrl);
  };

  const handleQuickDemoAdmin = () => {
    dispatch(setDemoAdmin());
    router.push('/admin');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.authCard}>
        {/* Left Trust Sidebar */}
        <div className={styles.trustSidebar}>
          <div className={styles.trustHeader}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <img
                src="/images/logo.svg"
                alt="AarogyaMed"
                width={190}
                height={48}
                className={styles.logoImg}
              />
            </Link>
            <h2>
              {locale === 'hi'
                ? 'विश्वासनीय चिकित्सा उपकरण प्लेटफॉर्म'
                : 'Hospital-Grade Equipment. Buy & Rent on Equal Footing.'}
            </h2>
            <p>
              {locale === 'hi'
                ? 'अस्पताल-स्तरीय स्वच्छता, प्रमाणित उपकरण और त्वरित होम डिलीवरी।'
                : 'CDSCO compliant, 10-step sterilized, and backed by biomedical technician home onboarding.'}
            </p>
          </div>

          <div className={styles.trustFeatures}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className={styles.featureTitle}>
                  {locale === 'hi' ? '10-चरणीय ऑटोक्लेव नसबंदी' : '10-Step Autoclave Sterilization'}
                </div>
                <div className={styles.featureDesc}>
                  {locale === 'hi'
                    ? 'प्रत्येक रेंटल से पहले अस्पताल-स्तरीय विसंक्रमण एवं सीलबंद पैकेजिंग।'
                    : 'Every rental device is biologically cleaned and sealed in hospital-grade wrap.'}
                </div>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <RotateCcw size={18} />
              </div>
              <div>
                <div className={styles.featureTitle}>
                  {locale === 'hi' ? '24 घंटे में जमा वापसी SLA' : '24-Hour Deposit Refund SLA'}
                </div>
                <div className={styles.featureDesc}>
                  {locale === 'hi'
                    ? 'उपकरण वापसी एवं निरीक्षण के 24 घंटे के भीतर सुरक्षा जमा सीधे बैंक में।'
                    : 'Security deposit released back to your bank account within 24h of return inspection.'}
                </div>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <Truck size={18} />
              </div>
              <div>
                <div className={styles.featureTitle}>
                  {locale === 'hi' ? 'अखिल भारतीय सेवा' : 'Pan-India Delivery & Onboarding'}
                </div>
                <div className={styles.featureDesc}>
                  {locale === 'hi'
                    ? 'ऑक्सीजन कंसंट्रेटर और आईसीयू बेड हेतु घर पर निःशुल्क इंस्टॉलेशन।'
                    : 'Expert bedside installation and patient caregiver training across tier 1 & 2 cities.'}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.trustFooter}>
            <ShieldCheck size={16} />
            <span>CDSCO Class B/C Verified · ISO 13485 Biomedical Compliance</span>
          </div>
        </div>

        {/* Right Form Section */}
        <div className={styles.formSection}>
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

          <div className={styles.formHeader}>
            <h1>
              {activeTab === 'login'
                ? (locale === 'hi' ? 'खाते में प्रवेश करें' : 'Sign in to your account')
                : (locale === 'hi' ? 'रोगी / देखभालकर्ता पंजीकरण' : 'Create Patient Account')}
            </h1>
            <p>
              {activeTab === 'login'
                ? (locale === 'hi' ? 'अपने ऑर्डर, सक्रिय रेंटल एवं पते देखने हेतु' : 'Access your purchases, rental contracts, and saved delivery addresses.')
                : (locale === 'hi' ? 'अस्पताल-स्तरीय उपकरणों की खरीद एवं रेंटल हेतु' : 'Sign up to rent or purchase hospital-grade medical devices.')}
            </p>
          </div>

          {(validationErr || error) && (
            <div className={styles.errorBanner}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{validationErr || error}</span>
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
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  ? (locale === 'hi' ? 'सत्यापन किया जा रहा है...' : 'Verifying Session...')
                  : (locale === 'hi' ? 'लॉग इन करें' : 'Sign In')}
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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

          {/* Quick Demo Credentials */}
          <div className={styles.demoBox}>
            <div className={styles.demoTitle}>
              <Sparkles size={13} color="#005c55" />
              <span>{locale === 'hi' ? '1-क्लिक परीक्षण क्रेडेंशियल्स' : '1-Click Review Credentials'}</span>
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
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: '#6e7977' }}>Loading Secure Portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
