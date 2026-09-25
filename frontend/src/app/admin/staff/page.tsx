'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Search,
  KeyRound,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  Briefcase,
  FileEdit,
  SlidersHorizontal,
  X,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  Check,
  Minus,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  getStaff,
  createStaff,
  updateStaffRole,
  toggleStaffStatus,
} from '@/features/staff/get-staff/get-staff.action';
import {
  StaffMember,
  StaffRole,
  RBACMatrix,
  StaffPermission,
} from '@/domain/entities/user.entity';

export default function AdminStaffPage() {
  const dispatch = useAppDispatch();
  const staffMembers = useAppSelector((state) => state.staff.staffMembers);
  const loading = useAppSelector((state) => state.staff.loading);
  const actionLoading = useAppSelector((state) => state.staff.actionLoading);
  const currentUser = useAppSelector((state) => state.auth.user);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | StaffRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);
  const [roleChangeTarget, setRoleChangeTarget] = useState<StaffMember | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<StaffRole>('operations_staff');
  const [statusChangeTarget, setStatusChangeTarget] = useState<StaffMember | null>(null);

  // Add Staff Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'operations_staff' as StaffRole,
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getStaff());
  }, [dispatch]);

  // Aggregate metrics
  const totalStaff = staffMembers.length;
  const activeStaff = staffMembers.filter((s) => s.isActive).length;
  const superAdmins = staffMembers.filter((s) => s.role === 'super_admin' && s.isActive).length;
  const opsStaff = staffMembers.filter((s) => s.role === 'operations_staff').length;

  // Filter staff list
  const filteredStaff = staffMembers.filter((staff) => {
    // Role filter
    if (roleFilter !== 'all' && staff.role !== roleFilter) return false;

    // Status filter
    if (statusFilter === 'active' && !staff.isActive) return false;
    if (statusFilter === 'suspended' && staff.isActive) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = staff.name.toLowerCase().includes(q);
      const emailMatch = staff.email.toLowerCase().includes(q);
      const phoneMatch = staff.phone ? staff.phone.toLowerCase().includes(q) : false;
      if (!nameMatch && !emailMatch && !phoneMatch) return false;
    }

    return true;
  });

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'operations_staff',
      password: '',
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim() || formData.name.length < 2) {
      setFormError('Please enter a valid staff member name (minimum 2 characters).');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Please enter a valid official email address.');
      return;
    }
    if (!formData.password || formData.password.length < 8) {
      setFormError('Temporary password must be at least 8 characters long.');
      return;
    }

    try {
      await dispatch(createStaff(formData)).unwrap();
      setIsAddModalOpen(false);
      showNotification(`Staff member ${formData.name} successfully registered.`);
    } catch (err: any) {
      setFormError(err || 'Failed to register staff account.');
    }
  };

  const handleConfirmRoleChange = async () => {
    if (!roleChangeTarget) return;

    try {
      await dispatch(
        updateStaffRole({
          id: roleChangeTarget.id,
          role: selectedNewRole,
        })
      ).unwrap();
      setRoleChangeTarget(null);
      showNotification(`Updated role for ${roleChangeTarget.name} to ${RBACMatrix.getRoleConfig(selectedNewRole).label}.`);
    } catch (err: any) {
      alert(err || 'Failed to update role.');
    }
  };

  const handleConfirmStatusToggle = async () => {
    if (!statusChangeTarget) return;
    const newStatus = !statusChangeTarget.isActive;

    try {
      await dispatch(
        toggleStaffStatus({
          id: statusChangeTarget.id,
          isActive: newStatus,
        })
      ).unwrap();
      setStatusChangeTarget(null);
      showNotification(
        `Staff account for ${statusChangeTarget.name} has been ${newStatus ? 'reactivated' : 'suspended'}.`
      );
    } catch (err: any) {
      alert(err || 'Failed to update account status.');
    }
  };

  const showNotification = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => {
      setActionSuccessMessage(null);
    }, 4500);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Toast Notification */}
      {actionSuccessMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 100,
            background: '#005c55',
            color: '#ffffff',
            padding: '14px 20px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0, 92, 85, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: 600,
            fontSize: '0.9rem',
            animation: 'fadeIn 0.2s ease-in',
          }}
        >
          <CheckCircle2 size={20} />
          {actionSuccessMessage}
        </div>
      )}

      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#fef3f2',
                color: '#b42318',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <ShieldCheck size={14} />
              PRD §8 Access Control
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#e0f2fe',
                color: '#0369a1',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              <KeyRound size={13} />
              Role-Based Access Control
            </span>
          </div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#131b2e',
              letterSpacing: '-0.02em',
              margin: '0 0 6px 0',
            }}
          >
            Staff & Access Control
          </h1>
          <p style={{ margin: 0, color: '#475467', fontSize: '0.95rem' }}>
            Manage clinical operators, catalog supervisors, and administrative personnel with enterprise permission guardrails.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsMatrixModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 18px',
              background: '#ffffff',
              color: '#344054',
              border: '1px solid #d0d5dd',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(16, 24, 40, 0.05)',
            }}
          >
            <SlidersHorizontal size={16} />
            View RBAC Matrix
          </button>

          <button
            onClick={handleOpenAddModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 20px',
              background: '#b42318',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(180, 35, 24, 0.25)',
              transition: 'all 0.15s ease',
            }}
          >
            <UserPlus size={16} />
            Add Staff Member
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e4e7ec',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: '#475467', fontWeight: 600 }}>
                Total Operational Staff
              </p>
              <h2 style={{ margin: 0, fontSize: '2.1rem', fontWeight: 800, color: '#131b2e' }}>
                {totalStaff}
              </h2>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                background: '#eff8ff',
                color: '#175cd3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={24} />
            </div>
          </div>
          <div style={{ marginTop: '14px', fontSize: '0.8rem', color: '#005c55', fontWeight: 600 }}>
            ● {activeStaff} Active Accounts ({totalStaff - activeStaff} suspended)
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e4e7ec',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: '#475467', fontWeight: 600 }}>
                Super Administrators
              </p>
              <h2 style={{ margin: 0, fontSize: '2.1rem', fontWeight: 800, color: '#b42318' }}>
                {superAdmins}
              </h2>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                background: '#fef3f2',
                color: '#b42318',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={24} />
            </div>
          </div>
          <div style={{ marginTop: '14px', fontSize: '0.8rem', color: '#475467' }}>
            Master access with RBAC & Audit privileges
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e4e7ec',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: '#475467', fontWeight: 600 }}>
                Clinical Operations
              </p>
              <h2 style={{ margin: 0, fontSize: '2.1rem', fontWeight: 800, color: '#006398' }}>
                {opsStaff}
              </h2>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                background: '#f0f9ff',
                color: '#006398',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Briefcase size={24} />
            </div>
          </div>
          <div style={{ marginTop: '14px', fontSize: '0.8rem', color: '#475467' }}>
            Manages rental SLAs & patient care history
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e4e7ec',
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: '#475467', fontWeight: 600 }}>
                Content & Catalog
              </p>
              <h2 style={{ margin: 0, fontSize: '2.1rem', fontWeight: 800, color: '#6941c6' }}>
                {staffMembers.filter((s) => s.role === 'catalog_editor' || s.role === 'content_editor').length}
              </h2>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                background: '#faf5ff',
                color: '#6941c6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileEdit size={24} />
            </div>
          </div>
          <div style={{ marginTop: '14px', fontSize: '0.8rem', color: '#475467' }}>
            Biomedical taxonomy & Condition Guides CMS
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px 12px 0 0',
          padding: '20px 24px',
          border: '1px solid #e4e7ec',
          borderBottom: 'none',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 340px' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '420px',
            }}
          >
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#98a2b3',
              }}
            />
            <input
              type="text"
              placeholder="Search staff by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 42px',
                borderRadius: '8px',
                border: '1px solid #d0d5dd',
                fontSize: '0.9rem',
                outline: 'none',
                color: '#131b2e',
              }}
            />
          </div>
        </div>

        {/* Role Tabs */}
        <div
          style={{
            display: 'flex',
            background: '#f2f4f7',
            padding: '4px',
            borderRadius: '8px',
            gap: '4px',
            flexWrap: 'wrap',
          }}
        >
          {(
            [
              { key: 'all', label: 'All Roles' },
              { key: 'super_admin', label: 'Super Admin' },
              { key: 'operations_staff', label: 'Operations' },
              { key: 'catalog_editor', label: 'Catalog' },
              { key: 'content_editor', label: 'Content' },
            ] as const
          ).map((tab) => {
            const isSelected = roleFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setRoleFilter(tab.key)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 500,
                  background: isSelected ? '#ffffff' : 'transparent',
                  color: isSelected ? '#131b2e' : '#475467',
                  boxShadow: isSelected ? '0 1px 3px rgba(16, 24, 40, 0.1)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Status Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: '#475467', fontWeight: 600 }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #d0d5dd',
              background: '#ffffff',
              fontSize: '0.85rem',
              color: '#344054',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All ({staffMembers.length})</option>
            <option value="active">Active Only ({activeStaff})</option>
            <option value="suspended">Suspended ({totalStaff - activeStaff})</option>
          </select>
        </div>
      </div>

      {/* Staff Directory Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '0 0 12px 12px',
          border: '1px solid #e4e7ec',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(16, 24, 40, 0.05)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #eaecf0' }}>
                <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#475467', textTransform: 'uppercase' }}>
                  Staff Member
                </th>
                <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#475467', textTransform: 'uppercase' }}>
                  Assigned RBAC Role
                </th>
                <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#475467', textTransform: 'uppercase' }}>
                  Module Permissions
                </th>
                <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#475467', textTransform: 'uppercase' }}>
                  Account Status
                </th>
                <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#475467', textTransform: 'uppercase' }}>
                  Registered On
                </th>
                <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#475467', textTransform: 'uppercase', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && staffMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#667085' }}>
                    Loading staff directory...
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#667085' }}>
                    No staff members match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => {
                  const roleConfig = RBACMatrix.getRoleConfig(staff.role);
                  const isCurrentLoggedUser = Boolean(
                    currentUser &&
                    (currentUser.id === staff.id || (currentUser as any).uuid === staff.uuid)
                  );

                  // Extract initials
                  const initials = staff.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={staff.id}
                      style={{
                        borderBottom: '1px solid #eaecf0',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      {/* Name & Contact */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div
                            style={{
                              position: 'relative',
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              background: staff.role === 'super_admin' ? '#fef3f2' : '#f0f9ff',
                              color: staff.role === 'super_admin' ? '#b42318' : '#0284c7',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                            <span
                              style={{
                                position: 'absolute',
                                bottom: '0px',
                                right: '0px',
                                width: '11px',
                                height: '11px',
                                borderRadius: '50%',
                                background: staff.isActive ? '#12b76a' : '#d92d20',
                                border: '2px solid #ffffff',
                              }}
                            />
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 700, color: '#101828', fontSize: '0.95rem' }}>
                                {staff.name}
                              </span>
                              {isCurrentLoggedUser && (
                                <span
                                  style={{
                                    fontSize: '0.7rem',
                                    background: '#f2f4f7',
                                    color: '#344054',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                  }}
                                >
                                  You
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.82rem', color: '#475467', marginTop: '2px' }}>
                              {staff.email}
                              {staff.phone && <span> • {staff.phone}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: roleConfig.badgeBg,
                            color: roleConfig.badgeColor,
                            padding: '4px 10px',
                            borderRadius: '16px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                          }}
                        >
                          ● {roleConfig.label}
                        </span>
                      </td>

                      {/* Permissions Summary */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#131b2e' }}>
                            {roleConfig.permissions.length} Administrative Modules
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#667085' }}>
                            {staff.role === 'super_admin'
                              ? 'Full System Authority'
                              : roleConfig.permissions.join(', ')}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 20px' }}>
                        {staff.isActive ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: '#ecfdf3',
                              color: '#027a48',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            <CheckCircle2 size={13} />
                            Active
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: '#fef3f2',
                              color: '#b42318',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            <Lock size={13} />
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* Created At */}
                      <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: '#475467' }}>
                        {new Date(staff.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Action Buttons */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            onClick={() => {
                              setRoleChangeTarget(staff);
                              setSelectedNewRole(staff.role);
                            }}
                            title="Modify assigned role"
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              border: '1px solid #d0d5dd',
                              background: '#ffffff',
                              color: '#344054',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            <KeyRound size={13} />
                            Change Role
                          </button>

                          <button
                            onClick={() => setStatusChangeTarget(staff)}
                            disabled={Boolean(isCurrentLoggedUser && staff.role === 'super_admin')}
                            title={
                              isCurrentLoggedUser && staff.role === 'super_admin'
                                ? 'You cannot suspend your own account'
                                : staff.isActive
                                ? 'Suspend staff access'
                                : 'Restore staff access'
                            }
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              border: staff.isActive ? '1px solid #fedf89' : '1px solid #d0d5dd',
                              background: staff.isActive ? '#fffaeb' : '#f0fdf4',
                              color: staff.isActive ? '#b54708' : '#166534',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: isCurrentLoggedUser && staff.role === 'super_admin' ? 'not-allowed' : 'pointer',
                              opacity: isCurrentLoggedUser && staff.role === 'super_admin' ? 0.5 : 1,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            {staff.isActive ? <Lock size={13} /> : <Unlock size={13} />}
                            {staff.isActive ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD STAFF MEMBER */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(19, 27, 46, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              animation: 'slideUp 0.2s ease-out',
            }}
          >
            <div
              style={{
                padding: '24px',
                borderBottom: '1px solid #eaecf0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 800, color: '#131b2e' }}>
                  Register Staff Member
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#667085' }}>
                  Assign role-based permissions and provision operational credentials.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#98a2b3',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} style={{ padding: '24px' }}>
              {formError && (
                <div
                  style={{
                    background: '#fef3f2',
                    border: '1px solid #fecdca',
                    color: '#b42318',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <AlertTriangle size={16} />
                  {formError}
                </div>
              )}

              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#344054', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Priya Ramachandran"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #d0d5dd',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#344054', marginBottom: '6px' }}>
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="priya.r@aarogyamed.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #d0d5dd',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#344054', marginBottom: '6px' }}>
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #d0d5dd',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#344054', marginBottom: '6px' }}>
                    Assigned RBAC Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as StaffRole })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #d0d5dd',
                      fontSize: '0.9rem',
                      outline: 'none',
                      background: '#ffffff',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="operations_staff">Clinical Operations Staff (Rentals & Orders)</option>
                    <option value="catalog_editor">Catalog & Inventory Editor (Products & Categories)</option>
                    <option value="content_editor">Clinical Content Editor (Condition Guides CMS)</option>
                    <option value="super_admin">Super Administrator (Full System Authority)</option>
                  </select>
                  <div
                    style={{
                      marginTop: '8px',
                      padding: '10px 12px',
                      background: '#f8fafc',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      color: '#475467',
                    }}
                  >
                    <strong>Authority: </strong>
                    {RBACMatrix.getRoleConfig(formData.role).description}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#344054', marginBottom: '6px' }}>
                    Temporary Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 8 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 42px 10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #d0d5dd',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#98a2b3',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#98a2b3', marginTop: '4px', display: 'block' }}>
                    The staff member will be prompted to change this upon first login.
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '28px',
                  borderTop: '1px solid #eaecf0',
                  paddingTop: '20px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid #d0d5dd',
                    background: '#ffffff',
                    color: '#344054',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#b42318',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                    opacity: actionLoading ? 0.7 : 1,
                  }}
                >
                  {actionLoading ? 'Registering...' : 'Provision Staff Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CHANGE ROLE */}
      {roleChangeTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(19, 27, 46, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #eaecf0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#131b2e' }}>
                Reassign Role for {roleChangeTarget.name}
              </h3>
              <button
                onClick={() => setRoleChangeTarget(null)}
                style={{ background: 'none', border: 'none', color: '#98a2b3', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#475467' }}>
                Select the new administrative authority level for <strong>{roleChangeTarget.email}</strong>:
              </p>

              <div style={{ display: 'grid', gap: '10px' }}>
                {(['super_admin', 'catalog_editor', 'operations_staff', 'content_editor'] as StaffRole[]).map(
                  (role) => {
                    const cfg = RBACMatrix.getRoleConfig(role);
                    const isSelected = selectedNewRole === role;
                    return (
                      <div
                        key={role}
                        onClick={() => setSelectedNewRole(role)}
                        style={{
                          padding: '14px 16px',
                          borderRadius: '10px',
                          border: isSelected ? `2px solid ${cfg.badgeColor}` : '1px solid #d0d5dd',
                          background: isSelected ? cfg.badgeBg : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: cfg.badgeColor }}>
                            {cfg.label}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#667085', marginTop: '2px' }}>
                            {cfg.description}
                          </div>
                        </div>
                        {isSelected && <Check size={18} color={cfg.badgeColor} />}
                      </div>
                    );
                  }
                )}
              </div>

              {Boolean(
                currentUser &&
                  (currentUser.id === roleChangeTarget.id ||
                    (currentUser as any).uuid === roleChangeTarget.uuid) &&
                  selectedNewRole !== 'super_admin'
              ) && (
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '12px',
                      background: '#fef3f2',
                      borderRadius: '8px',
                      border: '1px solid #fecdca',
                      color: '#b42318',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <AlertTriangle size={16} />
                    Guardrail Alert: You cannot demote your own Super Admin account.
                  </div>
                )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '24px',
                  borderTop: '1px solid #eaecf0',
                  paddingTop: '18px',
                }}
              >
                <button
                  onClick={() => setRoleChangeTarget(null)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d0d5dd',
                    background: '#ffffff',
                    color: '#344054',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRoleChange}
                  disabled={actionLoading}
                  style={{
                    padding: '9px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#006398',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  {actionLoading ? 'Updating...' : 'Save New Role'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: TOGGLE STATUS */}
      {statusChangeTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(19, 27, 46, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              padding: '24px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: statusChangeTarget.isActive ? '#fef3f2' : '#ecfdf3',
                color: statusChangeTarget.isActive ? '#b42318' : '#027a48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              {statusChangeTarget.isActive ? <Lock size={24} /> : <Unlock size={24} />}
            </div>

            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800, color: '#131b2e' }}>
              {statusChangeTarget.isActive
                ? `Suspend Account for ${statusChangeTarget.name}?`
                : `Reactivate Account for ${statusChangeTarget.name}?`}
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.88rem', color: '#475467', lineHeight: 1.5 }}>
              {statusChangeTarget.isActive
                ? `This will immediately invalidate operational session tokens for ${statusChangeTarget.email}. They will no longer be able to access the admin portal until reactivated.`
                : `This will restore administrative portal access for ${statusChangeTarget.email}.`}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setStatusChangeTarget(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d0d5dd',
                  background: '#ffffff',
                  color: '#344054',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusToggle}
                disabled={actionLoading}
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: statusChangeTarget.isActive ? '#b42318' : '#027a48',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                {actionLoading
                  ? 'Updating...'
                  : statusChangeTarget.isActive
                  ? 'Confirm Suspension'
                  : 'Reactivate Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: RBAC PERMISSIONS MATRIX */}
      {isMatrixModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(19, 27, 46, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '850px',
              width: '100%',
              maxHeight: '90vh',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #eaecf0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 800, color: '#131b2e' }}>
                  Enterprise RBAC Permissions Matrix
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#667085' }}>
                  Granular role-to-module mapping across all 7 AarogyaMed administrative panels.
                </p>
              </div>
              <button
                onClick={() => setIsMatrixModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#98a2b3', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '2px solid #eaecf0' }}>
                    <th style={{ padding: '12px 16px', fontSize: '0.78rem', fontWeight: 700, color: '#475467' }}>
                      Admin Module / Function
                    </th>
                    {(['super_admin', 'catalog_editor', 'operations_staff', 'content_editor'] as StaffRole[]).map(
                      (role) => {
                        const cfg = RBACMatrix.getRoleConfig(role);
                        return (
                          <th
                            key={role}
                            style={{
                              padding: '12px 16px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: cfg.badgeColor,
                              textAlign: 'center',
                            }}
                          >
                            {cfg.label}
                          </th>
                        );
                      }
                    )}
                  </tr>
                </thead>
                <tbody>
                  {RBACMatrix.ALL_PERMISSIONS.map((perm) => (
                    <tr key={perm.key} style={{ borderBottom: '1px solid #eaecf0' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#101828' }}>
                          {perm.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#667085' }}>
                          Module: {perm.module}
                        </div>
                      </td>
                      {(['super_admin', 'catalog_editor', 'operations_staff', 'content_editor'] as StaffRole[]).map(
                        (role) => {
                          const hasAccess = RBACMatrix.hasPermission(role, perm.key);
                          const cfg = RBACMatrix.getRoleConfig(role);
                          return (
                            <td key={role} style={{ padding: '14px 16px', textAlign: 'center' }}>
                              {hasAccess ? (
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: cfg.badgeBg,
                                    color: cfg.badgeColor,
                                  }}
                                >
                                  <Check size={14} strokeWidth={3} />
                                </span>
                              ) : (
                                <span style={{ color: '#d0d5dd' }}>
                                  <Minus size={16} />
                                </span>
                              )}
                            </td>
                          );
                        }
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                style={{
                  marginTop: '20px',
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  color: '#475467',
                  lineHeight: 1.5,
                }}
              >
                <strong>Security Invariant (PRD §8)</strong>: Super Admin has unconditional authorization across all endpoints. Operations Staff manage rental operations, equipment return SLAs, and patient care history without dealer workflows (Invariant 4). Catalog Editors manage medical inventory and bilingual specs. Content Editors manage clinical condition guides.
              </div>
            </div>

            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #eaecf0',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setIsMatrixModalOpen(false)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: '1px solid #d0d5dd',
                  background: '#ffffff',
                  color: '#344054',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
