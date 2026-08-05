// ============================================================
// Admin Settings Tab - Full site configuration + password change
// ============================================================

import { useState, useEffect } from 'react';
import { Save, Lock } from 'lucide-react';
import { getSettings, updateSettings, hashPassword, getImages } from '@/lib/firebase';
import type { Settings, ImageRecord } from '@/types';

export function SettingsTab() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  useEffect(() => {
    async function load() {
      const s = await getSettings();
      if (s) setSettings(s);
      const imgs = await getImages();
      setImages(imgs.filter(i => i.isActive));
    }
    load();
  }, []);

  if (!settings) return <div className="text-gray-500 text-sm">Loading...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await updateSettings(settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => prev ? { ...prev, primaryColor: e.target.value } : null);
    setSaved(false);
  };

  const handleImageSelect = (path: string) => {
    setSettings(prev => prev ? { ...prev, logoUrl: path } : null);
    setSaved(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess(false);

    if (newPass.length < 6) { setPassError('Password must be at least 6 characters'); return; }
    if (newPass !== confirmPass) { setPassError('Passwords do not match'); return; }

    setChangingPass(true);
    try {
      const s = await getSettings();
      if (!s) { setPassError('Settings not found'); return; }

      const hash = await hashPassword(currentPass, s.adminPasswordSalt);
      if (hash !== s.adminPasswordHash) { setPassError('Current password is incorrect'); return; }

      const newSalt = crypto.randomUUID().replace(/-/g, '');
      const newHash = await hashPassword(newPass, newSalt);

      await updateSettings({
        adminPasswordHash: newHash,
        adminPasswordSalt: newSalt,
      });

      setPassSuccess(true);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } catch {
      setPassError('Failed to update password');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Store Settings */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4">Store Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1">Store Name</label>
            <input name="storeName" value={settings.storeName} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Store Description</label>
            <textarea name="storeDescription" value={settings.storeDescription} onChange={handleChange} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 resize-none" />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-gray-400 text-xs mb-1">Logo</label>
            <div className="flex gap-2">
              <input name="logoUrl" value={settings.logoUrl} onChange={handleChange} placeholder="Logo URL or base64..." className="flex-1 px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
            </div>
            {settings.logoUrl && (
              <img src={settings.logoUrl} alt="Logo preview" className="mt-2 w-16 h-16 object-contain rounded" />
            )}
            {/* Image picker */}
            {images.length > 0 && (
              <div className="mt-2">
                <p className="text-gray-500 text-xs mb-1">Or select from uploaded images:</p>
                <div className="flex gap-2 flex-wrap">
                  {images.map(img => (
                    <button
                      key={img.id}
                      onClick={() => handleImageSelect(img.path)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${settings.logoUrl === img.path ? 'border-green-500' : 'border-white/10 hover:border-white/30'}`}
                    >
                      <img src={img.path} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Settings */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1">Hero Title</label>
            <input name="heroTitle" value={settings.heroTitle} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Hero Subtitle</label>
            <input name="heroSubtitle" value={settings.heroSubtitle} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
          </div>
        </div>
      </div>

      {/* Contact & Social */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4">Contact & Social Links</h2>
        <div className="space-y-3">
          {[
            { name: 'contactPhone', label: 'Contact Phone' },
            { name: 'whatsappLink', label: 'WhatsApp Link' },
            { name: 'tiktokLink', label: 'TikTok Link' },
            { name: 'instagramLink', label: 'Instagram Link' },
            { name: 'facebookLink', label: 'Facebook Link' },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-gray-400 text-xs mb-1">{field.label}</label>
              <input name={field.name} value={(settings as unknown as Record<string, string>)[field.name] || ''} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4">Appearance</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1">Primary Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={settings.primaryColor} onChange={handleColorChange} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0" />
              <span className="text-gray-400 text-sm font-mono">{settings.primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Footer Copyright Text</label>
            <input name="footerText" value={settings.footerText} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
          </div>
        </div>
      </div>

      {/* Change Admin Password */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-green-400" />
          Change Admin Password
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div>
            <label className="block text-gray-400 text-xs mb-1">Current Password</label>
            <input type="password" value={currentPass} onChange={e => { setCurrentPass(e.target.value); setPassError(''); }} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">New Password</label>
            <input type="password" value={newPass} onChange={e => { setNewPass(e.target.value); setPassError(''); }} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Confirm New Password</label>
            <input type="password" value={confirmPass} onChange={e => { setConfirmPass(e.target.value); setPassError(''); }} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
          </div>
          {passError && <p className="text-red-400 text-xs">{passError}</p>}
          {passSuccess && <p className="text-green-400 text-xs">Password updated successfully!</p>}
          <button type="submit" disabled={changingPass} className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 disabled:opacity-50 transition-all">
            {changingPass ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-black font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
        {saved && <span className="text-green-400 text-sm">Saved!</span>}
      </div>
    </div>
  );
}
