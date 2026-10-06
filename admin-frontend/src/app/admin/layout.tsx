'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PackageCheck,
  CalendarSync,
  ShoppingBag,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Globe2,
  Bell,
  Sparkles,
  PlusCircle,
  FolderTree,
  BookOpen,
  Users,
  FileText,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setDemoAdmin } from '@/features/auth/auth.slice';
import { loginUser } from '@/features/auth/login/login.action';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { user: authUser, isAuthenticated } = useAppSelector((state) => state.auth);
  const products = useAppSelector((state) => state.products.products);
  const rentals = useAppSelector((state) => state.rentals.rentals);
  const categories = useAppSelector((state) => state.categories?.categories || []);
  const conditions = useAppSelector((state) => state.conditions?.conditions || []);
  const blogPosts = useAppSelector((state) => state.blog?.posts || []);
  const customers = useAppSelector((state) => state.user?.customers || []);

  const isAdminAuthorized =
    isAuthenticated &&
    authUser &&
    authUser.role === 'super_admin';

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);
    try {
      const result = await dispatch(loginUser({ email: adminEmail, password: adminPassword })).unwrap();
      const user = result.data?.user;
      if (user?.role !== 'super_admin') {
        setLoginError(`Access denied: Account '${user?.email || adminEmail}' has role '${user?.role}'. An administrator account is required.`);
      } else {
        setAdminModalOpen(false);
      }
    } catch (err: any) {
      setLoginError(err || 'Failed to authenticate administrator credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#131b2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
        }}
      >
        <div style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 600 }}>
          Synchronizing Operations Console...
        </div>
      </div>
    );
  }

  if (!isAdminAuthorized) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #131b2e 0%, #1e293b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          color: '#ffffff',
          fontFamily: 'inherit',
        }}
      >
        <div
          style={{
            maxWidth: 520,
            width: '100%',
            background: '#ffffff',
            borderRadius: 24,
            padding: '2.5rem 2rem',
            textAlign: 'center',
            color: '#131b2e',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: '#fff4eb',
              color: '#913200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <ShieldCheck size={32} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
            Operations Console Access Restricted
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6e7977', margin: '0 0 1.75rem', lineHeight: 1.6 }}>
            The AarogyaMed Clinical Operations Console requires verified administrator credentials.
            {authUser ? ` Currently signed in as "${authUser.name}" (${authUser.role}).` : ' Please sign in with an administrator account to continue.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              type="button"
              onClick={() => dispatch(setDemoAdmin())}
              style={{
                background: '#005c55',
                color: '#ffffff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: 12,
                fontSize: '0.9375rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(0, 92, 85, 0.25)',
              }}
            >
              <Sparkles size={16} />
              <span>Log In as Demo Super Admin (Dr. Rajesh)</span>
            </button>

            <button
              type="button"
              onClick={() => setAdminModalOpen(true)}
              style={{
                background: '#f2f3ff',
                color: '#131b2e',
                border: '1px solid #dae2fd',
                padding: '12px 20px',
                borderRadius: 12,
                fontSize: '0.9375rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Enter Custom Admin Credentials
            </button>

            <a
              href={process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000'}
              style={{
                color: '#6e7977',
                fontSize: '0.8125rem',
                fontWeight: 600,
                textDecoration: 'none',
                marginTop: 8,
              }}
            >
              ← Return to AarogyaMed Public Storefront
            </a>
          </div>

          {adminModalOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem',
              }}
            >
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 20,
                  maxWidth: 440,
                  width: '100%',
                  padding: '2rem',
                  textAlign: 'left',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#131b2e' }}>Administrator Authentication</h3>
                  <button
                    type="button"
                    onClick={() => { setAdminModalOpen(false); setLoginError(null); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6e7977' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleAdminLogin}>
                  {loginError && (
                    <div style={{ background: '#fdf2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem', borderRadius: 8, fontSize: '0.8125rem', marginBottom: '1rem' }}>
                      {loginError}
                    </div>
                  )}

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#475569', marginBottom: '0.375rem' }}>Admin Email / ID</label>
                    <input
                      type="text"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@aarogyamed.com"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9375rem', outline: 'none' }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#475569', marginBottom: '0.375rem' }}>Password</label>
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9375rem', outline: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      background: '#005c55',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px',
                      borderRadius: 12,
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                  >
                    {isSubmitting ? 'Verifying Admin Access...' : 'Sign In to Operations Console'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }


  // Calculate live translation coverage
  const totalProducts = products.length;
  const translatedProducts = products.filter((p) => p.translations?.hi).length;
  const coveragePercent = totalProducts > 0 ? Math.round((translatedProducts / totalProducts) * 100) : 100;
  const pendingRentalsCount = rentals.filter((r) => r.status === 'pending' || r.status === 'confirmed').length;

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'Product Manager',
      href: '/admin/products',
      icon: PackageCheck,
      badge: totalProducts.toString(),
    },
    {
      label: 'Rental Operations',
      href: '/admin/rentals',
      icon: CalendarSync,
      badge: pendingRentalsCount > 0 ? `${pendingRentalsCount} active` : null,
      badgeColor: '#b94200',
    },
    {
      label: 'Condition Guides CMS',
      href: '/admin/conditions',
      icon: BookOpen,
      badge: `${conditions.length} guides`,
      badgeColor: '#005c55',
    },
    {
      label: 'Clinical Blog & CMS',
      href: '/admin/blog',
      icon: FileText,
      badge: `${blogPosts.length} articles`,
      badgeColor: '#006398',
    },
    {
      label: 'Category Taxonomy',
      href: '/admin/categories',
      icon: FolderTree,
      badge: categories.length > 0 ? categories.length.toString() : null,
    },
    {
      label: 'Purchase Orders',
      href: '/admin/orders',
      icon: ShoppingBag,
      badge: null,
    },
    {
      label: 'Patients & Customers',
      href: '/admin/customers',
      icon: Users,
      badge: customers.length > 0 ? `${customers.length} patients` : null,
      badgeColor: '#006398',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f4f6fc',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: '#131b2e',
      }}
    >
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(19, 27, 46, 0.4)',
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          background: '#ffffff',
          borderRight: '1px solid #e2e7ff',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
          flexShrink: 0,
          boxShadow: '1px 0 8px rgba(0,0,0,0.02)',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #f2f3ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #005c55, #006398)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,92,85,0.3)',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#005c55', letterSpacing: '-0.02em', display: 'block' }}>
                AarogyaMed
              </span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#006398', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Clinical Operations Hub
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '1.25rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ padding: '0 0.75rem 0.5rem', fontSize: '0.6875rem', fontWeight: 800, color: '#6e7977', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Catalog &amp; Operations
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 10,
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#005c55' : '#3e4947',
                  background: isActive ? '#e8f5f3' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  borderLeft: isActive ? '3px solid #005c55' : '3px solid transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Icon size={18} color={isActive ? '#005c55' : '#6e7977'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: item.badgeColor ? '#ffe5dc' : '#eaedff',
                      color: item.badgeColor || '#006398',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div style={{ margin: '1.25rem 0 0.5rem', borderTop: '1px solid #f2f3ff', paddingTop: '1rem', paddingLeft: '0.75rem', fontSize: '0.6875rem', fontWeight: 800, color: '#6e7977', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Storefront
          </div>
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#3e4947',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <ExternalLink size={18} color="#6e7977" />
            <span>Customer Storefront</span>
          </Link>
          <Link
            href="/hubs"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#3e4947',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Globe2 size={18} color="#6e7977" />
            <span>Experience Centers</span>
          </Link>
        </nav>

        {/* Translation Coverage Pill in Sidebar */}
        <div
          style={{
            margin: '0.75rem',
            padding: '1rem',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #f2f3ff 0%, #e2e7ff 100%)',
            border: '1px solid #dae2fd',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#131b2e', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Globe2 size={14} color="#005c55" />
              Hindi Coverage
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#005c55' }}>
              {coveragePercent}%
            </span>
          </div>
          <div style={{ width: '100%', height: 6, background: '#dae2fd', borderRadius: 999, overflow: 'hidden' }}>
            <div
              style={{
                width: `${coveragePercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #005c55, #006398)',
                borderRadius: 999,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '0.6875rem', color: '#3e4947' }}>
            {translatedProducts} of {totalProducts} products have complete Hindi translations.
          </p>
        </div>

        {/* Admin User Footer */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid #f2f3ff',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#005c55',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          >
            AD
          </div>
          <div style={{ overflow: 'hidden' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#131b2e', display: 'block', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Admin Operations
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#005c55', fontWeight: 600 }}>
              Super Administrator
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header
          style={{
            height: 64,
            background: '#ffffff',
            borderBottom: '1px solid #e2e7ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              <Menu size={22} color="#131b2e" />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#005c55',
                  boxShadow: '0 0 0 3px rgba(0,92,85,0.2)',
                }}
              />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#005c55' }}>
                Pan-India Medical Equipment Dispatch Active
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link
              href="/admin/products/new"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: 8,
                background: '#005c55',
                color: '#ffffff',
                fontSize: '0.8125rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(0,92,85,0.25)',
              }}
            >
              <PlusCircle size={16} />
              <span>New Product</span>
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main style={{ padding: '1.75rem', flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
