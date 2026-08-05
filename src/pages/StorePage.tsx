// ============================================================
// Store Page - Homepage with hero, search, filters, product grid
// ============================================================

import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, ChevronLeft, ChevronRight, Eye, Plus, ChartBar as BarChart3 } from 'lucide-react';
import { subscribeToLaptops, addCompareId, getCompareIds } from '@/lib/firebase';
import { useSettings } from '@/hooks/useSettings';
import { useCart } from '@/hooks/useCart';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/useToast';
import { useLanguage } from '@/hooks/useLanguage';
import type { Laptop } from '@/types';

const CATEGORIES = [
  { id: 'all', nameKey: 'all', slug: 'all' },
  { id: 'best-selling', nameKey: 'bestSelling', slug: 'best-selling' },
  { id: 'gaming', nameKey: 'gaming', slug: 'gaming' },
  { id: 'business', nameKey: 'business', slug: 'business' },
  { id: 'student', nameKey: 'student', slug: 'student' },
  { id: 'new-arrivals', nameKey: 'newArrivals', slug: 'new-arrivals' },
] as const;

const ITEMS_PER_PAGE = 6;

export function StorePage() {
  const { settings } = useSettings();
  const { addItem } = useCart();
  const { addToast } = useToast();
  const { lang, t } = useLanguage();
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [compareIds, setCompareIds] = useState<string[]>(getCompareIds());

  const debouncedSearch = useDebounce(searchQuery, 300);
  const primaryColor = settings?.primaryColor || '#00ff00';

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToLaptops(data => {
      setLaptops(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const getLaptopName = (l: Laptop) => (lang === 'ar' && l.nameAr) ? l.nameAr : l.name;

  const filteredLaptops = useMemo(() => {
    let result = laptops;

    if (activeCategory !== 'all') {
      result = result.filter(l => l.category === activeCategory);
    }

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(l => {
        const name = getLaptopName(l).toLowerCase();
        return name.includes(q) || l.name.toLowerCase().includes(q);
      });
    }

    result = result.filter(l => l.isActive);

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [laptops, activeCategory, debouncedSearch, lang]);

  const totalPages = Math.max(1, Math.ceil(filteredLaptops.length / ITEMS_PER_PAGE));
  const paginatedLaptops = filteredLaptops.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const bestSellers = laptops.filter(l => l.bestSeller && l.isActive).slice(0, 4);

  const handleAddToCart = (laptop: Laptop) => {
    addItem({
      laptopId: laptop.id,
      name: getLaptopName(laptop),
      price: laptop.price,
      image: laptop.image,
    });
    addToast(`${getLaptopName(laptop)} ${lang === 'ar' ? 'أضيف للسلة' : 'added to cart'}`, 'success');
  };

  const handleAddCompare = (id: string) => {
    addCompareId(id);
    setCompareIds(getCompareIds());
    addToast(lang === 'ar' ? 'أضيف للمقارنة' : 'Added to comparison', 'success');
  };

  const heroTitle = lang === 'ar' ? (settings?.heroTitleAr || settings?.heroTitle || t('home')) : (settings?.heroTitle || t('home'));
  const heroSubtitle = lang === 'ar' ? (settings?.heroSubtitleAr || settings?.heroSubtitle || '') : (settings?.heroSubtitle || '');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${primaryColor} 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight"
            style={{ textShadow: `0 0 40px ${primaryColor}40` }}
          >
            {heroTitle}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
              <Star className="w-5 h-5" style={{ color: primaryColor }} />
              {t('bestSellers')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bestSellers.map(laptop => (
                <ProductCard
                  key={laptop.id}
                  laptop={laptop}
                  primaryColor={primaryColor}
                  onAddToCart={handleAddToCart}
                  onAddCompare={handleAddCompare}
                  isCompared={compareIds.includes(laptop.id)}
                  lang={lang}
                  t={t}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search & Filters */}
      <section className="px-4 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Search bar */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none transition-all text-sm focus:border-green-500/50"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.slug); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  activeCategory === cat.slug
                    ? 'text-black border-transparent'
                    : 'text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
                }`}
                style={activeCategory === cat.slug ? { backgroundColor: primaryColor } : {}}
              >
                {t(cat.nameKey)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/5 rounded-xl border border-white/10 h-[360px] animate-pulse" />
              ))}
            </div>
          ) : paginatedLaptops.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{t('noLaptopsFound')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedLaptops.map(laptop => (
                  <ProductCard
                    key={laptop.id}
                    laptop={laptop}
                    primaryColor={primaryColor}
                    onAddToCart={handleAddToCart}
                    onAddCompare={handleAddCompare}
                    isCompared={compareIds.includes(laptop.id)}
                    lang={lang}
                    t={t}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-gray-400 text-sm">
                    {t('page')} {currentPage} {t('of')} {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

// ============================================================
// Product Card Component
// ============================================================
function ProductCard({ laptop, primaryColor, onAddToCart, onAddCompare, isCompared, lang, t }: {
  laptop: Laptop;
  primaryColor: string;
  onAddToCart: (l: Laptop) => void;
  onAddCompare: (id: string) => void;
  isCompared: boolean;
  lang: 'en' | 'ar';
  t: (key: import('@/lib/translations').TranslationKey) => string;
}) {
  const name = (lang === 'ar' && laptop.nameAr) ? laptop.nameAr : laptop.name;
  const hasVariants = laptop.variants && laptop.variants.length > 0;

  return (
    <div className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5 hover:scale-[1.02]"
    >
      {/* Image */}
      <Link to={`/product/${laptop.id}`} className="block relative overflow-hidden aspect-[4/3]">
        <img
          src={laptop.image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {laptop.bestSeller && (
          <span
            className="absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-bold text-black uppercase tracking-wide"
            style={{ backgroundColor: primaryColor }}
          >
            {t('bestSeller')}
          </span>
        )}
        {!laptop.inStock && (
          <span className="absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold bg-red-500 text-white uppercase tracking-wide">
            {t('outOfStock')}
          </span>
        )}
        {hasVariants && (
          <span className="absolute bottom-2 left-2 px-2 py-1 rounded text-[10px] font-medium bg-black/70 text-white">
            {laptop.variants.length} {lang === 'ar' ? 'تجهيزة' : 'configs'}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${laptop.id}`}>
          <h3 className="text-white font-semibold text-sm mb-1">
            {name}
          </h3>
        </Link>
        <p className="font-bold mb-3" style={{ color: primaryColor }}>
          {laptop.price.toLocaleString()} EGP
        </p>

        <div className="flex gap-2">
          <Link
            to={`/product/${laptop.id}`}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all text-xs"
          >
            <Eye className="w-3 h-3" /> {t('details')}
          </Link>
          <button
            onClick={() => onAddCompare(laptop.id)}
            disabled={isCompared}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
            title={t('compare')}
          >
            <BarChart3 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onAddToCart(laptop)}
            disabled={!laptop.inStock}
            className="p-2 rounded-lg text-black transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ backgroundColor: primaryColor }}
            title={t('addToCart')}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
