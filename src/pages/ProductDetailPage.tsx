// ============================================================
// Product Detail Page - Full specs, variant selector, add to cart
// Variants use relative price adjustments from the base price.
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react';
import { getLaptopById } from '@/lib/firebase';
import { useSettings } from '@/hooks/useSettings';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { useLanguage } from '@/hooks/useLanguage';
import type { Laptop, LaptopVariant } from '@/types';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { settings } = useSettings();
  const { addItem } = useCart();
  const { addToast } = useToast();
  const { lang, t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [laptop, setLaptop] = useState<Laptop | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<LaptopVariant | null>(null);
  const primaryColor = settings?.primaryColor || '#00ff00';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLaptop(null);
    setQuantity(1);
    setSelectedVariant(null);

    async function load() {
      if (!id) return;
      try {
        const data = await getLaptopById(id);
        if (!cancelled) {
          setLaptop(data);
          // Default to base config (null), not auto-selecting a variant
        }
      } catch {
        if (!cancelled) setLaptop(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  const getLaptopName = (l: Laptop) => (lang === 'ar' && l.nameAr) ? l.nameAr : l.name;
  const getDescription = (l: Laptop) => (lang === 'ar' && l.descriptionAr) ? l.descriptionAr : l.description;

  const basePrice = laptop?.price || 0;
  const currentPrice = selectedVariant
    ? basePrice + selectedVariant.priceAdjustment
    : basePrice;
  const currentStock = selectedVariant ? selectedVariant.inStock : (laptop?.inStock ?? false);

  const handleAddToCart = () => {
    if (!laptop || !currentStock) return;
    const variantLabel = selectedVariant
      ? `${selectedVariant.ram} / ${selectedVariant.storage}`
      : undefined;
    addItem({
      laptopId: laptop.id,
      name: getLaptopName(laptop),
      price: currentPrice,
      image: laptop.image,
      variantId: selectedVariant?.id,
      variantLabel,
    }, quantity);
    addToast(`${getLaptopName(laptop)} ${lang === 'ar' ? 'أضيف للسلة' : 'added to cart'} (${quantity})`, 'success');
  };

  const handleVariantClick = (variant: LaptopVariant) => {
    // Toggle: if already selected, deselect back to base config
    if (selectedVariant?.id === variant.id) {
      setSelectedVariant(null);
    } else {
      setSelectedVariant(variant);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: `${primaryColor}30`, borderTopColor: primaryColor }} />
      </div>
    );
  }

  if (!laptop) {
    return (
      <div className="min-h-screen pt-24 px-4 text-center">
        <p className="text-gray-400 text-lg">{t('productNotFound')}</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white text-sm transition-colors">
          {t('backToStore')}
        </Link>
      </div>
    );
  }

  const hasVariants = laptop.variants && laptop.variants.length > 0;

  // Show specs: if variant selected, show variant RAM/storage, otherwise base
  const displayRam = selectedVariant ? selectedVariant.ram : laptop.ram;
  const displayStorage = selectedVariant ? selectedVariant.storage : laptop.storage;

  const specs = [
    { label: t('processor'), value: laptop.cpu },
    { label: t('ram'), value: displayRam },
    { label: t('storage'), value: displayStorage },
    { label: t('graphics'), value: laptop.gpu },
    { label: t('display'), value: laptop.screen },
  ];

  const formatAdjustment = (adj: number) => {
    if (adj === 0) return '';
    if (adj > 0) return `+${adj.toLocaleString()}`;
    return adj.toLocaleString();
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('backToStore')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden aspect-[4/3] flex items-center justify-center">
            <img
              src={laptop.image}
              alt={getLaptopName(laptop)}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {laptop.bestSeller && (
                <span className="px-2 py-1 rounded text-[10px] font-bold text-black uppercase" style={{ backgroundColor: primaryColor }}>
                  {t('bestSeller')}
                </span>
              )}
              <span className="px-2 py-1 rounded text-[10px] font-medium bg-white/5 text-gray-400 uppercase">
                {laptop.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">{getLaptopName(laptop)}</h1>
            <p className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>
              {currentPrice.toLocaleString()} EGP
            </p>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-6">
              {currentStock ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">{t('inStock')}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">{t('outOfStockLabel')}</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{getDescription(laptop)}</p>

            {/* Variant Selector */}
            {hasVariants && (
              <div className="mb-6">
                <h3 className="text-white font-semibold text-sm mb-3">{t('selectVariant')}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {/* Base Configuration option */}
                  <button
                    onClick={() => setSelectedVariant(null)}
                    className={`p-3 rounded-xl border text-sm transition-all ${
                      selectedVariant === null
                        ? 'border-transparent text-black font-semibold'
                        : 'border-white/10 text-gray-300 hover:border-white/30'
                    }`}
                    style={selectedVariant === null ? { backgroundColor: primaryColor } : {}}
                  >
                    <div className="font-bold">{lang === 'ar' ? 'أساسي' : 'Base'}</div>
                    <div className="text-xs mt-1">{laptop.ram} / {laptop.storage}</div>
                    <div className="text-xs mt-0.5">{basePrice.toLocaleString()} EGP</div>
                  </button>

                  {/* Variant options */}
                  {laptop.variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantClick(variant)}
                      disabled={!variant.inStock}
                      className={`p-3 rounded-xl border text-sm transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-transparent text-black font-semibold'
                          : 'border-white/10 text-gray-300 hover:border-white/30'
                      } ${!variant.inStock ? 'opacity-40 cursor-not-allowed' : ''}`}
                      style={selectedVariant?.id === variant.id ? { backgroundColor: primaryColor } : {}}
                    >
                      <div className="font-bold">{variant.ram} / {variant.storage}</div>
                      <div className="text-xs mt-1">{(basePrice + variant.priceAdjustment).toLocaleString()} EGP</div>
                      {variant.priceAdjustment !== 0 && (
                        <div className={`text-[10px] mt-0.5 ${variant.priceAdjustment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatAdjustment(variant.priceAdjustment)} EGP
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedVariant === null && (
                  <p className="text-gray-500 text-xs mt-2">
                    {lang === 'ar' ? 'التجهيزة الأساسية محددة. يمكنك اختيار تجهيزة أخرى أعلاه.' : 'Base configuration selected. Choose another option above to upgrade or downgrade.'}
                  </p>
                )}
              </div>
            )}

            {/* Specs */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-6">
              <h3 className="text-white font-semibold text-sm mb-3">{t('specifications')}</h3>
              <div className="space-y-2">
                {specs.map(spec => (
                  <div key={spec.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{spec.label}</span>
                    <span className="text-gray-300">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            {currentStock && (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 bg-white/5 rounded-xl border border-white/10 px-4 py-2">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-1 rounded text-gray-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-white font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(10, q + 1))}
                    className="p-1 rounded text-gray-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-black font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ backgroundColor: primaryColor }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {t('addToCart')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
