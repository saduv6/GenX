// ============================================================
// Footer - Contact info and social links from settings
// ============================================================

import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Instagram, Facebook, Globe } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useLanguage } from '@/hooks/useLanguage';

export function Footer() {
  const { settings } = useSettings();
  const { lang, t } = useLanguage();

  const storeName = lang === 'ar' ? (settings?.storeNameAr || settings?.storeName || 'GenX Laptop') : (settings?.storeName || 'GenX Laptop');
  const footerText = lang === 'ar' ? (settings?.footerTextAr || settings?.footerText || `\u00a9 2026 ${storeName}. All rights reserved.`) : (settings?.footerText || `\u00a9 2026 ${storeName}. All rights reserved.`);
  const storeDescription = lang === 'ar' ? (settings?.storeDescriptionAr || settings?.storeDescription || 'Your trusted source for premium laptops in Egypt.') : (settings?.storeDescription || 'Your trusted source for premium laptops in Egypt.');
  const contactPhone = settings?.contactPhone;
  const whatsappLink = settings?.whatsappLink;
  const instagramLink = settings?.instagramLink;
  const facebookLink = settings?.facebookLink;
  const tiktokLink = settings?.tiktokLink;
  const primaryColor = settings?.primaryColor || '#00ff00';

  return (
    <footer className="bg-black border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">{storeName}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {storeDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">{t('quickLinks')}</h3>
            <div className="space-y-2">
              <Link to="/faq" className="block text-gray-400 hover:text-white text-sm transition-colors">{t('faq')}</Link>
              <Link to="/terms" className="block text-gray-400 hover:text-white text-sm transition-colors">{t('termsOfService')}</Link>
              <Link to="/warranty" className="block text-gray-400 hover:text-white text-sm transition-colors">{t('warranty')}</Link>
              <Link to="/compare" className="block text-gray-400 hover:text-white text-sm transition-colors">{t('compare')}</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3">{t('contactUs')}</h3>
            <div className="space-y-2">
              {contactPhone && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>{contactPhone}</span>
                </div>
              )}
              <div className="flex items-center gap-3 mt-3">
                {whatsappLink && (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" style={{ color: primaryColor }}>
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
                {instagramLink && (
                  <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" style={{ color: primaryColor }}>
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {facebookLink && (
                  <a href={facebookLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" style={{ color: primaryColor }}>
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {tiktokLink && (
                  <a href={tiktokLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" style={{ color: primaryColor }}>
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-xs">{footerText}</p>
        </div>
      </div>
    </footer>
  );
}
