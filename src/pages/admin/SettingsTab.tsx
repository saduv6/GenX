// ============================================================
// Admin Settings Tab - Full site configuration + password change
// ============================================================

import { useState, useEffect } from 'react';
import { Save, Lock } from 'lucide-react';
import { getSettings, updateSettings, getImages, addAuditLog, getLoggedInAdmin } from '@/lib/firebase';
import type { Settings, ImageRecord } from '@/types';

export function SettingsTab() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
    await addAuditLog('UPDATE', 'settings', null, 'Updated site settings', getLoggedInAdmin() || '');
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

  const socialFields = [
    { name: 'contactPhone', label: 'Contact Phone' },
    { name: 'whatsappLink', label: 'WhatsApp Link' },
    { name: 'tiktokLink', label: 'TikTok Link' },
    { name: 'instagramLink', label: 'Instagram Link' },
    { name: 'facebookLink', label: 'Facebook Link' },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Store Settings - English */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4">Store Settings (English)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1">Store Name (EN)</label>
            <input name="storeName" value={settings.storeName} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Store Description (EN)</label>
            <textarea name="storeDescription" value={settings.storeDescription} onChange={handleChange} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 resize-none" />
          </div>
        </div>
      </div>

      {/* Store Settings - Arabic */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4">Store Settings (Arabic)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1">Store Name (AR)</label>
            <input name="storeNameAr" value={settings.storeNameAr} onChange={handleChange} dir="rtl" className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Store Description (AR)</label>
            <textarea name="storeDescriptionAr" value={settings.storeDescriptionAr} onChange={handleChange} dir="rtl" rows={3} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 resize-none" />
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4">Logo</h2>
        <div className="flex gap-2">
          <input name="logoUrl" value={settings.logoUrl} onChange={handleChange} placeholder="Logo URL or base64..." className="flex-1 px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
        </div>
        {settings.logoUrl && (
          <img src={settings.logoUrl} alt="Logo preview" className="mt-2 w-16 h-16 object-contain rounded" />
        )}
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

      {/* Hero Settings */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1">Hero Title (EN)</label>
            <input name="heroTitle" value={settings.heroTitle} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Hero Subtitle (EN)</label>
            <input name="heroSubtitle" value={settings.heroSubtitle} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Hero Title (AR)</label>
            <input name="heroTitleAr" value={settings.heroTitleAr} onChange={handleChange} dir="rtl" className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Hero Subtitle (AR)</label>
            <input name="heroSubtitleAr" value={settings.heroSubtitleAr} onChange={handleChange} dir="rtl" className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
          </div>
        </div>
      </div>

      {/* Contact & Social */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4">Contact & Social Links</h2>
        <div className="space-y-3">
          {socialFields.map(field => (
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
            <label className="block text-gray-400 text-xs mb-1">Footer Copyright Text (EN)</label>
            <input name="footerText" value={settings.footerText} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Footer Copyright Text (AR)</label>
            <input name="footerTextAr" value={settings.footerTextAr} onChange={handleChange} dir="rtl" className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
          </div>
        </div>
      </div>

      {/* Change Admin Password */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-green-400" />
          Change Admin Password
        </h2>
        <p className="text-gray-500 text-xs mb-3">Password management has moved to the Admins tab. You can change your password and create new admin accounts there.</p>
      </div>

      {/* Warranty Content */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4">Warranty Page Content</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1">Warranty Content (EN) - Markdown supported</label>
            <textarea name="warrantyContent" value={settings.warrantyContent || ''} onChange={handleChange} rows={8} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 resize-y font-mono" placeholder="# Heading&#10;## Subheading&#10;- Item 1&#10;- Item 2&#10;1. Step one&#10;2. Step two" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Warranty Content (AR) - Markdown supported</label>
            <textarea name="warrantyContentAr" value={settings.warrantyContentAr || ''} onChange={handleChange} rows={8} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 resize-y font-mono" dir="rtl" placeholder="# العنوان&#10;## عنوان فرعي&#10;- عنصر 1&#10;- عنصر 2&#10;1. خطوة 1&#10;2. خطوة 2" />
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4">Terms of Service Page Content</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1">Terms Content (EN) - Markdown supported</label>
            <textarea name="termsContent" value={settings.termsContent || ''} onChange={handleChange} rows={8} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 resize-y font-mono" placeholder="# Terms of Service&#10;## 1. Section&#10;Body text..." />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Terms Content (AR) - Markdown supported</label>
            <textarea name="termsContentAr" value={settings.termsContentAr || ''} onChange={handleChange} rows={8} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 resize-y font-mono" dir="rtl" placeholder="# شروط الخدمة&#10;## 1. قسم&#10;نص..." />
          </div>
        </div>
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
