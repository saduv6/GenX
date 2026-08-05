// ============================================================
// Header - Glassmorphism, dynamic logo, cart, mobile menu, lang toggle
// ============================================================

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Laptop, Languages } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useSettings } from '@/hooks/useSettings';
import { useLanguage } from '@/hooks/useLanguage';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { settings } = useSettings();
  const location = useLocation();
  const { lang, toggleLang, t } = useLanguage();

  const primaryColor = settings?.primaryColor || '#00ff00';
  const logoUrl = settings?.logoUrl;
  const storeName = lang === 'ar' ? (settings?.storeNameAr || settings?.storeName || 'GenX Laptop') : (settings?.storeName || 'GenX Laptop');

  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/faq', label: t('faq') },
    { to: '/compare', label: t('compare') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-8 w-auto" />
            ) : (
              <Laptop className="w-7 h-7 transition-transform group-hover:scale-110" style={{ color: primaryColor }} />
            )}
            <span className="text-white font-bold text-lg tracking-wide hidden sm:block">{storeName}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-white shadow-[0_0_10px_rgba(0,255,0,0.2)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                style={isActive(link.to) ? { backgroundColor: `${primaryColor}15`, color: primaryColor } : {}}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              title={lang === 'en' ? 'العربية' : 'English'}
            >
              <Languages className="w-4 h-4" />
              <span>{lang === 'en' ? 'ع' : 'EN'}</span>
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-black animate-in zoom-in"
                  style={{ backgroundColor: primaryColor }}
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/5">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.to)
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                style={isActive(link.to) ? { backgroundColor: `${primaryColor}15`, color: primaryColor } : {}}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              {t('cart')} ({totalItems})
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
