// ============================================================
// Compare Page - Side-by-side laptop comparison (up to 4)
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, BarChart3, ArrowLeft } from 'lucide-react';
import { getCompareIds, clearCompareIds, removeCompareId, getLaptops } from '@/lib/firebase';
import { useSettings } from '@/hooks/useSettings';
import type { Laptop } from '@/types';

export function ComparePage() {
  const { settings } = useSettings();
  const primaryColor = settings?.primaryColor || '#00ff00';
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>(getCompareIds());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const all = await getLaptops();
      setLaptops(all);
      setLoading(false);
    }
    load();
  }, []);

  const comparedLaptops = laptops.filter(l => compareIds.includes(l.id) && l.isActive);

  const handleRemove = (id: string) => {
    removeCompareId(id);
    setCompareIds(getCompareIds());
  };

  const handleClear = () => {
    clearCompareIds();
    setCompareIds([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (comparedLaptops.length === 0) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          <BarChart3 className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h2 className="text-white text-xl font-semibold mb-2">No laptops to compare</h2>
          <p className="text-gray-500 mb-6">Add laptops from the store to compare their specifications.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-black font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Laptops
          </Link>
        </div>
      </div>
    );
  }

  const specs = [
    { label: 'Price', key: 'price' as const, format: (v: number) => `${v.toLocaleString()} EGP` },
    { label: 'Processor', key: 'cpu' as const },
    { label: 'RAM', key: 'ram' as const },
    { label: 'Storage', key: 'storage' as const },
    { label: 'Graphics', key: 'gpu' as const },
    { label: 'Screen', key: 'screen' as const },
    { label: 'Category', key: 'category' as const },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Compare Laptops</h1>
          <button
            onClick={handleClear}
            className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </button>
        </div>

        {/* Horizontal scrollable comparison */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <div className="min-w-[800px]">
            <div className={`grid gap-4`} style={{ gridTemplateColumns: `140px repeat(${comparedLaptops.length}, 1fr)` }}>
              {/* Header row */}
              <div className="text-gray-500 text-xs font-medium py-3">Feature</div>
              {comparedLaptops.map(laptop => (
                <div key={laptop.id} className="text-center">
                  <Link to={`/product/${laptop.id}`} className="block group">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2 bg-white/5 border border-white/10">
                      <img src={laptop.image} alt={laptop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <h3 className="text-white text-sm font-semibold group-hover:opacity-80 transition-opacity">{laptop.name}</h3>
                  </Link>
                  <button
                    onClick={() => handleRemove(laptop.id)}
                    className="mt-2 text-red-400 hover:text-red-300 text-xs flex items-center gap-1 mx-auto transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              ))}

              {/* Spec rows */}
              {specs.map(spec => (
                <>
                  <div key={spec.label} className="text-gray-400 text-xs py-3 border-t border-white/5">{spec.label}</div>
                  {comparedLaptops.map(laptop => (
                    <div key={`${spec.key}-${laptop.id}`} className="text-center py-3 border-t border-white/5">
                      <span
                        className="text-sm text-gray-300"
                        style={spec.key === 'price' ? { color: primaryColor, fontWeight: 600 } : {}}
                      >
                        {spec.format ? spec.format(laptop[spec.key] as unknown as number) : (laptop[spec.key] as unknown as string)}
                      </span>
                    </div>
                  ))}
                </>
              ))}

              {/* In Stock row */}
              <div className="text-gray-400 text-xs py-3 border-t border-white/5">Availability</div>
              {comparedLaptops.map(laptop => (
                <div key={`stock-${laptop.id}`} className="text-center py-3 border-t border-white/5">
                  <span className={`text-xs font-medium ${laptop.inStock ? 'text-green-400' : 'text-red-400'}`}>
                    {laptop.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
