// ============================================================
// Admin Users Tab - manage admin accounts with audit logging
// ============================================================

import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Lock, Shield, Pencil } from 'lucide-react';
import { getAdminUsers, createAdminUser, deleteAdminUser, changeAdminPassword, updateAdminUsername, hashPassword, addAuditLog, getLoggedInAdmin } from '@/lib/firebase';
import type { AdminUser } from '@/types';

export function AdminsTab() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Change password modal
  const [changeTarget, setChangeTarget] = useState<AdminUser | null>(null);
  const [changeCurrent, setChangeCurrent] = useState('');
  const [changeNew, setChangeNew] = useState('');
  const [changeConfirm, setChangeConfirm] = useState('');
  const [changeError, setChangeError] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // Change username modal
  const [usernameTarget, setUsernameTarget] = useState<AdminUser | null>(null);
  const [usernameNew, setUsernameNew] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [changingUsername, setChangingUsername] = useState(false);

  const currentAdmin = getLoggedInAdmin() || '';

  const load = async () => {
    const data = await getAdminUsers();
    setAdmins(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newUsername.trim()) { setError('Username is required'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }

    const existing = admins.find(a => a.username === newUsername.trim().toLowerCase());
    if (existing) { setError('Username already exists'); return; }

    try {
      await createAdminUser(newUsername.trim(), newPassword);
      await addAuditLog('CREATE', 'admin', null, `Created admin "${newUsername.trim()}"`, currentAdmin);
      setSuccess(`Admin "${newUsername.trim()}" created successfully`);
      setNewUsername('');
      setNewPassword('');
      setShowAdd(false);
      await load();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to create admin user');
    }
  };

  const handleDelete = async (admin: AdminUser) => {
    if (admin.isMain) { setError('Cannot delete the main admin account'); return; }
    if (!confirm(`Delete admin "${admin.username}"?`)) return;
    await deleteAdminUser(admin.id);
    await addAuditLog('DELETE', 'admin', admin.id, `Deleted admin "${admin.username}"`, currentAdmin);
    await load();
    setSuccess(`Admin "${admin.username}" deleted`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');

    if (!changeTarget) return;
    if (changeNew.length < 6) { setChangeError('Password must be at least 6 characters'); return; }
    if (changeNew !== changeConfirm) { setChangeError('Passwords do not match'); return; }

    setChangingPass(true);
    try {
      const hash = await hashPassword(changeCurrent, changeTarget.passwordSalt);
      if (hash !== changeTarget.passwordHash) { setChangeError('Current password is incorrect'); return; }

      await changeAdminPassword(changeTarget.id, changeNew);
      await addAuditLog('CHANGE_PASSWORD', 'admin', changeTarget.id, `Changed password for "${changeTarget.username}"`, currentAdmin);
      setChangeTarget(null);
      setChangeCurrent('');
      setChangeNew('');
      setChangeConfirm('');
      setSuccess('Password updated successfully');
      await load();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setChangeError('Failed to update password');
    } finally {
      setChangingPass(false);
    }
  };

  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError('');

    if (!usernameTarget) return;
    if (!usernameNew.trim()) { setUsernameError('Username is required'); return; }

    const existing = admins.find(a => a.id !== usernameTarget.id && a.username === usernameNew.trim().toLowerCase());
    if (existing) { setUsernameError('Username already exists'); return; }

    setChangingUsername(true);
    try {
      const oldName = usernameTarget.username;
      await updateAdminUsername(usernameTarget.id, usernameNew.trim());
      await addAuditLog('UPDATE', 'admin', usernameTarget.id, `Changed username from "${oldName}" to "${usernameNew.trim()}"`, currentAdmin);
      setUsernameTarget(null);
      setUsernameNew('');
      setSuccess('Username updated successfully');
      await load();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setUsernameError('Failed to update username');
    } finally {
      setChangingUsername(false);
    }
  };

  if (loading) return <div className="text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" />
          Admin Users
        </h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-black text-sm font-semibold hover:opacity-90 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-green-400 text-sm">{success}</p>}

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white/5 rounded-xl border border-white/10 p-5 space-y-3">
          <h3 className="text-white font-medium text-sm">New Admin Account</h3>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              placeholder="username"
              className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 rounded-lg bg-green-500 text-black text-sm font-semibold hover:opacity-90">
              Create
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Admin list */}
      <div className="space-y-2">
        {admins.map(admin => (
          <div key={admin.id} className="bg-white/5 rounded-xl border border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center">
                <Lock className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium flex items-center gap-2">
                  {admin.username}
                  {admin.isMain && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-500/20 text-green-400 uppercase">Main</span>
                  )}
                </p>
                <p className="text-gray-500 text-xs">Created {new Date(admin.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setUsernameTarget(admin); setUsernameNew(admin.username); setUsernameError(''); }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                title="Change username"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setChangeTarget(admin); setChangeError(''); }}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs hover:bg-white/10 transition-all"
              >
                Change Password
              </button>
              {!admin.isMain && (
                <button
                  onClick={() => handleDelete(admin)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Change password modal */}
      {changeTarget && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-[#111] rounded-2xl border border-white/10 p-6 max-w-sm w-full">
            <h2 className="text-white font-bold text-lg mb-1">Change Password</h2>
            <p className="text-gray-500 text-sm mb-4">Changing password for <span className="text-green-400 font-medium">{changeTarget.username}</span></p>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <input
                type="password"
                value={changeCurrent}
                onChange={e => setChangeCurrent(e.target.value)}
                placeholder="Current password"
                className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500/50"
              />
              <input
                type="password"
                value={changeNew}
                onChange={e => setChangeNew(e.target.value)}
                placeholder="New password"
                className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500/50"
              />
              <input
                type="password"
                value={changeConfirm}
                onChange={e => setChangeConfirm(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500/50"
              />
              {changeError && <p className="text-red-400 text-xs">{changeError}</p>}
              <div className="flex gap-2">
                <button type="submit" disabled={changingPass} className="flex-1 py-2.5 rounded-lg bg-green-500 text-black font-semibold text-sm hover:opacity-90 disabled:opacity-50">
                  {changingPass ? 'Saving...' : 'Update'}
                </button>
                <button type="button" onClick={() => { setChangeTarget(null); setChangeCurrent(''); setChangeNew(''); setChangeConfirm(''); }} className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change username modal */}
      {usernameTarget && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-[#111] rounded-2xl border border-white/10 p-6 max-w-sm w-full">
            <h2 className="text-white font-bold text-lg mb-1">Change Username</h2>
            <p className="text-gray-500 text-sm mb-4">Current: <span className="text-green-400 font-medium">{usernameTarget.username}</span></p>
            <form onSubmit={handleChangeUsername} className="space-y-3">
              <input
                type="text"
                value={usernameNew}
                onChange={e => setUsernameNew(e.target.value)}
                placeholder="New username"
                className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500/50"
                autoFocus
              />
              {usernameError && <p className="text-red-400 text-xs">{usernameError}</p>}
              <div className="flex gap-2">
                <button type="submit" disabled={changingUsername} className="flex-1 py-2.5 rounded-lg bg-green-500 text-black font-semibold text-sm hover:opacity-90 disabled:opacity-50">
                  {changingUsername ? 'Saving...' : 'Update'}
                </button>
                <button type="button" onClick={() => { setUsernameTarget(null); setUsernameNew(''); }} className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
