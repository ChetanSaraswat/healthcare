'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLocale } from '@/features/ui/ui.slice';
import { useTranslation } from '@/locales';
import { CONTACT_CONFIG } from '@/config/contact.config';
import styles from './Navbar.module.scss';
import {
  PhoneCall,
  MessageCircle,
  ShoppingCart,
  User,
  Heart,
  Clock,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  LogIn,
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import { logout } from '@/features/auth/auth.slice';
import { clearCart } from '@/features/cart/cart.slice';
import { clearCheckoutSession } from '@/features/payment/checkout-session';
import { UserEntity } from '@/domain/entities/user.entity';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { t, locale } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsProfileOpen(false);
  }, [pathname]);

  const cartItemCount = useAppSelector((state) => state.cart.pricing.itemCount);
  const wishlistCount = useAppSelector((state) => state.wishlist?.items?.length || 0);
  const { user: authUser, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    clearCheckoutSession();
    setIsProfileOpen(false);
    router.push('/');
  };

  const userInitials = authUser?.name ? UserEntity.getInitials(authUser.name) : 'U';

  return (
    <header className={styles.navbarWrapper}>
      {/* Main Navigation Bar (Clean & Streamlined in ONE Single Line) */}
      <div className={styles.mainNav}>
        <div className={styles.container}>
          {/* Brand Logo (Positioned further to the left) */}
          <Link href="/" className={styles.brandLogo}>
            <img
              src="/images/logo.svg"
              alt="Omkar Healthcare"
              width={165}
              height={42}
            />
          </Link>

          {/* Center Navigation Links (All in One Line, including Contact) */}
          <nav className={styles.navLinks}>
            {/* Home */}
            <Link
              href="/"
              className={`${styles.navItem} ${pathname === '/' ? styles.active : ''}`}
            >
              <span>{t.common.home || (locale === 'hi' ? 'होम' : 'Home')}</span>
            </Link>

            {/* All Medical Equipment */}
            <Link
              href="/shop"
              className={`${styles.navItem} ${pathname === '/shop' || pathname.startsWith('/shop') || pathname.startsWith('/product') ? styles.active : ''}`}
            >
              <span>{t.common.allEquipment}</span>
            </Link>

            {/* Education & Care Guides (Folded Condition Guides + Practical Articles) */}
            <Link
              href="/learn"
              className={`${styles.navItem} ${pathname === '/learn' || pathname.startsWith('/learn') || pathname.startsWith('/conditions') || pathname.startsWith('/blog') ? styles.active : ''}`}
            >
              <span>
                {t.common.educationGuides || (locale === 'hi' ? 'शिक्षा एवं केयर गाइड' : 'Education & Care Guides')}
              </span>
            </Link>

            {/* Experience Centers */}
            <Link
              href="/experience-centers"
              className={`${styles.navItem} ${pathname === '/experience-centers' || pathname.startsWith('/experience-centers') ? styles.active : ''}`}
            >
              <span>
                {t.common.experienceCenters || (locale === 'hi' ? 'एक्सपीरियंस सेंटर' : 'Experience Centers')}
              </span>
            </Link>

            {/* About Us */}
            <Link
              href="/about"
              className={`${styles.navItem} ${pathname === '/about' || pathname.startsWith('/about') ? styles.active : ''}`}
            >
              <span>{locale === 'hi' ? 'हमारे बारे में' : 'About Us'}</span>
            </Link>

            {/* Contact Information in Contact */}
            <Link
              href="/contact"
              className={`${styles.navItem} ${pathname === '/contact' || pathname.startsWith('/contact') ? styles.active : ''}`}
            >
              <span>{t.common.contact || (locale === 'hi' ? 'संपर्क' : 'Contact')}</span>
            </Link>
          </nav>

          {/* Right Action Utilities in the Same Line */}
          <div className={styles.navActions}>
            {/* Contact Information in Same Line */}
            <div className={styles.contactGroup}>
              {/* Click-to-Call Phone Number Pill */}
              <a
                href={`tel:${CONTACT_CONFIG.phone}`}
                className={styles.contactPill}
                title={locale === 'hi' ? 'क्लिक करके कॉल करें' : 'Click to call Helpline'}
              >
                <div className={styles.phoneIconBox}>
                  <PhoneCall size={13} />
                </div>
                <div className={styles.contactText}>
                  <span className={styles.contactLabel}>
                    {locale === 'hi' ? 'हेल्पलाइन' : 'Helpline'}
                  </span>
                  <span className={styles.contactNumber}>{CONTACT_CONFIG.phoneDisplay}</span>
                </div>
              </a>
            </div>

            {/* Language Switcher Pill (EN | हिन्दी) */}
            <div className={styles.languageToggle}>
              <button
                type="button"
                className={`${styles.langBtn} ${locale === 'en' ? styles.active : ''}`}
                onClick={() => dispatch(setLocale('en'))}
                title="English"
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

            {/* Standalone Cart Button with Cart Icon ONLY */}
            <Link
              href="/cart"
              className={styles.cartIconBtn}
              aria-label={locale === 'hi' ? 'कार्ट' : 'Cart'}
              title={
                isMounted && cartItemCount > 0
                  ? locale === 'hi'
                    ? `कार्ट (${cartItemCount})`
                    : `Cart (${cartItemCount})`
                  : locale === 'hi'
                  ? 'कार्ट'
                  : 'Cart'
              }
            >
              <ShoppingCart size={19} />
              {isMounted && cartItemCount > 0 && (
                <span className={styles.cartBadge} aria-label={`${cartItemCount} items in cart`}>
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown Container */}
            <div className={styles.profileDropdownContainer} ref={dropdownRef}>
              <button
                type="button"
                className={styles.profileToggleBtn}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-expanded={isProfileOpen}
                aria-label={locale === 'hi' ? 'प्रोफाइल एवं खाता' : 'Profile & Account'}
                title={
                  isMounted && isAuthenticated && authUser
                    ? authUser.name
                    : locale === 'hi'
                    ? 'प्रोफाइल एवं खाता'
                    : 'Profile & Account'
                }
              >
                {/* Profile Icon */}
                {isMounted && isAuthenticated && authUser ? (
                  <div className={styles.userAvatar}>{userInitials}</div>
                ) : (
                  <div className={styles.userAvatar}>
                    <User size={18} />
                  </div>
                )}
              </button>

              {/* Scroll Down / Dropdown Menu containing all three items */}
              {isProfileOpen && (
                <div className={styles.profileDropdownMenu}>
                  {/* 1. Profile / Account Header */}
                  <div className={styles.dropdownHeader}>
                    {isMounted && isAuthenticated && authUser ? (
                      <>
                        <div className={styles.userWelcome}>
                          {locale === 'hi' ? 'स्वागत है' : 'Signed in as'}
                        </div>
                        <div className={styles.dropdownUserName}>{authUser.name}</div>
                        <div className={styles.dropdownUserRole}>
                          {authUser.role === 'super_admin' ? 'Administrator' : 'Verified Caregiver'}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.userWelcome}>
                          {locale === 'hi' ? 'नमस्ते, अतिथि' : 'Welcome to Omkar'}
                        </div>
                        <div className={styles.dropdownUserName} style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                          {locale === 'hi' ? 'प्रमाणित चिकित्सा उपकरण सेवाएं' : 'Hospital-grade care & rentals'}
                        </div>
                        <button
                          type="button"
                          className={styles.authCtaBtn}
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsAuthModalOpen(true);
                          }}
                        >
                          <LogIn size={15} />
                          <span>{locale === 'hi' ? 'साइन इन / रजिस्टर करें' : 'Sign In / Register'}</span>
                        </button>
                      </>
                    )}
                  </div>

                  <div className={styles.menuSectionTitle}>
                    {locale === 'hi' ? 'त्वरित पहुंच' : 'Quick Actions'}
                  </div>

                  {/* 2. Healthcare Cart Item */}
                  <Link
                    href="/cart"
                    className={styles.dropdownCardItem}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <div className={styles.itemLeft}>
                      <div className={`${styles.itemIconBox} ${styles.cartIconBox}`}>
                        <ShoppingCart size={17} />
                      </div>
                      <div className={styles.itemTextGroup}>
                        <span className={styles.itemTitle}>{t.common.cart}</span>
                        <span className={styles.itemSubtitle}>
                          {isMounted && cartItemCount > 0
                            ? locale === 'hi'
                              ? `${cartItemCount} उपकरण चयनित`
                              : `${cartItemCount} item(s) selected`
                            : locale === 'hi'
                            ? 'कार्ट खाली है'
                            : 'No equipment added'}
                        </span>
                      </div>
                    </div>
                    {isMounted && cartItemCount > 0 && (
                      <span className={`${styles.itemBadge} ${styles.cartBadge}`}>
                        {cartItemCount}
                      </span>
                    )}
                  </Link>

                  {/* 3. Saved Wishlist Item */}
                  <Link
                    href="/account/wishlist"
                    className={styles.dropdownCardItem}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <div className={styles.itemLeft}>
                      <div className={`${styles.itemIconBox} ${styles.wishlistIconBox}`}>
                        <Heart size={17} />
                      </div>
                      <div className={styles.itemTextGroup}>
                        <span className={styles.itemTitle}>
                          {locale === 'hi' ? 'इच्छासूची' : 'Wishlist'}
                        </span>
                        <span className={styles.itemSubtitle}>
                          {isMounted && wishlistCount > 0
                            ? locale === 'hi'
                              ? `${wishlistCount} सहेजे गए उपकरण`
                              : `${wishlistCount} saved item(s)`
                            : locale === 'hi'
                            ? 'सहेजे गए उपकरण'
                            : 'Saved medical devices'}
                        </span>
                      </div>
                    </div>
                    {isMounted && wishlistCount > 0 && (
                      <span className={`${styles.itemBadge} ${styles.wishlistBadge}`}>
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* 4. My Account / Profile Item */}
                  <Link
                    href="/account"
                    className={styles.dropdownCardItem}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <div className={styles.itemLeft}>
                      <div className={`${styles.itemIconBox} ${styles.profileIconBox}`}>
                        <User size={17} />
                      </div>
                      <div className={styles.itemTextGroup}>
                        <span className={styles.itemTitle}>{t.common.myAccount}</span>
                        <span className={styles.itemSubtitle}>
                          {locale === 'hi' ? 'व्यक्तिगत विवरण व प्राथमिकताएं' : 'Account overview & settings'}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Additional Account Links if logged in */}
                  {isMounted && isAuthenticated && authUser && (
                    <>
                      <div className={styles.menuDivider} />
                      <div className={styles.menuSectionTitle}>
                        {locale === 'hi' ? 'रेंटल एवं ऑर्डर' : 'Rentals & Orders'}
                      </div>

                      <Link
                        href="/account/rentals"
                        className={styles.dropdownSimpleItem}
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Clock size={15} />
                        <span>{t.common.activeRentals}</span>
                      </Link>

                      <Link
                        href="/account/orders"
                        className={styles.dropdownSimpleItem}
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <ShoppingBag size={15} />
                        <span>{locale === 'hi' ? 'खरीद आदेश' : 'Purchase Orders'}</span>
                      </Link>

                      <Link
                        href="/account/addresses"
                        className={styles.dropdownSimpleItem}
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <MapPin size={15} />
                        <span>{locale === 'hi' ? 'वितरण पते' : 'Saved Addresses'}</span>
                      </Link>

                      {authUser.role === 'super_admin' && (
                        <Link
                          href={process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001/admin'}
                          className={styles.dropdownSimpleItem}
                          style={{ color: '#16453A', fontWeight: 700 }}
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <LayoutDashboard size={15} />
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <div className={styles.menuDivider} />

                      <button
                        type="button"
                        className={`${styles.dropdownSimpleItem} ${styles.logoutBtn}`}
                        onClick={handleLogout}
                      >
                        <LogOut size={15} />
                        <span>{locale === 'hi' ? 'लॉग आउट करें' : 'Sign Out'}</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>



      {/* Interactive Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
};
