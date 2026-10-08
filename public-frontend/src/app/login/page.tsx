'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/features/auth/login/login.action';
import { registerUser } from '@/features/auth/register/register.action';
import { clearAuthError } from '@/features/auth/auth.slice';
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
  AlertCircle,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
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

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

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
    dispatch(clearAuthError());
    resetLogin();
    resetSignUp();
  }, [activeTab, dispatch, resetLogin, resetSignUp]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, redirectUrl, router]);

  const onLogin = async (data: LoginFormData) => {
    const result = await dispatch(
      loginUser({
        email: data.identifier.trim(),
        password: data.password,
      })
    );

    if (loginUser.fulfilled.match(result)) {
      router.push(redirectUrl);
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
      router.push(redirectUrl);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Left Column: Brand & Trust Badges */}
      <div className={styles.heroColumn}>
        <div className={styles.heroContent}>
          <div className={styles.brandBadge}>
            <ShieldCheck size={16} />
            <span>CDSCO Registered • ISO 13485 Certified</span>
          </div>
          <h1 className={styles.heroTitle}>
            {locale === 'hi'
              ? 'अस्पताल-स्तरीय चिकित्सा देखभाल सीधे आपके घर पर'
              : 'Hospital-Grade Clinical Equipment Delivered to Your Home'}
          </h1>
          <p className={styles.heroSubtitle}>
            {locale === 'hi'
              ? 'सत्यापित ऑक्सीजन कंसंट्रेटर, आईसीयू बेड, बाईपैप और मोबिलिटी उपकरण रेंटल व खरीद। 4 घंटे में बायोमेडिकल स्थापना।'
              : 'Rent or buy calibrated ICU beds, oxygen concentrators, BiPAP machines, and wheelchairs with rapid 4-hour sanitized dispatch.'}
          </p>

          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <Clock size={20} />
              </div>
              <div>
                <h4 className={styles.featureTitle}>
                  {locale === 'hi' ? '4 घंटे की आपातकालीन स्थापना' : '4-Hour Emergency Dispatch'}
                </h4>
                <p className={styles.featureDesc}>
                  {locale === 'hi'
                    ? 'सभी प्रमुख मेट्रो क्षेत्रों में प्रशिक्षित बायोमेडिकल इंजीनियरों द्वारा।'
                    : 'Deployed with factory calibration certificates across all metro hubs.'}
                </p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <Truck size={20} />
              </div>
              <div>
                <h4 className={styles.featureTitle}>
                  {locale === 'hi' ? 'निःशुल्क डिलीवरी और स्टरलाइज़ेशन' : 'Free Delivery & Sterilization'}
                </h4>
                <p className={styles.featureDesc}>
                  {locale === 'hi'
                    ? 'हर यूनिट डिलीवरी से पहले अस्पताल-ग्रेड ऑटोक्लेविंग से गुजरती है।'
                    : 'Every unit passes a multi-point biological safety inspection.'}
                </p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <RotateCcw size={20} />
              </div>
              <div>
                <h4 className={styles.featureTitle}>
                  {locale === 'hi' ? 'लचीला रेंटल एवं 100% वापसी' : 'Flexible Rental & Security Return'}
                </h4>
                <p className={styles.featureDesc}>
                  {locale === 'hi'
                    ? 'बिना किसी परेशानी के अवधि बढ़ाएं। वापसी पर तुरंत सिक्योरिटी रिफंड।'
                    : 'Extend rental days seamlessly; instant deposit refund upon return.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className={styles.formColumn}>
        <div className={styles.formCard}>
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

          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              {activeTab === 'login'
                ? (locale === 'hi' ? 'अपने खाते में साइन इन करें' : 'Sign In to Patient Portal')
                : (locale === 'hi' ? 'नया रोगी खाता बनाएं' : 'Create Caregiver Account')}
            </h2>
            <p className={styles.cardSubtitle}>
              {activeTab === 'login'
                ? (locale === 'hi' ? 'अपने ऑर्डर और रेंटल ट्रैक करने के लिए क्रेडेंशियल्स दर्ज करें' : 'Enter your registered email or phone to access rentals & orders.')
                : (locale === 'hi' ? 'त्वरित चेकआउट और रेंटल प्रबंधन के लिए साइन अप करें' : 'Sign up for express delivery, order tracking & custom rental plans.')}
            </p>
          </div>

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
                  ? (locale === 'hi' ? 'सत्यापन हो रहा है...' : 'Verifying Session...')
                  : (locale === 'hi' ? 'लॉग इन करें' : 'Sign In')}
                <ArrowRight size={16} />
              </button>
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

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#6e7977' }}>
            {locale === 'hi'
              ? 'साइन इन करके आप आरोग्यमेड के रेंटल एवं वारंटी नियमों से सहमत होते हैं।'
              : 'By signing in, you agree to AarogyaMed Biomedical Terms of Rental & CDSCO Privacy Policy.'}
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
