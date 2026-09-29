'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLocale } from '@/features/ui/ui.slice';
import { useTranslation } from '@/locales';
import styles from './Navbar.module.scss';
import {
  PhoneCall,
  Search,
  MapPin,
  ShoppingCart,
  User,
  Clock,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Globe,
  Stethoscope,
  Heart,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  CalendarClock,
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import { logout } from '@/features/auth/auth.slice';
import { UserEntity } from '@/domain/entities/user.entity';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t, locale } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const cartItemCount = useAppSelector((state) => state.cart.pricing.itemCount);
  const wishlistCount = useAppSelector((state) => state.wishlist?.items?.length || 0);
  const { user: authUser, isAuthenticated } = useAppSelector((state) => state.auth);

  const cities = [
    'Bengaluru',
    'Delhi NCR',
    'Mumbai',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsUserDropdownOpen(false);
    router.push('/');
  };

  const userInitials = authUser?.name ? UserEntity.getInitials(authUser.name) : 'U';
  const firstName = authUser?.name ? authUser.name.split(' ')[0] : 'User';


  return (
    <header className={styles.navbarWrapper}>
      {/* 1. Clinical Emergency & Caregiver Hotline Banner */}
      <div className={styles.topBar}>
        <div className={styles.container}>
          <div className={styles.leftPill}>
            <span className={styles.badge}>
              <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              {t.common.certifiedBadge}
            </span>
            <span className={styles.supportText}>
              {t.common.helpline}
            </span>
          </div>
          <div className={styles.rightLinks}>
            <Link href="/assessment">
              <Stethoscope size={14} /> {locale === 'hi' ? 'उपकरण चयन सहायक' : 'Care Assessment'}
            </Link>
            <Link href="/hubs">
              <MapPin size={14} /> {locale === 'hi' ? 'अनुभव केंद्र' : 'Experience Centers'}
            </Link>
            <Link href="/blog">
              <Sparkles size={14} /> {t.common.knowledgeHub}
            </Link>
            <Link href="/account/rentals">
              <Clock size={14} /> {t.common.activeRentals}
            </Link>
            <Link href="/admin" style={{ color: '#005c55', fontWeight: 700 }}>
              <ShieldCheck size={14} /> Admin
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className={styles.mainNav}>
        <div className={styles.container}>
          {/* Brand Logo */}
          <Link href="/" className={styles.brandLogo}>
            <img
              src="/images/logo.svg"
              alt="AarogyaMed - Care Equipment &amp; Rentals"
              width={220}
              height={55}
            />
          </Link>

          {/* Search Bar */}
          <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder={t.common.searchPlaceholder}
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchBtn}>
              {t.common.searchBtn}
            </button>
          </form>

          {/* Right Action Icons */}
          <div className={styles.navActions}>
            {/* Language Switcher Pill */}
            <div className={styles.languageToggle}>
              <button
                type="button"
                className={`${styles.langBtn} ${locale === 'en' ? styles.active : ''}`}
                onClick={() => dispatch(setLocale('en'))}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                className={`${styles.langBtn} ${locale === 'hi' ? styles.active : ''}`}
                onClick={() => dispatch(setLocale('hi'))}
                title="हिन्दी में बदलें"
              >
                हिन्दी
              </button>
            </div>

            {/* City Selector */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className={styles.cityPicker}
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              >
                <MapPin size={16} color="#005c55" />
                <span>{selectedCity}</span>
                <ChevronDown size={14} />
              </button>

              {isCityDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 6,
                    background: '#ffffff',
                    border: '1px solid #dae2fd',
                    borderRadius: 10,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    padding: '8px 0',
                    width: 170,
                    zIndex: 100,
                  }}
                >
                  <div
                    style={{
                      padding: '4px 12px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#6e7977',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t.common.selectCity}
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 14px',
                        background: selectedCity === city ? '#eaf8f6' : 'transparent',
                        color: selectedCity === city ? '#005c55' : '#131b2e',
                        fontWeight: selectedCity === city ? 700 : 500,
                        fontSize: '0.875rem',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsCityDropdownOpen(false);
                      }}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <Link href="/account/wishlist" className={styles.actionLink} title={locale === 'hi' ? 'इच्छासूची' : 'Wishlist'}>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -8,
                      background: '#005c55',
                      color: '#ffffff',
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      minWidth: 16,
                      height: 16,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 3px',
                    }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span>{locale === 'hi' ? 'इच्छासूची' : 'Wishlist'}</span>
            </Link>

            {/* Account / User Menu */}
            {isAuthenticated && authUser ? (
              <div className={styles.userDropdownContainer}>
                <button
                  type="button"
                  className={styles.userMenuBtn}
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  title={authUser.name}
                >
                  <div className={styles.userAvatar}>{userInitials}</div>
                  <span className={styles.userNameText}>{firstName}</span>
                  <ChevronDown size={14} color="#6e7977" />
                </button>

                {isUserDropdownOpen && (
                  <div className={styles.userMenuDropdown} onMouseLeave={() => setIsUserDropdownOpen(false)}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownUserName}>{authUser.name}</div>
                      <div className={styles.dropdownUserRole}>
                        {authUser.role === 'super_admin'
                          ? 'Super Admin'
                          : authUser.role === 'operations_staff'
                          ? 'Operations Staff'
                          : (locale === 'hi' ? 'सत्यापित रोगी / देखभालकर्ता' : 'Verified Patient')}
                      </div>
                    </div>

                    <Link
                      href="/account"
                      className={styles.dropdownItem}
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <User size={15} />
                      <span>{locale === 'hi' ? 'खाता सारांश' : 'Account Overview'}</span>
                    </Link>

                    <Link
                      href="/account/rentals"
                      className={styles.dropdownItem}
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <CalendarClock size={15} />
                      <span>{locale === 'hi' ? 'सक्रिय रेंटल उपकरण' : 'Active Rentals'}</span>
                    </Link>

                    <Link
                      href="/account/orders"
                      className={styles.dropdownItem}
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <ShoppingBag size={15} />
                      <span>{locale === 'hi' ? 'खरीद के आदेश' : 'Purchase Orders'}</span>
                    </Link>

                    <Link
                      href="/account/addresses"
                      className={styles.dropdownItem}
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <MapPin size={15} />
                      <span>{locale === 'hi' ? 'वितरण पते' : 'Saved Addresses'}</span>
                    </Link>

                    <Link
                      href="/account/wishlist"
                      className={styles.dropdownItem}
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <Heart size={15} />
                      <span>{locale === 'hi' ? 'सहेजी गई इच्छासूची' : 'Saved Wishlist'}</span>
                    </Link>

                    {(authUser.role === 'super_admin' || authUser.role === 'operations_staff') && (
                      <Link
                        href="/admin"
                        className={styles.dropdownItem}
                        style={{ color: '#005c55', fontWeight: 700 }}
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <LayoutDashboard size={15} />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      className={`${styles.dropdownItem} ${styles.logout}`}
                      onClick={handleLogout}
                    >
                      <LogOut size={15} />
                      <span>{locale === 'hi' ? 'लॉग आउट करें' : 'Sign Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                className={styles.actionLink}
                onClick={() => setIsAuthModalOpen(true)}
              >
                <User size={20} />
                <span>{locale === 'hi' ? 'साइन इन' : 'Sign In'}</span>
              </button>
            )}

            {/* Cart Button with Counter */}
            <Link href="/cart" className={styles.cartBtn}>
              <ShoppingCart size={18} />
              <span>{t.common.cart}</span>
              {cartItemCount > 0 && <span className={styles.badge}>{cartItemCount}</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Category & Clinical Condition Sub-navigation Bar */}
      <nav className={styles.categorySubNav}>
        <div className={styles.container}>
          <Link href="/shop" className={styles.navItem}>
            {t.common.allEquipment}
          </Link>
          <Link href="/learn/sleep-apnea" className={`${styles.navItem} ${styles.highlight}`}>
            {t.common.conditionGuides}
          </Link>
          <Link href="/blog" className={styles.navItem}>
            {t.common.knowledgeHub}
          </Link>
          <Link href="/about" className={styles.navItem}>
            {locale === 'hi' ? 'हमारे बारे में' : 'About Us'}
          </Link>
          <Link href="/hubs" className={styles.navItem}>
            {locale === 'hi' ? 'अनुभव केंद्र' : 'Experience Hubs'}
          </Link>
          <a
            href="tel:18008892273"
            className={styles.navItem}
            style={{ marginLeft: 'auto', color: '#005c55', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <PhoneCall size={14} /> {t.common.immediateDispatch}
          </a>
        </div>
      </nav>

      {/* Interactive Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
};

