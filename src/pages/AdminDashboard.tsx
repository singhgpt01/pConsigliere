import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  getCommodities,
  deleteCommodity,
  toggleCommodityStatus,
  updateCommodityOrder,
  seedDefaultCommodities,
  type AdminCommodity
} from '../services/commodityService';
import {
  getEnquiries,
  deleteEnquiry,
  markEnquiryAsSeen,
  markAllEnquiriesAsSeen,
  type EnquiryRecord
} from '../services/enquiryService';
import {
  getSettings,
  addAdminEmail,
  removeAdminEmail,
  updateSettings,
  DEFAULT_SETTINGS
} from '../services/settingsService';
import { CommodityForm } from '../components/admin/CommodityForm';
import { THEME_MAP, type ThemeDefinition } from '../themeConfig';
import {
  Building2,
  Clock,
  MapPin,
  Share2,
  LogOut,
  ShieldAlert,
  Search,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, loading, isAdmin, isSuperAdmin, isConfigured, login, loginWithEmailPassword, logout } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'commodities' | 'enquiries' | 'users' | 'settings'>('commodities');
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Data States
  const [commodities, setCommodities] = useState<AdminCommodity[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [adminList, setAdminList] = useState<string[]>([]);
  const [superAdmins, setSuperAdmins] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState<'idle' | 'processing'>('idle');

  // Commodity Editing
  const [editingCommodity, setEditingCommodity] = useState<AdminCommodity | null>(null);

  // Enquiry Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState<'all' | 'form' | 'direct' | 'call'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'replied' | 'unreplied'>('all');

  // Site Settings Form States
  const [sitePhone, setSitePhone] = useState(DEFAULT_SETTINGS.sitePhone);
  const [siteEmail, setSiteEmail] = useState(DEFAULT_SETTINGS.siteEmail);
  const [deskEmail, setDeskEmail] = useState(DEFAULT_SETTINGS.deskEmail);
  const [siteAddress, setSiteAddress] = useState(DEFAULT_SETTINGS.siteAddress);
  const [workingHours, setWorkingHours] = useState(DEFAULT_SETTINGS.workingHours);
  const [isDeskOpen, setIsDeskOpen] = useState(DEFAULT_SETTINGS.isDeskOpen);
  const [mapUrl, setMapUrl] = useState(DEFAULT_SETTINGS.mapUrl);
  const [socialWa, setSocialWa] = useState(DEFAULT_SETTINGS.socialWa);
  const [socialLinked, setSocialLinked] = useState(DEFAULT_SETTINGS.socialLinked);
  const [socialWeb, setSocialWeb] = useState(DEFAULT_SETTINGS.socialWeb);

  // Email/Password login modal/form states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  // Theme preset
  const [themeKey, setThemeKey] = useState<string>(() => localStorage.getItem('ch-adm-theme') || 'GOLD');

  // Custom Modal System
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'confirm' | 'alert';
    onConfirm: (() => void) | null;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm',
    onConfirm: null
  });

  const showAlert = (title: string, message: string) => {
    setModalConfig({ isOpen: true, title, message, type: 'alert', onConfirm: null });
  };

  const confirmAction = (title: string, message: string, onConfirm: () => void) => {
    setModalConfig({ isOpen: true, title, message, type: 'confirm', onConfirm });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const unreadCount = enquiries.filter(q => !q.isSeen).length;

  // Filtered inquiries calculation
  const filteredEnquiries = enquiries.filter(q => {
    const s = searchQuery.toLowerCase().trim();
    const matchesSearch = !searchQuery ||
      (q.fullName && q.fullName.toLowerCase().includes(s)) ||
      (q.companyName && q.companyName.toLowerCase().includes(s)) ||
      (q.businessEmail && q.businessEmail.toLowerCase().includes(s)) ||
      (q.commodity && q.commodity.toLowerCase().includes(s)) ||
      (q.destination && q.destination.toLowerCase().includes(s)) ||
      (q.description && q.description.toLowerCase().includes(s));

    if (!matchesSearch) return false;

    const matchesSource = filterSource === 'all' || q.source === filterSource;
    let matchesStatus = true;
    if (filterStatus === 'replied') matchesStatus = q.isSeen === true;
    else if (filterStatus === 'unreplied') matchesStatus = q.isSeen === false;

    return matchesSource && matchesStatus;
  }).sort((a, b) => {
    if (a.isSeen !== b.isSeen) {
      return a.isSeen ? 1 : -1;
    }
    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return timeB - timeA;
  });

  const fetchAdminCommodities = async () => {
    setIsDataLoading(true);
    try {
      const data = await getCommodities(true);
      setCommodities(data);
    } catch (err) {
      console.error('[AdminDashboard] Error fetching commodities:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchAdminEnquiries = async () => {
    setIsDataLoading(true);
    try {
      const data = await getEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error('[AdminDashboard] Error fetching inquiries:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchSiteSettings = async () => {
    setIsDataLoading(true);
    try {
      const s = await getSettings();
      setAdminList(s.adminEmails || []);
      setSuperAdmins(s.superAdminEmails || []);
      setMapUrl(s.mapUrl || '');
      setSitePhone(s.sitePhone || '');
      setSiteEmail(s.siteEmail || '');
      setDeskEmail(s.deskEmail || '');
      setSiteAddress(s.siteAddress || '');
      setWorkingHours(s.workingHours || '');
      setIsDeskOpen(s.isDeskOpen !== undefined ? s.isDeskOpen : true);
      setSocialWa(s.socialWa || '');
      setSocialLinked(s.socialLinked || '');
      setSocialWeb(s.socialWeb || '');
    } catch (err) {
      console.error('[AdminDashboard] Error fetching settings:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminCommodities();
      fetchAdminEnquiries();
      if (isSuperAdmin) {
        fetchSiteSettings();
      }
    }
  }, [isAdmin, isSuperAdmin]);

  // Commodity Handlers
  const handleDeleteCommodity = (id: string, name: string) => {
    confirmAction(
      'Delete Commodity Specification',
      `Are you sure you want to permanently delete "${name}" from the trading portfolio?`,
      async () => {
        setActionStatus('processing');
        try {
          await deleteCommodity(id);
          fetchAdminCommodities();
        } catch (err) {
          console.error(err);
          showAlert('Error', 'Failed to delete commodity. Verify your administrator permissions.');
        } finally {
          setActionStatus('idle');
        }
      }
    );
  };

  const handleToggleCommodityStatus = async (id: string, currentDisabled: boolean | undefined) => {
    setActionStatus('processing');
    try {
      await toggleCommodityStatus(id, !currentDisabled);
      await fetchAdminCommodities();
    } catch (err) {
      console.error('Status toggle error:', err);
      showAlert('Error', 'Failed to change commodity visibility.');
    } finally {
      setActionStatus('idle');
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === commodities.length - 1) return;

    setActionStatus('processing');
    const newItems = [...commodities];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

    try {
      const updates = newItems.map((item, i) => ({
        id: item.id,
        displayOrder: i * 10
      }));
      await updateCommodityOrder(updates);
      setCommodities(newItems);
    } catch (err) {
      console.error('Reorder error:', err);
      showAlert('Error', 'Failed to update commodity ordering.');
    } finally {
      setActionStatus('idle');
    }
  };

  const handleSeedDefaults = async () => {
    confirmAction(
      'Seed Default Trading Portfolio',
      'This will populate your Firestore "commodities" collection with the 9 verified standard commodities (EN590, Jet Fuel, LNG, ESPO, Urea, Sulphur, Sugar, Wheat, Corn). Proceed?',
      async () => {
        setActionStatus('processing');
        try {
          await seedDefaultCommodities();
          await fetchAdminCommodities();
          showAlert('Success', 'Default portfolio commodities seeded successfully into Firestore!');
        } catch (err: any) {
          console.error(err);
          showAlert('Error', 'Failed to seed default commodities. Verify your Firestore connection.');
        } finally {
          setActionStatus('idle');
        }
      }
    );
  };

  // Enquiry Handlers
  const handleDeleteEnquiry = (id: string) => {
    confirmAction(
      'Delete Commercial Enquiry',
      'Are you sure you want to delete this enquiry record? This action cannot be undone.',
      async () => {
        const previousEnquiries = [...enquiries];
        setEnquiries(prev => prev.filter(q => q.id !== id));
        try {
          await deleteEnquiry(id);
        } catch (err) {
          showAlert('Error', 'Failed to delete enquiry from database.');
          setEnquiries(previousEnquiries);
        }
      }
    );
  };

  const handleMarkAsReplied = async (id: string) => {
    setEnquiries(prev => prev.map(q => q.id === id ? { ...q, isSeen: true } : q));
    try {
      await markEnquiryAsSeen(id);
    } catch (err) {
      console.error('Failed to mark enquiry as replied:', err);
      fetchAdminEnquiries();
    }
  };

  const handleMarkAllAsReplied = () => {
    const unseenIds = enquiries.filter(q => !q.isSeen).map(q => q.id);
    if (unseenIds.length === 0) return;

    confirmAction(
      'Batch Confirmation',
      `Mark all ${unseenIds.length} new commercial inquiries as replied?`,
      async () => {
        setEnquiries(prev => prev.map(q => ({ ...q, isSeen: true })));
        try {
          await markAllEnquiriesAsSeen(unseenIds);
        } catch (err) {
          console.error('Failed to mark all as replied:', err);
          fetchAdminEnquiries();
        }
      }
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Users Handlers
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    setActionStatus('processing');
    try {
      await addAdminEmail(newAdminEmail.trim());
      setNewAdminEmail('');
      await fetchSiteSettings();
      showAlert('Success', `Authorized ${newAdminEmail} as standard administrator.`);
    } catch (err: any) {
      showAlert('Error', 'Failed to add administrator. Ensure your account is a Superadmin.');
    } finally {
      setActionStatus('idle');
    }
  };

  const handleRemoveAdmin = (email: string) => {
    if (superAdmins.some(sa => sa.toLowerCase() === email.toLowerCase())) {
      showAlert('Restricted Action', 'Cannot remove a Superadministrator through this dashboard.');
      return;
    }

    confirmAction(
      'Revoke Administrator Access',
      `Are you sure you want to revoke administrative permissions for "${email}"?`,
      async () => {
        try {
          await removeAdminEmail(email);
          fetchSiteSettings();
          showAlert('Success', `Revoked access for ${email}.`);
        } catch (err) {
          console.error(err);
          showAlert('Error', 'Failed to revoke administrator.');
        }
      }
    );
  };

  // Settings Handlers
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionStatus('processing');
    try {
      await updateSettings({
        mapUrl,
        sitePhone,
        siteEmail,
        deskEmail,
        siteAddress,
        workingHours,
        isDeskOpen,
        socialWa,
        socialLinked,
        socialWeb
      });
      showAlert('Success', 'Commercial desk and site settings synchronized successfully!');
    } catch (err) {
      console.error(err);
      showAlert('Error', 'Failed to update site settings in Firestore.');
    } finally {
      setActionStatus('idle');
    }
  };

  // Login handler
  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      await loginWithEmailPassword(emailInput.trim(), passwordInput);
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Check your email & password.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError(null);
    try {
      await login();
    } catch (err: any) {
      setLoginError(err.message || 'Google authentication was cancelled or encountered an error.');
    }
  };

  // Active Theme Selection
  const activeTheme: ThemeDefinition = THEME_MAP[themeKey] || THEME_MAP.GOLD;

  // Render Gatekeeper if loading
  if (loading) {
    return (
      <div className="admin-portal-login" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D0D', color: '#FAF8F3' }}>
        <div style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>CONSIGLIERE HOLDINGS</div>
          <div style={{ fontSize: '0.85rem', color: '#B99A62', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Verifying Security Credentials...</div>
        </div>
      </div>
    );
  }

  // Render Gatekeeper if unauthenticated
  if (!user) {
    return (
      <div className="admin-portal-login">
        <div className="gatekeeper-card">
          <div className="admin-logo" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
            <span className="logo-box">CH</span>
            <span className="logo-text">ADMIN PORTAL</span>
          </div>

          <h2 className="gatekeeper-title">RESTRICTED COMMERCIAL DESK</h2>

          <div className="legal-warning mb-2">
            <p className="small"><strong>RESTRICTED ACCESS — AUTHORIZED PERSONNEL ONLY</strong></p>
            <p className="small">
              This system contains confidential commercial commodity transaction records and counterparty communications.
              Unauthorized access attempts are logged and may be subject to civil and criminal penalties.
            </p>
          </div>

          {!isConfigured && (
            <div className="config-banner mb-2">
              <strong>Firebase Setup Note:</strong> Firebase environment credentials are not detected in <code>.env</code>. Review <code>ADMIN_SETUP.md</code> to connect your Firebase project.
            </div>
          )}

          {loginError && (
            <div className="security-note-box mb-2" style={{ borderLeftColor: 'var(--adm-del)', padding: '0.75rem', width: '100%' }}>
              <div className="security-header" style={{ color: '#cc0000', margin: 0 }}>
                <ShieldAlert size={14} />
                <span>{loginError}</span>
              </div>
            </div>
          )}

          <p className="mb-3 text-muted" style={{ fontSize: '0.85rem', textAlign: 'center' }}>
            Sign in with an authorized corporate account to access the administration desk.
          </p>

          <button
            onClick={handleGoogleLogin}
            className="button-primary w-100 mb-2"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.85rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <div style={{ textAlign: 'center', margin: '0.75rem 0' }}>
            <button
              type="button"
              onClick={() => setShowEmailLogin(!showEmailLogin)}
              style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer' }}
            >
              {showEmailLogin ? 'Hide Email / Password option' : 'Sign in with Email & Password'}
            </button>
          </div>

          {showEmailLogin && (
            <form onSubmit={handleEmailPasswordSubmit} style={{ marginTop: '0.5rem', textAlign: 'left' }}>
              <div className="form-group mb-1">
                <label className="section-title-xs" style={{ margin: '0.3rem 0' }}>ADMIN EMAIL</label>
                <input
                  type="email"
                  placeholder="admin@consigliereholdings.com"
                  required
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  className="modern-input"
                />
              </div>
              <div className="form-group mb-2">
                <label className="section-title-xs" style={{ margin: '0.3rem 0' }}>PASSWORD</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  className="modern-input"
                />
              </div>
              <button type="submit" className="button-primary w-100" style={{ padding: '0.75rem' }}>
                Authenticate with Email
              </button>
            </form>
          )}

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem', textAlign: 'center' }}>
            <a href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}>
              ← Return to Consigliere Holdings Public Site
            </a>
          </div>
        </div>

        <style>{`
          .admin-portal-login {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #141414;
            padding: 1.5rem;
            font-family: 'Inter', system-ui, sans-serif;
          }
          .gatekeeper-card {
            background: #FFFFFF;
            border: 2px solid #0D0D0D;
            box-shadow: 10px 10px 0px #0D0D0D;
            width: 100%;
            max-width: 440px;
            padding: 2.25rem;
          }
          .gatekeeper-title {
            font-size: 1.15rem;
            font-weight: 900;
            text-align: center;
            letter-spacing: 0.05em;
            margin-bottom: 1.25rem;
            color: #0D0D0D;
          }
          .legal-warning {
            background: #FFF8F0;
            border: 1px solid #0D0D0D;
            border-left: 4px solid #B99A62;
            padding: 0.85rem 1rem;
            margin-bottom: 1.25rem;
          }
          .legal-warning.error {
            background: #FFF0F0;
            border-left-color: #CC0000;
          }
          .legal-warning p {
            margin: 0;
            font-size: 0.75rem;
            color: #555;
            line-height: 1.45;
          }
          .legal-warning p strong {
            color: #111;
            display: block;
            margin-bottom: 0.25rem;
          }
          .config-banner {
            background: #EDF2F7;
            border: 1px dashed #4A5568;
            padding: 0.75rem;
            font-size: 0.72rem;
            color: #2D3748;
            line-height: 1.4;
          }
          .logo-box {
            background: #0D0D0D;
            color: white;
            padding: 0.25rem 0.6rem;
            font-size: 1.1rem;
            font-weight: 900;
            letter-spacing: 0.05em;
          }
          .logo-text {
            font-size: 1rem;
            font-weight: 800;
            margin-left: 0.75rem;
            letter-spacing: 0.08em;
            color: #0D0D0D;
          }
          .button-primary {
            background: #B99A62;
            color: white;
            font-weight: 800;
            border: 1px solid #0D0D0D;
            cursor: pointer;
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 0.05em;
            transition: all 0.15s;
          }
          .button-primary:hover {
            background: #0D0D0D;
            color: white;
            transform: translate(-2px, -2px);
            box-shadow: 4px 4px 0px #B99A62;
          }
          .w-100 { width: 100%; }
          .mb-1 { margin-bottom: 0.5rem; }
          .mb-2 { margin-bottom: 1rem; }
          .mb-3 { margin-bottom: 1.5rem; }
          .modern-input {
            width: 100%;
            border: 1px solid #0D0D0D;
            padding: 0.6rem 0.75rem;
            font-size: 0.85rem;
            box-sizing: border-box;
          }
        `}</style>
      </div>
    );
  }

  // Render Unauthorized Screen if signed in but not on admin list
  if (!isAdmin) {
    return (
      <div className="admin-portal-login">
        <div className="gatekeeper-card">
          <div className="admin-logo" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
            <span className="logo-box" style={{ background: '#CC0000' }}>CH</span>
            <span className="logo-text">ACCESS DENIED</span>
          </div>

          <h2 className="gatekeeper-title" style={{ color: '#CC0000' }}>UNAUTHORIZED ACCOUNT</h2>

          <div className="legal-warning error mb-3">
            <p className="small"><strong>ACCESS RESTRICTED</strong></p>
            <p className="small">
              Your signed-in account (<strong>{user.email}</strong>) does not have administrative privileges for the Consigliere Holdings trading desk.
            </p>
          </div>

          <div className="config-banner mb-3">
            <strong>Administrator Provisioning:</strong>
            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.72rem' }}>
              To authorize this account, have an existing Superadmin add <code>{user.email}</code> to the <code>adminEmails</code> list in Firestore collection <code>settings/site</code>, or configure it in <code>DEFAULT_SETTINGS.superAdminEmails</code> in <code>settingsService.ts</code>.
            </p>
          </div>

          <button onClick={logout} className="button-primary w-100 mb-2" style={{ padding: '0.85rem' }}>
            Sign Out
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <a href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '0.75rem' }}>
              ← Return to Public Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div
      className="admin-dashboard-page"
      style={{
        '--adm-p': activeTheme.primary,
        '--adm-p-l': activeTheme.primaryLight,
        '--adm-bg': activeTheme.bgMain,
        '--adm-card': activeTheme.bgCard,
        '--adm-head': activeTheme.bgHeader,
        '--adm-radius': activeTheme.radius,
        '--adm-text': activeTheme.textMain,
        '--adm-muted': activeTheme.textMuted,
        '--adm-text-l': activeTheme.textLight,
        '--adm-text-h': activeTheme.textHeading,
        '--adm-border': activeTheme.borderMain,
        '--adm-border-m': activeTheme.borderMuted,
        '--adm-border-l': activeTheme.borderLight,
        '--adm-scroll': activeTheme.scrollbarTrack,
        '--adm-new-t': activeTheme.status.newText,
        '--adm-new-bg': activeTheme.status.newBg,
        '--adm-rep-t': activeTheme.status.repliedText,
        '--adm-rep-bg': activeTheme.status.repliedBg,
        '--adm-rep-body': activeTheme.status.repliedBody,
        '--adm-rep-bor': activeTheme.status.repliedBorder,
        '--adm-del': activeTheme.status.delete,
        '--adm-del-h': activeTheme.status.deleteHover,
        '--adm-pop-t': activeTheme.sources.popup.text,
        '--adm-pop-bg': activeTheme.sources.popup.bg,
        '--adm-pop-bor': activeTheme.sources.popup.border,
        '--adm-form-t': activeTheme.sources.form.text,
        '--adm-form-bg': activeTheme.sources.form.bg,
        '--adm-form-bor': activeTheme.sources.form.border,
        '--adm-call-t': activeTheme.sources.call.text,
        '--adm-call-bg': activeTheme.sources.call.bg,
        '--adm-call-bor': activeTheme.sources.call.border,
        '--adm-h-tab': activeTheme.hover.tab,
        '--adm-h-filter': activeTheme.hover.filter,
        '--adm-h-light': activeTheme.hover.bgLight
      } as React.CSSProperties}
    >
      {/* Header */}
      <header className="admin-header">
        <button
          className="menu-toggle"
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-label="Toggle navigation"
        >
          <div className={`hamburger ${isNavOpen ? 'open' : ''}`}>
            <span></span><span></span><span></span>
          </div>
        </button>

        <div className="admin-logo">
          <span className="logo-box">CH</span>
          <span className="logo-text">ADMIN DESK</span>
        </div>

        {isNavOpen && <div className="nav-overlay" onClick={() => setIsNavOpen(false)}></div>}

        <div className={`admin-nav-main ${isNavOpen ? 'mobile-open' : ''}`}>
          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeTab === 'commodities' ? 'active' : ''}`}
              onClick={() => { setActiveTab('commodities'); setIsNavOpen(false); }}
            >
              COMMODITIES
            </button>
            <button
              className={`tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
              onClick={() => { setActiveTab('enquiries'); setIsNavOpen(false); }}
            >
              ENQUIRIES {unreadCount > 0 && <span className="new-tag">{unreadCount} NEW</span>}
            </button>
            {isSuperAdmin && (
              <button
                className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => { setActiveTab('users'); setIsNavOpen(false); }}
              >
                STAFF & ACCESS
              </button>
            )}
            {isSuperAdmin && (
              <button
                className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => { setActiveTab('settings'); setIsNavOpen(false); }}
              >
                DESK SETTINGS
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="action-btn pro"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
              title="Open Public Site in New Tab"
            >
              <ExternalLink size={13} />
              LIVE SITE
            </a>
            <button
              onClick={logout}
              className="action-btn pro"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <LogOut size={13} />
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          TAB 1: COMMODITIES (PORTFOLIO SPECIFICATION MANAGEMENT)
          ===================================================================== */}
      {activeTab === 'commodities' ? (
        <div className="admin-grid">
          {/* Left Panel: Add/Edit Commodity Form */}
          <div className="admin-panel glass-card">
            <h3 className="left-panel-title">
              {editingCommodity ? 'EDIT COMMODITY SPECIFICATION' : 'NEW COMMODITY SPECIFICATION'}
            </h3>
            <p className="small text-muted mb-2">
              {editingCommodity
                ? `Modifying "${editingCommodity.name}"`
                : 'Publish or update commercial specifications in the global trading portfolio.'}
            </p>

            <CommodityForm
              onCommoditySaved={() => {
                fetchAdminCommodities();
                setEditingCommodity(null);
              }}
              editingCommodity={editingCommodity}
              onCancel={() => setEditingCommodity(null)}
            />
          </div>

          {/* Right Panel: Commodity List */}
          <div className="admin-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h3 className="section-title" style={{ margin: 0 }}>COMMODITY TRADING PORTFOLIO</h3>

              {commodities.length === 0 && !isDataLoading && (
                <button
                  onClick={handleSeedDefaults}
                  disabled={actionStatus === 'processing'}
                  className="action-btn-pro"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Sparkles size={13} />
                  SEED 9 DEFAULT COMMODITIES
                </button>
              )}
            </div>

            <div className="messages-list">
              {commodities.length === 0 && !isDataLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <p className="text-muted" style={{ marginBottom: '1rem' }}>No commodities registered in Firestore.</p>
                  <button onClick={handleSeedDefaults} className="button-primary">
                    Seed Standard 9 Commodities
                  </button>
                </div>
              ) : (
                commodities.map((item, index) => (
                  <div key={item.id} className={`message-card ${item.isDisabled ? 'seen' : ''}`}>
                    <div className="message-header" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      {/* Monogram/Category Badge */}
                      <div
                        style={{
                          width: '54px',
                          height: '54px',
                          border: '1px solid var(--adm-text)',
                          background: item.category === 'energy' ? 'rgba(185, 154, 98, 0.15)' : item.category === 'industrial' ? 'rgba(62, 92, 118, 0.15)' : 'rgba(42, 114, 100, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '0.85rem',
                          color: 'var(--adm-text)',
                          flexShrink: 0
                        }}
                      >
                        {item.category === 'energy' ? 'EN' : item.category === 'industrial' ? 'IND' : 'AGR'}
                      </div>

                      {/* Content Area */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                          <span className={`badge-pro ${item.isDisabled ? 'muted' : 'active'}`} style={{ fontSize: '0.65rem' }}>
                            {item.isDisabled ? 'PAUSED / HIDDEN' : 'ACTIVE / VISIBLE'}
                          </span>
                          <span className="source-tag" style={{ borderStyle: 'dashed' }}>
                            {item.categoryLabel?.toUpperCase() || item.category.toUpperCase()}
                          </span>
                          {item.featured && (
                            <span className="source-tag popup" style={{ borderStyle: 'solid' }}>
                              FEATURED HERO
                            </span>
                          )}
                          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>
                            {item.name}
                          </h4>
                        </div>

                        {item.tagline && (
                          <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.8rem', color: 'var(--adm-muted)' }}>
                            {item.tagline}
                          </p>
                        )}

                        {/* Specs Chips */}
                        {item.specs && item.specs.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.35rem' }}>
                            {item.specs.slice(0, 3).map((sp, sIdx) => (
                              <span
                                key={sIdx}
                                style={{
                                  fontSize: '0.7rem',
                                  padding: '0.15rem 0.4rem',
                                  background: 'var(--adm-h-light)',
                                  border: '1px solid var(--adm-border-l)',
                                  color: 'var(--adm-text)'
                                }}
                              >
                                <strong>{sp.label}:</strong> {sp.val}
                              </span>
                            ))}
                            {item.specs.length > 3 && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--adm-muted)' }}>
                                +{item.specs.length - 3} more specs
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right Side: Reorder & Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
                        <div className="order-controls">
                          <button
                            className="order-btn"
                            disabled={index === 0 || actionStatus === 'processing'}
                            onClick={() => handleReorder(index, 'up')}
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button
                            className="order-btn"
                            disabled={index === commodities.length - 1 || actionStatus === 'processing'}
                            onClick={() => handleReorder(index, 'down')}
                            title="Move Down"
                          >
                            ▼
                          </button>
                        </div>

                        <div className="action-btns" style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            onClick={() => setEditingCommodity(item)}
                            disabled={actionStatus === 'processing'}
                            className="action-btn-pro"
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => handleToggleCommodityStatus(item.id, item.isDisabled)}
                            disabled={actionStatus === 'processing'}
                            className="action-btn-pro"
                          >
                            {item.isDisabled ? 'ENABLE' : 'HIDE'}
                          </button>
                          <button
                            onClick={() => handleDeleteCommodity(item.id, item.name)}
                            disabled={actionStatus === 'processing'}
                            className="action-btn-pro delete"
                          >
                            DEL
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : activeTab === 'enquiries' ? (
        /* =====================================================================
           TAB 2: ENQUIRIES (COMMERCIAL MESSAGES & RFQs)
           ===================================================================== */
        <div className="admin-grid">
          {/* Left Panel: Search & Filters */}
          <div className="admin-panel glass-card p-2">
            <h3 className="left-panel-title">FILTERS & SEARCH</h3>
            <p className="small text-muted mb-2">Track counterparty inquiries and commodity supply requirements.</p>

            <div className="filter-manager">
              <label className="section-title-xs">
                <Search size={12} /> SEARCH INQUIRIES
              </label>
              <div className="form-group mb-2">
                <input
                  type="text"
                  placeholder="Company, name, email, port..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="modern-input"
                  autoComplete="off"
                />
              </div>

              <label className="section-title-xs">FILTER BY STATUS</label>
              <div className="source-filter-bar mb-2">
                <button
                  className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('all')}
                >
                  All ({enquiries.length})
                </button>
                <button
                  className={`filter-btn ${filterStatus === 'unreplied' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('unreplied')}
                >
                  New ({unreadCount})
                </button>
                <button
                  className={`filter-btn ${filterStatus === 'replied' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('replied')}
                >
                  Replied ({enquiries.length - unreadCount})
                </button>
              </div>

              <label className="section-title-xs">FILTER BY SOURCE</label>
              <div className="source-filter-bar mb-2">
                <button
                  className={`filter-btn ${filterSource === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterSource('all')}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${filterSource === 'form' ? 'active' : ''}`}
                  onClick={() => setFilterSource('form')}
                >
                  RFQ Form
                </button>
                <button
                  className={`filter-btn ${filterSource === 'direct' ? 'active' : ''}`}
                  onClick={() => setFilterSource('direct')}
                >
                  Direct Desk
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsReplied}
                  disabled={actionStatus === 'processing'}
                  className="button-primary mt-2 w-100"
                >
                  MARK ALL AS REPLIED ({unreadCount})
                </button>
              )}
            </div>
          </div>

          {/* Right Panel: Inquiries Feed */}
          <div className="admin-panel">
            <h3 className="section-title">COMMERCIAL INQUIRIES & COUNTERPARTY LEADS</h3>

            <div className="messages-list">
              {filteredEnquiries.length === 0 && !isDataLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <p className="text-muted">No commercial inquiries matching your current criteria.</p>
                </div>
              ) : (
                filteredEnquiries.map(q => (
                  <div key={q.id} className={`message-card ${q.isSeen ? 'seen' : 'unseen'}`}>
                    <div className="message-header">
                      <div className="header-left">
                        <h4 className="name-title">
                          {q.fullName}
                          {!q.isSeen && <span className="new-tag">NEW RFQ</span>}
                          <span className="source-tag form">{q.companyName || 'Corporate Entity'}</span>
                          {q.country && <span className="source-tag" style={{ borderStyle: 'dotted' }}>📍 {q.country}</span>}
                        </h4>

                        <div className="contact-info">
                          {q.businessEmail && q.businessEmail !== 'Not provided' && (
                            <span className="email" style={{ display: 'flex', alignItems: 'center' }}>
                              <span>{q.businessEmail}</span>
                              <button
                                className="copy-badge"
                                onClick={() => copyToClipboard(q.businessEmail)}
                                title="Copy Email"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10">
                                  <rect x="9" y="9" width="13" height="13" rx="1" ry="1"></rect>
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                              </button>
                            </span>
                          )}

                          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, color: 'var(--adm-text)' }}>
                              Commodity: <strong>{q.commodity}</strong>
                            </span>
                            {q.quantity && <span>Volume: <strong>{q.quantity}</strong></span>}
                            {q.deliveryTerms && <span>Terms: <strong>{q.deliveryTerms}</strong></span>}
                            {q.destination && <span>Port: <strong>{q.destination}</strong></span>}
                          </div>
                        </div>
                      </div>

                      <div className="message-actions">
                        <span className="date">
                          {q.createdAt?.toDate ? q.createdAt.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                        </span>
                        <div className="action-btns">
                          {q.isSeen ? (
                            <button className="action-btn-pro" disabled>
                              Handled
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMarkAsReplied(q.id)}
                              disabled={actionStatus === 'processing'}
                              className="action-btn-pro"
                              title="Mark as handled"
                            >
                              Mark Replied
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteEnquiry(q.id)}
                            disabled={actionStatus === 'processing'}
                            className="action-btn-pro delete"
                            title="Delete message"
                          >
                            DEL
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="message-body">
                      <p style={{ margin: 0, whiteSpace: 'pre-line' }}>
                        {q.description || 'No additional commercial specifications or notes entered.'}
                      </p>
                      {q.businessEmail && q.businessEmail !== 'Not provided' && (
                        <a
                          href={`mailto:${q.businessEmail}?subject=Consigliere%20Holdings%20Commercial%20Desk%20-%20Re:%20${encodeURIComponent(q.commodity)}&body=Dear%20${encodeURIComponent(q.fullName)},%0D%0A%0D%0AThank%20you%20for%20submitting%20your%20commercial%20requirement%20for%20${encodeURIComponent(q.commodity)}.`}
                          className="reply-hint"
                        >
                          Dispatch Response to {q.businessEmail} →
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : activeTab === 'users' ? (
        /* =====================================================================
           TAB 3: USERS (STAFF & PERMISSIONS)
           ===================================================================== */
        <div className="admin-grid">
          {/* Left Panel: Authorize Staff Form */}
          <div className="admin-panel glass-card p-2">
            <h3 className="left-panel-title">AUTHORIZE TRADING DESK STAFF</h3>
            <p className="small text-muted mb-2">
              Authorized emails are permitted to sign in to this administrative desk via Google Authentication.
            </p>

            <form onSubmit={handleAddAdmin} className="admin-form">
              <div className="form-group mb-2">
                <label className="section-title-xs">CORPORATE / TRADER EMAIL</label>
                <input
                  type="email"
                  placeholder="analyst@consigliereholdings.com"
                  required
                  value={newAdminEmail}
                  onChange={e => setNewAdminEmail(e.target.value)}
                  className="modern-input"
                />
              </div>
              <button
                type="submit"
                className="button-primary w-100"
                disabled={actionStatus === 'processing'}
              >
                Grant Administrator Access
              </button>
            </form>
          </div>

          {/* Right Panel: Staff Directory & Security Policy */}
          <div className="admin-panel">
            <h3 className="section-title">ADMINISTRATIVE DIRECTORY & PRIVILEGES</h3>

            {/* Superadministrators */}
            <div className="role-section mb-3">
              <h4 className="left-panel-title" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                SUPERADMINISTRATORS (PRINCIPALS)
              </h4>
              <p className="small text-muted mb-2">
                System principals with full privileges across all commercial collections and settings. Managed via Firestore security configuration.
              </p>
              <div className="user-grid">
                {superAdmins.map(email => (
                  <div key={email} className="user-pro-card super">
                    <div className="user-icon">🛡️</div>
                    <div className="user-info">
                      <strong>{email}</strong>
                      <span className="pro-badge">SUPERADMINISTRATOR</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Authorized Standard Staff */}
            <div className="role-section">
              <h4 className="left-panel-title" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                AUTHORIZED DESK ADMINISTRATORS
              </h4>
              <p className="small text-muted mb-2">
                Commercial desk staff authorized to evaluate incoming inquiries and maintain commodity specifications.
              </p>

              <div style={{ display: 'flex', alignItems: 'stretch', gap: '2rem', flexWrap: 'wrap' }}>
                <div className="table-wrapper glass-card" style={{ maxWidth: '720px', flex: '1 1 500px' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Administrator Email</th>
                        <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminList.filter(email => !superAdmins.includes(email)).map(email => (
                        <tr key={email}>
                          <td>{email}</td>
                          <td style={{ textAlign: 'right', paddingRight: '1rem' }}>
                            <button
                              onClick={() => handleRemoveAdmin(email)}
                              disabled={actionStatus === 'processing'}
                              className="action-btn-pro delete"
                              title="Revoke Access"
                            >
                              REVOKE
                            </button>
                          </td>
                        </tr>
                      ))}
                      {adminList.filter(email => !superAdmins.includes(email)).length === 0 && (
                        <tr>
                          <td colSpan={2} className="text-center py-2 text-muted" style={{ textAlign: 'center', padding: '1.5rem' }}>
                            No additional standard administrators authorized.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="security-note-box">
                  <div className="security-header">
                    <ShieldAlert size={14} />
                    <span>SECURITY POLICY</span>
                  </div>
                  <p>
                    For audit and regulatory compliance, Superadministrators cannot be modified directly via client-side controls.
                    Superadmin privileges are guarded by Firestore Security Rules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =====================================================================
           TAB 4: SETTINGS (DYNAMIC CONTENT & THEMES)
           ===================================================================== */
        <div className="admin-grid">
          {/* Left Panel: Business Essentials Form */}
          <div className="admin-panel glass-card p-2">
            <h3 className="left-panel-title">COMMERCIAL DESK SETTINGS</h3>
            <p className="small text-muted mb-2">Centralized controls for corporate contact and trading parameters.</p>

            <form onSubmit={handleUpdateSettings} className="admin-form">
              <label className="section-title-xs" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Building2 size={14} /> CORPORATE ESSENTIALS
              </label>

              <div className="form-group mb-2">
                <label className="section-title-xs">PUBLIC DESK PHONE</label>
                <input
                  type="text"
                  placeholder="+44 (0) 20 7946 0912"
                  value={sitePhone}
                  onChange={e => setSitePhone(e.target.value)}
                  className="modern-input"
                />
              </div>

              <div className="form-group mb-2">
                <label className="section-title-xs">COMMERCIAL INBOX (DESK EMAIL)</label>
                <input
                  type="email"
                  placeholder="info@consigliereholdings.com"
                  value={deskEmail}
                  onChange={e => setDeskEmail(e.target.value)}
                  className="modern-input"
                />
              </div>

              <div className="form-group mb-2">
                <label className="section-title-xs">PRINCIPAL CONTACT EMAIL</label>
                <input
                  type="email"
                  placeholder="gs@consigliereholdings.com"
                  value={siteEmail}
                  onChange={e => setSiteEmail(e.target.value)}
                  className="modern-input"
                />
              </div>

              <div className="form-group mb-3">
                <label className="section-title-xs">PHYSICAL REGISTERED ADDRESS</label>
                <textarea
                  rows={2}
                  placeholder="Consigliere Holdings Ltd., Mayfair, London..."
                  value={siteAddress}
                  onChange={e => setSiteAddress(e.target.value)}
                  className="modern-textarea"
                />
              </div>

              <label className="section-title-xs" style={{ margin: '1.2rem 0 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} /> OPERATIONS & DESK STATUS
              </label>

              <div className="form-group mb-2">
                <label className="section-title-xs">TRADING HOURS</label>
                <input
                  type="text"
                  placeholder="Mon - Fri: 08:30 - 18:00 GMT"
                  value={workingHours}
                  onChange={e => setWorkingHours(e.target.value)}
                  className="modern-input"
                />
              </div>

              <div className="form-group mb-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="deskOpenToggle"
                  checked={isDeskOpen}
                  onChange={e => setIsDeskOpen(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="deskOpenToggle" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--adm-text)', cursor: 'pointer' }}>
                  SHOW "COMMERCIAL DESK ACTIVE" STATUS
                </label>
              </div>

              <label className="section-title-xs" style={{ margin: '1.2rem 0 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={14} /> MAP EMBED URL
              </label>
              <div className="form-group mb-3">
                <textarea
                  rows={2}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  value={mapUrl}
                  onChange={e => setMapUrl(e.target.value)}
                  className="modern-textarea"
                />
              </div>

              <button
                type="submit"
                className="button-primary w-100"
                disabled={actionStatus === 'processing'}
              >
                {actionStatus === 'processing' ? 'SYNCHRONIZING...' : 'SAVE ALL SETTINGS'}
              </button>
            </form>
          </div>

          {/* Right Panel: Map Preview & Theme Swatches */}
          <div className="admin-panel glass-card p-2">
            <h3 className="section-title">COMMUNICATION CHANNELS & INTERFACE THEMES</h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="section-title-xs" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Share2 size={14} /> CHANNELS & PROFILES
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="section-title-xs">WHATSAPP COMMODITY DESK</label>
                  <input
                    type="text"
                    value={socialWa}
                    onChange={e => setSocialWa(e.target.value)}
                    className="modern-input"
                    placeholder="+447946091200"
                  />
                </div>
                <div className="form-group">
                  <label className="section-title-xs">LINKEDIN PROFILE</label>
                  <input
                    type="text"
                    value={socialLinked}
                    onChange={e => setSocialLinked(e.target.value)}
                    className="modern-input"
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="section-title-xs">CORPORATE DOMAIN URL</label>
                  <input
                    type="text"
                    value={socialWeb}
                    onChange={e => setSocialWeb(e.target.value)}
                    className="modern-input"
                    placeholder="https://consigliereholdings.com"
                  />
                </div>
              </div>
            </div>

            {/* Live Interactive Map Preview */}
            {mapUrl && (
              <div className="map-preview-wrapper mb-4">
                <label className="section-title-xs" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={14} /> LIVE CORPORATE MAP PREVIEW
                </label>
                <div className="map-preview-container rectangle" style={{ height: '240px' }}>
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    title="Map Preview"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Theme Presets */}
            <div style={{ marginTop: '1.5rem' }}>
              <h4 className="left-panel-title" style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                ADMIN DASHBOARD THEME PRESETS
              </h4>
              <div className="theme-grid">
                {Object.keys(THEME_MAP).map(key => (
                  <button
                    key={key}
                    type="button"
                    className={`theme-swatch ${themeKey === key ? 'active' : ''}`}
                    onClick={() => {
                      setThemeKey(key);
                      localStorage.setItem('ch-adm-theme', key);
                    }}
                  >
                    {THEME_MAP[key].isExperimental && (
                      <span className="experimental-tag-mini">PRO</span>
                    )}
                    <div className="swatch-colors">
                      <div className="swatch-main" style={{ background: THEME_MAP[key].primary }}></div>
                      <div className="swatch-bg" style={{ background: THEME_MAP[key].bgMain }}></div>
                      <div className="swatch-card" style={{ background: THEME_MAP[key].bgCard }}></div>
                    </div>
                    <span className="theme-name">{THEME_MAP[key].name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation & Alert Modals */}
      {modalConfig.isOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{modalConfig.title}</h3>
            </div>
            <div className="admin-modal-body">
              <p>{modalConfig.message}</p>
            </div>
            <div className="admin-modal-footer">
              <button className="action-btn-pro" onClick={closeModal}>
                {modalConfig.type === 'confirm' ? 'CANCEL' : 'CLOSE'}
              </button>
              {modalConfig.type === 'confirm' && (
                <button
                  className="button-primary"
                  style={{ padding: '0.4rem 1.2rem', marginLeft: '0.75rem' }}
                  onClick={() => {
                    if (modalConfig.onConfirm) modalConfig.onConfirm();
                    closeModal();
                  }}
                >
                  CONFIRM
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS replicating reference styles */}
      <style>{`
        .admin-dashboard-page {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--adm-bg);
          color: var(--adm-text);
          font-family: 'Inter', system-ui, sans-serif;
          overflow: hidden;
        }

        /* Modal Styles */
        .admin-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: adminFadeIn 0.2s ease-out;
        }
        .admin-modal-content {
          background: var(--adm-card);
          border: 2px solid var(--adm-text);
          box-shadow: 8px 8px 0px var(--adm-text);
          width: 90%;
          max-width: 440px;
          padding: 1.5rem;
          animation: adminScaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .admin-modal-header h3 {
          margin: 0 0 0.75rem 0;
          font-size: 1rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--adm-text);
        }
        .admin-modal-body p {
          margin: 0 0 1.5rem 0;
          font-size: 0.85rem;
          color: var(--adm-muted);
          line-height: 1.5;
        }
        .admin-modal-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        @keyframes adminFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes adminScaleUp {
          from { transform: scale(0.95) translateY(10px); }
          to { transform: scale(1) translateY(0); }
        }

        /* Scrollbar */
        .admin-dashboard-page ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .admin-dashboard-page ::-webkit-scrollbar-track {
          background: var(--adm-scroll);
        }
        .admin-dashboard-page ::-webkit-scrollbar-thumb {
          background: var(--adm-text);
        }
        .admin-dashboard-page ::-webkit-scrollbar-thumb:hover {
          background: var(--adm-p);
        }
        .admin-dashboard-page {
          scrollbar-width: thin;
          scrollbar-color: var(--adm-text) var(--adm-bg);
        }

        /* Header */
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid var(--adm-text);
          background: var(--adm-head);
          padding: 0.75rem 2rem;
          z-index: 100;
        }
        .admin-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .logo-box {
          background: var(--adm-text);
          color: white;
          padding: 0.2rem 0.5rem;
          font-size: 1.1rem;
          font-weight: 900;
        }
        .logo-text {
          font-size: 0.95rem;
          color: var(--adm-text);
          text-transform: uppercase;
        }
        .admin-nav-main {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .admin-tabs {
          display: flex;
          gap: 0;
          border: 1px solid var(--adm-text);
        }
        .tab-btn {
          background: none;
          border: none;
          border-right: 1px solid var(--adm-text);
          padding: 0.5rem 1.25rem;
          cursor: pointer;
          font-weight: 700;
          color: var(--adm-text);
          font-size: 0.75rem;
          text-transform: uppercase;
          transition: all 0.15s;
        }
        .tab-btn:last-child {
          border-right: none;
        }
        .tab-btn:hover {
          background: var(--adm-h-tab);
        }
        .tab-btn.active {
          background: var(--adm-p);
          color: white;
          border-color: var(--adm-p) !important;
          box-shadow: 2px 2px 0px var(--adm-p-l);
        }
        .tab-btn.active .new-tag {
          background: white;
          color: var(--adm-p);
        }

        .filter-btn {
          padding: 0.4rem 0.9rem;
          font-size: 0.75rem;
          background: white;
          border: none;
          border-right: 1px solid #ddd;
          font-weight: 600;
          text-transform: uppercase;
          color: #666;
          cursor: pointer;
        }
        .filter-btn:hover:not(.active) {
          background: #f0f0f0;
        }
        .filter-btn.active {
          background: var(--adm-text) !important;
          color: white !important;
        }

        .source-filter-bar {
          display: flex;
          border: 1px solid var(--adm-border-m);
          padding: 0;
          width: fit-content;
          overflow: hidden;
          margin-bottom: 0.75rem;
          background: white;
        }

        .left-panel-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--adm-text);
          margin-bottom: 0.25rem;
          display: block;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .admin-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 0;
          flex: 1;
          min-height: 0;
          border-bottom: 2px solid var(--adm-text);
        }
        .admin-panel {
          background: var(--adm-card);
          padding: 1.5rem;
          overflow-y: auto;
          height: 100%;
        }
        .admin-panel:first-child {
          border-right: 2px solid var(--adm-text);
          background: var(--adm-bg);
          scrollbar-gutter: stable;
          padding: 1.5rem 1.25rem;
        }
        .glass-card {
          background: var(--adm-card);
          border: 1px solid var(--adm-text);
          box-shadow: 6px 6px 0px var(--adm-text);
        }
        .section-title {
          font-size: 0.85rem;
          text-transform: uppercase;
          background: var(--adm-text);
          color: white;
          padding: 0.4rem 0.8rem;
          margin-bottom: 1.25rem;
          display: inline-block;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .section-title-xs {
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          color: var(--adm-text);
          letter-spacing: 0.08em;
          margin-bottom: 0.4rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .modern-input, .modern-textarea {
          display: block;
          width: 100%;
          border: 1px solid var(--adm-text);
          padding: 0.65rem 0.75rem;
          font-family: inherit;
          font-size: 0.85rem;
          background: var(--adm-card);
          color: var(--adm-text);
          box-sizing: border-box;
          transition: border-color 0.2s;
          margin-bottom: 0.4rem;
        }
        .modern-input:focus, .modern-textarea:focus {
          outline: none;
          border-color: var(--adm-p);
        }

        .action-btn.pro, .action-btn-pro {
          background: #f5f5f5;
          color: var(--adm-text);
          border: 1px solid var(--adm-border-m);
          padding: 0.35rem 0.75rem;
          font-size: 0.7rem;
          font-weight: 800;
          cursor: pointer;
          text-transform: uppercase;
          transition: all 0.1s;
        }
        .action-btn.pro:hover:not(:disabled), .action-btn-pro:hover:not(:disabled) {
          background: var(--adm-text);
          color: white;
          border-color: var(--adm-text);
        }
        .action-btn.pro.delete, .action-btn-pro.delete {
          color: var(--adm-del);
        }
        .action-btn.pro.delete:hover, .action-btn-pro.delete:hover {
          background: var(--adm-del);
          color: white;
          border-color: var(--adm-del);
        }

        .admin-dashboard-page .button-primary {
          background: var(--adm-p) !important;
          color: white !important;
          padding: 0.8rem 1.4rem;
          border: 1px solid var(--adm-text);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.1s;
          font-size: 0.8rem;
        }
        .admin-dashboard-page .button-primary:hover {
          background: var(--adm-text) !important;
          transform: translate(-2px, -2px);
          box-shadow: 4px 4px 0px var(--adm-p-l);
        }

        .messages-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .message-card {
          background: var(--adm-card);
          border: 1px solid var(--adm-text);
          transition: transform 0.1s;
        }
        .message-card.unseen {
          border-left: 6px solid var(--adm-p);
        }
        .message-card.seen {
          background: var(--adm-rep-bg);
          border-color: #ddd;
          opacity: 0.8;
        }
        .message-card.seen .message-body {
          background: var(--adm-rep-body);
        }
        .message-header {
          display: flex;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--adm-border-m);
          align-items: flex-start;
        }
        .name-title {
          margin: 0 0 0.4rem 0;
          color: var(--adm-text);
          font-weight: 800;
          font-size: 0.95rem;
        }
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          color: var(--adm-muted);
          font-size: 0.8rem;
        }
        .message-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }
        .message-actions .date {
          font-size: 0.7rem;
          color: var(--adm-muted);
          font-weight: 600;
        }
        .message-body {
          padding: 1rem 1.25rem;
          background: var(--adm-bg);
          font-size: 0.85rem;
          line-height: 1.5;
        }

        .badge-pro {
          font-size: 0.65rem;
          font-weight: 900;
          padding: 0.15rem 0.4rem;
          letter-spacing: 0.05em;
        }
        .badge-pro.active {
          background: var(--adm-new-bg);
          color: var(--adm-new-t);
          border: 1px solid var(--adm-new-t);
        }
        .badge-pro.muted {
          background: #eee;
          color: #777;
          border: 1px solid #ccc;
        }
        .new-tag {
          background: var(--adm-new-bg);
          color: var(--adm-new-t);
          font-size: 0.55rem;
          padding: 0.15rem 0.4rem;
          font-weight: 900;
          border: 1px solid var(--adm-new-t);
          margin-left: 0.5rem;
          text-transform: uppercase;
        }
        .source-tag {
          font-size: 0.6rem;
          font-weight: 800;
          padding: 0.15rem 0.4rem;
          border: 1px solid var(--adm-text);
          color: var(--adm-text);
        }
        .source-tag.form {
          border-color: var(--adm-form);
          color: var(--adm-form);
          background: var(--adm-form-bg);
        }
        .source-tag.popup {
          border-color: var(--adm-pop);
          color: var(--adm-pop);
          background: var(--adm-pop-bg);
        }

        .copy-badge {
          background: #eee;
          color: #666;
          padding: 2px 4px;
          margin-left: 6px;
          cursor: pointer;
          border: 1px solid transparent;
          display: inline-flex;
          align-items: center;
        }
        .copy-badge:hover {
          background: var(--adm-p);
          color: white;
        }

        .order-controls {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .order-btn {
          background: var(--adm-card);
          border: 1px solid var(--adm-border-m);
          color: var(--adm-text);
          font-size: 0.6rem;
          padding: 2px 4px;
          cursor: pointer;
        }
        .order-btn:hover:not(:disabled) {
          background: var(--adm-p);
          color: white;
        }
        .order-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .reply-hint {
          color: var(--adm-p);
          text-decoration: none;
          font-weight: 800;
          font-size: 0.8rem;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.6rem;
        }
        .reply-hint:hover {
          text-decoration: underline;
        }

        .user-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .user-pro-card {
          background: var(--adm-card);
          border: 1px solid var(--adm-text);
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .user-pro-card.super {
          background: var(--adm-rep-bg);
          border: 2px solid var(--adm-p);
        }
        .user-icon {
          font-size: 1.25rem;
        }
        .user-info {
          display: flex;
          flex-direction: column;
        }
        .pro-badge {
          font-size: 0.6rem;
          font-weight: 900;
          text-transform: uppercase;
          color: var(--adm-p);
          margin-top: 0.1rem;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }
        .admin-table th {
          text-align: left;
          padding: 0.85rem 1rem;
          background: var(--adm-text);
          color: white;
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.08em;
        }
        .admin-table td {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid var(--adm-border-l);
          font-size: 0.85rem;
        }

        .security-note-box {
          flex: 0 1 300px;
          background: #fff8f8;
          border: 1px solid var(--adm-text);
          padding: 1.25rem;
          border-left: 4px solid var(--adm-del);
          box-shadow: 6px 6px 0px var(--adm-text);
        }
        .security-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--adm-del);
          font-weight: 900;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          margin-bottom: 0.5rem;
        }
        .security-note-box p {
          margin: 0;
          font-size: 0.78rem;
          line-height: 1.5;
          color: #666;
        }

        /* Map & Themes */
        .map-preview-container {
          background: var(--adm-bg);
          border: 1px solid var(--adm-text);
          box-shadow: 6px 6px 0px var(--adm-text);
          overflow: hidden;
        }
        .theme-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 0.75rem;
        }
        .theme-swatch {
          position: relative;
          background: var(--adm-bg);
          border: 1px solid var(--adm-border-m);
          padding: 0.5rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          text-align: center;
          transition: all 0.15s;
        }
        .theme-swatch:hover {
          border-color: var(--adm-p);
          transform: translateY(-2px);
        }
        .theme-swatch.active {
          border-color: var(--adm-p);
          border-width: 2px;
          box-shadow: 4px 4px 0px var(--adm-p);
        }
        .theme-name {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--adm-muted);
        }
        .swatch-colors {
          height: 36px;
          display: flex;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        .swatch-main { flex: 1.5; }
        .swatch-bg { flex: 1; }
        .swatch-card { flex: 1; }
        .experimental-tag-mini {
          position: absolute;
          top: 0;
          right: 0;
          background: var(--adm-p);
          color: white;
          font-size: 7px;
          font-weight: 900;
          padding: 1px 4px;
        }

        /* Responsive Navigation */
        .menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          z-index: 1001;
        }
        .hamburger {
          width: 22px;
          height: 16px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .hamburger span {
          display: block;
          height: 2px;
          width: 100%;
          background: var(--adm-text);
          transition: transform 0.2s, opacity 0.2s;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        @media (max-width: 1100px) {
          .admin-grid {
            grid-template-columns: 1fr;
            overflow-y: auto;
          }
          .admin-panel:first-child {
            border-right: none;
            border-bottom: 2px solid var(--adm-text);
            height: auto;
          }
        }

        @media (max-width: 850px) {
          .admin-header { padding: 0.75rem 1.25rem; }
          .menu-toggle { display: flex; }
          .nav-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(3px);
            z-index: 999;
          }
          .admin-nav-main {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 70%;
            height: 100vh;
            background: var(--adm-card);
            border-right: 2px solid var(--adm-text);
            flex-direction: column;
            align-items: stretch;
            padding: 4rem 1.25rem 1.5rem;
            z-index: 1000;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 10px 0px 30px rgba(0, 0, 0, 0.2);
          }
          .admin-nav-main.mobile-open { transform: translateX(0); }
          .admin-tabs { flex-direction: column; border: none; gap: 0.5rem; }
          .tab-btn {
            border: 1px solid var(--adm-text) !important;
            box-shadow: 3px 3px 0px var(--adm-text);
            background: white;
            padding: 0.75rem 1rem;
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
