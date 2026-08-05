// ============================================================
// Admin Laptops Tab - CRUD operations with image picker, variants, bilingual
// ============================================================

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Search, ImageIcon } from 'lucide-react';
import { subscribeToLaptops, getImages, createLaptop, updateLaptop, deleteLaptop } from '@/lib/firebase';
import type { Laptop, ImageRecord, LaptopVariant } from '@/types';

const CATEGORIES = ['best-selling', 'gaming', 'business', 'student', 'new-arrivals'];

function genVariantId() {
  return 'v_' + Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
}

export function LaptopsTab() {
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Laptop | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    return subscribeToLaptops(setLaptops);
  }, []);

  useEffect(() => {
    async function load() {
      const imgs = await getImages();
      setImages(imgs);
    }
    load();
  }, []);

  const filtered = laptops.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search laptops..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500/50"
          />
        </div>
        <button
          onClick={() => { setCreating(true); setEditing(null); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-500 text-black text-sm font-medium hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Laptop
        </button>
      </div>

      {/* Laptops table */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-sm">No laptops found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs border-b border-white/5">
                  <th className="text-left p-4 font-medium">Image</th>
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Variants</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium">Active</th>
                  <th className="text-left p-4 font-medium">Best Seller</th>
                  <th className="p-4 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="p-4">
                      <img src={l.image} alt={l.name} className="w-12 h-10 object-cover rounded" />
                    </td>
                    <td className="p-4 text-white">
                      {l.name}
                      {l.nameAr && <span className="block text-gray-500 text-xs" dir="rtl">{l.nameAr}</span>}
                    </td>
                    <td className="p-4 text-green-400 font-medium">{l.price.toLocaleString()} EGP</td>
                    <td className="p-4 text-gray-400 text-xs">
                      {l.variants?.length || 0} configs
                    </td>
                    <td className="p-4 text-gray-400">{l.category}</td>
                    <td className="p-4">
                      <span className={l.inStock ? 'text-green-400' : 'text-red-400'}>
                        {l.inStock ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={l.isActive ? 'text-green-400' : 'text-gray-500'}>
                        {l.isActive ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={l.bestSeller ? 'text-yellow-400' : 'text-gray-500'}>
                        {l.bestSeller ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditing(l); setCreating(false); }}
                          className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => { if (confirm('Delete this laptop?')) await deleteLaptop(l.id); }}
                          className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {(editing || creating) && (
        <LaptopForm
          laptop={editing}
          images={images.filter(img => img.isActive)}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={async (data) => {
            if (editing) {
              await updateLaptop(editing.id, data);
              setEditing(null);
            } else {
              await createLaptop(data as Omit<Laptop, 'id'>);
              setCreating(false);
            }
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// Laptop Form Modal
// ============================================================
function LaptopForm({ laptop, images, onClose, onSave }: {
  laptop: Laptop | null;
  images: ImageRecord[];
  onClose: () => void;
  onSave: (data: Partial<Laptop>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: laptop?.name || '',
    nameAr: laptop?.nameAr || '',
    price: laptop?.price || 0,
    category: laptop?.category || 'best-selling',
    cpu: laptop?.cpu || '',
    ram: laptop?.ram || '',
    storage: laptop?.storage || '',
    gpu: laptop?.gpu || '',
    screen: laptop?.screen || '',
    description: laptop?.description || '',
    descriptionAr: laptop?.descriptionAr || '',
    inStock: laptop?.inStock ?? true,
    isActive: laptop?.isActive ?? true,
    bestSeller: laptop?.bestSeller ?? false,
    sortOrder: laptop?.sortOrder || 0,
    image: laptop?.image || '',
    variants: (laptop?.variants || []) as LaptopVariant[],
  });
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (name === 'price' || name === 'sortOrder') {
      setForm(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Variant handlers
  const addVariant = () => {
    setForm(prev => ({
      ...prev,
      variants: [...prev.variants, { id: genVariantId(), ram: '', storage: '', price: 0, inStock: true }],
    }));
  };

  const updateVariant = (id: string, field: keyof LaptopVariant, value: string | number | boolean) => {
    setForm(prev => ({
      ...prev,
      variants: prev.variants.map(v => v.id === id ? { ...v, [field]: value } : v),
    }));
  };

  const removeVariant = (id: string) => {
    setForm(prev => ({ ...prev, variants: prev.variants.filter(v => v.id !== id) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 overflow-y-auto py-10">
      <div className="bg-[#111] rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/5 sticky top-0 bg-[#111] z-10">
          <h2 className="text-white font-semibold">{laptop ? 'Edit' : 'Add'} Laptop</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs mb-1">Name (EN) *</label>
              <input name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Name (AR)</label>
              <input name="nameAr" value={form.nameAr} onChange={handleChange} dir="rtl" className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Base Price (EGP) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required min={0} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div>
              <label className="block text-gray-400 text-xs mb-1">CPU</label>
              <input name="cpu" value={form.cpu} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Base RAM</label>
              <input name="ram" value={form.ram} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Base Storage</label>
              <input name="storage" value={form.storage} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">GPU</label>
              <input name="gpu" value={form.gpu} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-gray-400 text-xs mb-1">Screen</label>
              <input name="screen" value={form.screen} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <div>
              <label className="block text-gray-400 text-xs mb-1">Description (EN)</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 resize-none" />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Description (AR)</label>
              <textarea name="descriptionAr" value={form.descriptionAr} onChange={handleChange} dir="rtl" rows={3} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 resize-none" />
            </div>
          </div>

          {/* Variants Editor */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">Variants (RAM / Storage configurations)</h3>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs hover:bg-white/10 transition-all"
              >
                <Plus className="w-3 h-3" /> Add Variant
              </button>
            </div>
            <p className="text-gray-500 text-xs mb-3">
              Define your own RAM and storage options with individual pricing. Leave empty if the laptop has only one configuration.
            </p>
            {form.variants.length === 0 ? (
              <div className="bg-black/50 rounded-lg border border-dashed border-white/10 p-4 text-center">
                <p className="text-gray-600 text-xs">No variants. The laptop will use the base price and specs.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {form.variants.map(variant => (
                  <div key={variant.id} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-black/50 rounded-lg border border-white/10 p-3">
                    <input
                      value={variant.ram}
                      onChange={e => updateVariant(variant.id, 'ram', e.target.value)}
                      placeholder="RAM (e.g. 8GB, 16GB, 64GB)"
                      className="flex-1 px-3 py-2 rounded-lg bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-green-500/50 min-w-0"
                    />
                    <input
                      value={variant.storage}
                      onChange={e => updateVariant(variant.id, 'storage', e.target.value)}
                      placeholder="Storage (e.g. 256GB, 512GB, 1TB)"
                      className="flex-1 px-3 py-2 rounded-lg bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-green-500/50 min-w-0"
                    />
                    <input
                      type="number"
                      value={variant.price}
                      onChange={e => updateVariant(variant.id, 'price', Number(e.target.value))}
                      placeholder="Price (EGP)"
                      className="w-full sm:w-28 px-3 py-2 rounded-lg bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-green-500/50"
                    />
                    <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={variant.inStock}
                        onChange={e => updateVariant(variant.id, 'inStock', e.target.checked)}
                        className="rounded border-white/20 bg-black text-green-500 focus:ring-green-500"
                      />
                      Stock
                    </label>
                    <button
                      type="button"
                      onClick={() => removeVariant(variant.id)}
                      className="p-1.5 rounded text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          <div className="pt-2 border-t border-white/5">
            <label className="block text-gray-400 text-xs mb-1">Image</label>
            <div className="flex gap-2">
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Image URL or base64..."
                className="flex-1 px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50"
              />
              <button
                type="button"
                onClick={() => setShowImagePicker(!showImagePicker)}
                className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>
            {form.image && (
              <img src={form.image} alt="Preview" className="mt-2 w-24 h-16 object-cover rounded" />
            )}
            {showImagePicker && (
              <div className="mt-2 grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-black rounded-lg border border-white/10">
                {images.length === 0 ? (
                  <p className="text-gray-500 text-xs col-span-full py-4 text-center">No active images. Upload images first.</p>
                ) : (
                  images.map(img => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => { setForm(prev => ({ ...prev, image: img.path })); setShowImagePicker(false); }}
                      className="aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-green-500/50 transition-all"
                    >
                      <img src={img.path} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sort + Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div>
              <label className="block text-gray-400 text-xs mb-1">Sort Order</label>
              <input name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50" />
            </div>
            <div className="flex gap-4 items-end flex-wrap">
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} className="rounded border-white/20 bg-black text-green-500 focus:ring-green-500" />
                In Stock
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="rounded border-white/20 bg-black text-green-500 focus:ring-green-500" />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input type="checkbox" name="bestSeller" checked={form.bestSeller} onChange={handleChange} className="rounded border-white/20 bg-black text-green-500 focus:ring-green-500" />
                Best Seller
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-[#111] py-3">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2.5 rounded-lg bg-green-500 text-black font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-all">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
