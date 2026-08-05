// ============================================================
// Checkout Page - Egyptian COD only, with honeypot protection
// ============================================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Shield, CircleCheck as CheckCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useSettings } from '@/hooks/useSettings';
import { createOrder, clearCart, getSessionId } from '@/lib/firebase';
import { useToast } from '@/hooks/useToast';
import { useLanguage } from '@/hooks/useLanguage';

export function CheckoutPage() {
  const { items, totalPrice, clearAll } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const primaryColor = settings?.primaryColor || '#00ff00';

  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    building: '',
    apartment: '',
    city: '',
    governorate: '',
    landmark: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => { const n = { ...prev }; delete n[e.target.name]; return n; });
    }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = t('fullNameRequired');
    if (!form.phone.trim()) e.phone = t('phoneRequired');
    else if (!/^01\d{9}$/.test(form.phone.replace(/\s/g, ''))) e.phone = t('phoneInvalid');
    if (!form.street.trim()) e.street = t('streetRequired');
    if (!form.building.trim()) e.building = t('buildingRequired');
    if (!form.apartment.trim()) e.apartment = t('apartmentRequired');
    if (!form.city.trim()) e.city = t('cityRequired');
    if (!form.governorate.trim()) e.governorate = t('governorateRequired');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot !== '') return;

    if (!validate()) return;
    if (items.length === 0) {
      addToast(t('yourCartIsEmptyShort'), 'error');
      return;
    }

    setSubmitting(true);

    try {
      const address = `${form.street}, Building ${form.building}, Apt ${form.apartment}, ${form.city}, ${form.governorate}${form.landmark ? ` (Near: ${form.landmark})` : ''}`;

      await createOrder({
        customerName: form.fullName.trim(),
        phone: form.phone.trim(),
        address,
        items: items.map(i => ({
          laptopId: i.laptopId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
          variantId: i.variantId,
          variantLabel: i.variantLabel,
        })),
        total: `${totalPrice.toLocaleString()} EGP`,
        status: 'new',
        createdAt: new Date().toISOString(),
      });

      await clearCart(getSessionId());
      await clearAll();

      setSubmitted(true);
      addToast(t('orderPlaced'), 'success');
    } catch {
      addToast(t('placingOrder'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-md mx-auto text-center py-20">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: primaryColor }} />
          <h2 className="text-2xl font-bold text-white mb-2">{t('orderPlaced')}</h2>
          <p className="text-gray-400 mb-6">
            {t('orderPlacedDesc')}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl text-black font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            {t('backToStoreBtn')}
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-screen pt-24 px-4 text-center">
        <p className="text-gray-400">{t('yourCartIsEmptyShort')}</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white text-sm">
          {t('backToStoreShort')}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/cart" className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('backToCart')}
        </Link>

        <h1 className="text-2xl font-bold text-white mb-6">{t('checkout')}</h1>

        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={e => setHoneypot(e.target.value)}
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4">
            <h3 className="text-white font-semibold mb-3 text-sm">{t('orderSummary')}</h3>
            <div className="space-y-2 mb-3">
              {items.map(item => (
                <div key={item.laptopId + (item.variantId || '')} className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    {item.name} x{item.quantity}
                    {item.variantLabel && <span className="text-gray-600 text-xs block">{item.variantLabel}</span>}
                  </span>
                  <span className="text-gray-300">{(item.price * item.quantity).toLocaleString()} EGP</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between">
              <span className="text-white font-semibold">{t('total')}</span>
              <span className="text-xl font-bold" style={{ color: primaryColor }}>
                {totalPrice.toLocaleString()} EGP
              </span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-4">
            <h3 className="text-white font-semibold text-sm">{t('deliveryInformation')}</h3>

            <div>
              <label className="block text-gray-400 text-xs mb-1">{t('fullName')} *</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-opacity-50 transition-all"
                placeholder={t('fullName')}
              />
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-gray-400 text-xs mb-1">{t('phoneNumber')} * <span className="text-gray-600">(01XXXXXXXXX)</span></label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-opacity-50 transition-all"
                placeholder="01XXXXXXXXX"
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-xs mb-1">{t('street')} *</label>
                <input name="street" value={form.street} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-opacity-50 transition-all" placeholder={t('street')} />
                {errors.street && <p className="text-red-400 text-xs mt-1">{errors.street}</p>}
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">{t('building')} *</label>
                <input name="building" value={form.building} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-opacity-50 transition-all" placeholder={t('building')} />
                {errors.building && <p className="text-red-400 text-xs mt-1">{errors.building}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-400 text-xs mb-1">{t('apartment')} *</label>
                <input name="apartment" value={form.apartment} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-opacity-50 transition-all" placeholder={t('apartment')} />
                {errors.apartment && <p className="text-red-400 text-xs mt-1">{errors.apartment}</p>}
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">{t('city')} *</label>
                <input name="city" value={form.city} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-opacity-50 transition-all" placeholder={t('city')} />
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">{t('governorate')} *</label>
                <input name="governorate" value={form.governorate} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-opacity-50 transition-all" placeholder={t('governorate')} />
                {errors.governorate && <p className="text-red-400 text-xs mt-1">{errors.governorate}</p>}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-xs mb-1">{t('landmarkOptional')}</label>
              <input name="landmark" value={form.landmark} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-opacity-50 transition-all" placeholder={t('landmark')} />
            </div>
          </div>

          {/* Payment Method - COD Only */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <h3 className="text-white font-semibold text-sm">{t('paymentMethod')}</h3>
            </div>
            <div className="flex items-center gap-3 bg-black/50 rounded-lg border border-white/10 px-4 py-3">
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: primaryColor }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              </div>
              <div>
                <p className="text-white text-sm font-medium">{t('cashOnDelivery')}</p>
                <p className="text-gray-500 text-xs">{t('codDesc')}</p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl text-black font-semibold transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: primaryColor }}
          >
            {submitting ? t('placingOrder') : t('placeOrder')}
          </button>
        </form>
      </div>
    </div>
  );
}
