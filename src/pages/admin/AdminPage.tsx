// ============================================================
// Admin Page - Hidden route, password protected, full dashboard
// ============================================================

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { getSettings, hashPassword, setAdminToken, generateAdminToken, clearAdminToken, isAdminAuthenticated, seedDatabase } from '@/lib/firebase';
import { LayoutDashboard, ShoppingBag, Laptop, Image, Settings, LogOut, Lock } from 'lucide-react';
import { DashboardTab } from './DashboardTab';
import { OrdersTab } from './OrdersTab';
import { LaptopsTab } from './LaptopsTab';
import { ImagesTab } from './ImagesTab';
import { SettingsTab } from './SettingsTab';

const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE || '/admin';

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forceChange, setForceChange] = useState(false);

  useEffect(() => {
    async function init() {
      // Seed database on first visit
      await seedDatabase();

      // Check if already authenticated
      if (isAdminAuthenticated()) {
        setAuthenticated(true);
      }
      setChecking(false);
    }
    init();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const settings = await getSettings();
      if (!settings) {
        setError('System not initialized');
        setLoading(false);
        return;
      }

      const hash = await hashPassword(password, settings.adminPasswordSalt);
      if (hash === settings.adminPasswordHash) {
        const token = generateAdminToken();
        setAdminToken(token);
        setAuthenticated(true);

        // Check if using default password
        const defaultHash = await hashPassword('admin123', settings.adminPasswordSalt);
        if (hash === defaultHash) {
          setForceChange(true);
        }
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setAuthenticated(false);
    setPassword('');
    setForceChange(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-green-400" />
            </div>
            <h1 className="text-white text-xl font-bold">Admin Access</h1>
            <p className="text-gray-500 text-sm mt-1">Enter your password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-all"
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-green-500 text-black font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard onLogout={handleLogout} forceChange={forceChange} setForceChange={setForceChange} />
  );
}

// ============================================================
// Admin Dashboard Layout with Tabs
// ============================================================
function AdminDashboard({ onLogout, forceChange, setForceChange }: {
  onLogout: () => void;
  forceChange: boolean;
  setForceChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: 'orders', label: 'Orders', icon: ShoppingBag },
    { path: 'laptops', label: 'Laptops', icon: Laptop },
    { path: 'images', label: 'Images', icon: Image },
    { path: 'settings', label: 'Settings', icon: Settings },
  ];

  // Extract current tab from path
  const currentPath = location.pathname.replace(ADMIN_ROUTE, '').replace(/^\//, '') || 'dashboard';

  return (
    <div className="min-h-screen bg-black">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <span className="text-white font-bold text-sm">GenX Admin</span>
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-red-400 text-sm flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Force password change modal */}
      {forceChange && <ForcePasswordChange onClose={() => setForceChange(false)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.path}
              onClick={() => navigate(`${ADMIN_ROUTE}/${tab.path}`)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                currentPath === tab.path
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <Routes>
          <Route path="/dashboard" element={<DashboardTab />} />
          <Route path="/orders" element={<OrdersTab />} />
          <Route path="/laptops" element={<LaptopsTab />} />
          <Route path="/images" element={<ImagesTab />} />
          <Route path="/settings" element={<SettingsTab />} />
          <Route path="*" element={<Navigate to={`${ADMIN_ROUTE}/dashboard`} replace />} />
        </Routes>
      </div>
    </div>
  );
}

// ============================================================
// Force Password Change Modal
// ============================================================
function ForcePasswordChange({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPass.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (newPass !== confirm) { setError('Passwords do not match'); return; }

    setSaving(true);
    try {
      const settings = await getSettings();
      if (!settings) { setError('Settings not found'); return; }

      const hash = await hashPassword(current, settings.adminPasswordSalt);
      if (hash !== settings.adminPasswordHash) { setError('Current password is incorrect'); return; }

      const newSalt = crypto.randomUUID().replace(/-/g, '');
      const newHash = await hashPassword(newPass, newSalt);

      const { updateSettings } = await import('@/lib/firebase');
      await updateSettings({
        adminPasswordHash: newHash,
        adminPasswordSalt: newSalt,
      });

      onClose();
    } catch {
      setError('Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-[#111] rounded-2xl border border-white/10 p-6 max-w-sm w-full">
        <h2 className="text-white font-bold text-lg mb-1">Change Password</h2>
        <p className="text-gray-500 text-sm mb-4">For security, please change your default password.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={current}
            onChange={e => setCurrent(e.target.value)}
            placeholder="Current password"
            className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500/50"
          />
          <input
            type="password"
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
            placeholder="New password"
            className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500/50"
          />
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500/50"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-lg bg-green-500 text-black font-semibold text-sm hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
