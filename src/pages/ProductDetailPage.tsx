// ============================================================
// Product Detail Page - Full specs, quantity selector, add to cart
// Fixed: no flickering, stable data fetching on id change
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { getLaptopById } from '@/lib/firebase';
import { useSettings } from '@/hooks/useSettings';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import type { Laptop } from '@/types';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { settings } = useSettings();
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [laptop, setLaptop] = useState<Laptop | null>(null);
  const [loading, setLoading] = useState(true);
  const primaryColor = settings?.primaryColor || '#00ff00';

  // Stable data fetching — only runs when id changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLaptop(null);
    setQuantity(1);

    async function load() {
      if (!id) return;
      try {
        const data = await getLaptopById(id);
        if (!cancelled) {
          setLaptop(data);
        }
      } catch {
        if (!cancelled) {
          setLaptop(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleAddToCart = () => {
    if (!laptop || !laptop.inStock) return;
    addItem({
      laptopId: laptop.id,
      name: laptop.name,
      price: laptop.price,
      image: laptop.image,
    }, quantity);
    addToast(`${laptop.name} added to cart (${quantity})`, 'success');
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
        <p className="text-gray-400 text-lg">Product not found</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white text-sm transition-colors">
          Back to store
        </Link>
      </div>
    );
  }

  const specs = [
    { label: 'Processor', value: laptop.cpu },
    { label: 'RAM', value: laptop.ram },
    { label: 'Storage', value: laptop.storage },
    { label: 'Graphics', value: laptop.gpu },
    { label: 'Display', value: laptop.screen },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to store
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden aspect-[4/3] flex items-center justify-center">
            <img
              src={laptop.image}
              alt={laptop.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {laptop.bestSeller && (
                <span className="px-2 py-1 rounded text-[10px] font-bold text-black uppercase" style={{ backgroundColor: primaryColor }}>
                  Best Seller
                </span>
              )}
              <span className="px-2 py-1 rounded text-[10px] font-medium bg-white/5 text-gray-400 uppercase">
                {laptop.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">{laptop.name}</h1>
            <p className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>
              {laptop.price.toLocaleString()} EGP
            </p>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-6">
              {laptop.inStock ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">In Stock</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{laptop.description}</p>

            {/* Specs */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-6">
              <h3 className="text-white font-semibold text-sm mb-3">Specifications</h3>
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
            {laptop.inStock && (
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
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
