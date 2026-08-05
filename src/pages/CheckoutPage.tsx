// ============================================================
// Checkout Page - Egyptian COD only, with honeypot protection
// ============================================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useSettings } from '@/hooks/useSettings';
import { createOrder, clearCart, getSessionId } from '@/lib/firebase';
import { useToast } from '@/hooks/useToast';

export function CheckoutPage() {
  const { items, totalPrice, clearAll } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const primaryColor = settings?.primaryColor || '#00ff00';

  // Honeypot field - hidden, must be empty
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
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^01\d{9}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter valid Egyptian number (01XXXXXXXXX)';
    if (!form.street.trim()) e.street = 'Street is required';
    if (!form.building.trim()) e.building = 'Building number is required';
    if (!form.apartment.trim()) e.apartment = 'Apartment is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.governorate.trim()) e.governorate = 'Governorate is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, silently reject (bot detected)
    if (honeypot !== '') {
      return;
    }

    if (!validate()) return;
    if (items.length === 0) {
      addToast('Your cart is empty', 'error');
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
        })),
        total: `${totalPrice.toLocaleString()} EGP`,
        status: 'new',
        createdAt: new Date().toISOString(),
      });

      // Clear cart
      await clearCart(getSessionId());
      await clearAll();

      setSubmitted(true);
      addToast('Order placed successfully!', 'success');
    } catch {
      addToast('Failed to place order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-md mx-auto text-center py-20">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: primaryColor }} />
          <h2 className="text-2xl font-bold text-white mb-2">Order Placed!</h2>
          <p className="text-gray-400 mb-6">
            Thank you for your order. We will contact you shortly to confirm delivery details.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl text-black font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-screen pt-24 px-4 text-center">
        <p className="text-gray-400">Your cart is empty</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white text-sm">
          Back to store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/cart" className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to cart
        </Link>

        <h1 className="text-2xl font-bold text-white mb-6">Checkout</h1>

        {/* Honeypot - hidden from real users, traps bots */}
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
            <h3 className="text-white font-semibold mb-3 text-sm">Order Summary</h3>
            <div className="space-y-2 mb-3">
              {items.map(item => (
                <div key={item.laptopId} className="flex justify-between text-sm">
                  <span className="text-gray-400">{item.name} x{item.quantity}</span>
                  <span className="text-gray-300">{(item.price * item.quantity).toLocaleString()} EGP</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between">
              <span className="text-white font-semibold">Total</span>
              <span className="text-xl font-bold" style={{ color: primaryColor }}>
                {totalPrice.toLocaleString()} EGP
              </span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-4">
            <h3 className="text-white font-semibold text-sm">Delivery Information</h3>

            <div>
              <label className="block text-gray-400 text-xs mb-1">Full Name *</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-opacity-50 transition-all"
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-gray-400 text-xs mb-1">Phone Number * <span className="text-gray-600">(01XXXXXXXXX)</span></label>
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
                <label className="block text-gray-400 text-xs mb-1">Street *</label>
                <input
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-opacity-50 transition-all"
                  placeholder="Street name"
                />
                {errors.street && <p className="text-red-400 text-xs mt-1">{errors.street}</p>}
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">Building *</label>
                <input
                  name="building"
                  value={form.building}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-opacity-50 transition-all"
                  placeholder="Building number"
                />
                {errors.building && <p className="text-red-400 text-xs mt-1">{errors.building}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-400 text-xs mb-1">Apartment *</label>
                <input
                  name="apartment"
                  value={form.apartment}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-opacity-50 transition-all"
                  placeholder="Apt #"
                />
                {errors.apartment && <p className="text-red-400 text-xs mt-1">{errors.apartment}</p>}
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">City *</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-opacity-50 transition-all"
                  placeholder="City"
                />
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">Governorate *</label>
                <input
                  name="governorate"
                  value={form.governorate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-opacity-50 transition-all"
                  placeholder="Governorate"
                />
                {errors.governorate && <p className="text-red-400 text-xs mt-1">{errors.governorate}</p>}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-xs mb-1">Landmark <span className="text-gray-600">(Optional)</span></label>
              <input
                name="landmark"
                value={form.landmark}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-opacity-50 transition-all"
                placeholder="e.g. Near Cairo Mall"
              />
            </div>
          </div>

          {/* Payment Method - COD Only */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <h3 className="text-white font-semibold text-sm">Payment Method</h3>
            </div>
            <div className="flex items-center gap-3 bg-black/50 rounded-lg border border-white/10 px-4 py-3">
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: primaryColor }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Cash on Delivery</p>
                <p className="text-gray-500 text-xs">Pay when you receive your order</p>
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
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}
