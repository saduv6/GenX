// ============================================================
// Cart Page - Item list, quantity controls, remove, total
// ============================================================

import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useSettings } from '@/hooks/useSettings';
import { useLanguage } from '@/hooks/useLanguage';

export function CartPage() {
  const { items, loading, removeItem, updateQuantity, totalPrice, clearAll } = useCart();
  const { settings } = useSettings();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const primaryColor = settings?.primaryColor || '#00ff00';

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h2 className="text-white text-xl font-semibold mb-2">{t('yourCartIsEmpty')}</h2>
          <p className="text-gray-500 mb-6">{t('cartEmptyDesc')}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-black font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">{t('shoppingCart')}</h1>
          <button
            onClick={clearAll}
            className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t('clearAll')}
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {items.map(item => (
            <div
              key={item.laptopId + (item.variantId || '')}
              className="flex flex-col sm:flex-row gap-4 bg-white/5 rounded-xl border border-white/10 p-4 items-center"
            >
              {/* Image */}
              <Link to={`/product/${item.laptopId}`} className="w-full sm:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </Link>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <Link to={`/product/${item.laptopId}`}>
                  <h3 className="text-white font-medium text-sm hover:opacity-80 transition-opacity">{item.name}</h3>
                </Link>
                {item.variantLabel && (
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-green-500/15 text-green-400 text-xs font-medium">
                    {item.variantLabel}
                  </span>
                )}
                <p className="font-semibold text-sm mt-1" style={{ color: primaryColor }}>
                  {item.price.toLocaleString()} EGP
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 bg-white/5 rounded-lg border border-white/10 px-3 py-1.5">
                <button
                  onClick={() => updateQuantity(item.laptopId, item.quantity - 1, item.variantId)}
                  disabled={item.quantity <= 1}
                  className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-white font-semibold w-6 text-center text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.laptopId, item.quantity + 1, item.variantId)}
                  disabled={item.quantity >= 10}
                  className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Subtotal */}
              <p className="text-white font-semibold text-sm w-20 text-right hidden sm:block">
                {(item.price * item.quantity).toLocaleString()} EGP
              </p>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.laptopId, item.variantId)}
                className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Total & Checkout */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">{t('total')} ({items.reduce((s, i) => s + i.quantity, 0)} {t('items')})</span>
            <span className="text-2xl font-bold text-white">{totalPrice.toLocaleString()} EGP</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3 rounded-xl text-black font-semibold transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ backgroundColor: primaryColor }}
          >
            {t('proceedToCheckout')}
          </button>
          <Link
            to="/"
            className="block text-center mt-3 text-gray-400 hover:text-white text-sm transition-colors"
          >
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
}
