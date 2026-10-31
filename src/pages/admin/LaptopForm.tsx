// ============================================================
// Laptop Form Modal - bilingual details, SKU, categories, specs, gallery, variants
// ============================================================

import { useState } from 'react';
import { Plus, Trash2, X, RefreshCw } from 'lucide-react';
import type { Laptop, LaptopVariant, Category, ImageRecord, ProductSpec } from '@/types';
import { ProductImagesEditor } from './ProductImagesEditor';
import { ProductSpecsEditor } from './ProductSpecsEditor';
import { findSkuConflict, generateSku, getProductImages, isValidSku, normalizeSku } from '@/lib/product-utils';

interface LaptopFormProps {
  laptop: Laptop | null;
  laptops: Laptop[];
  categories: Category[];
  library: ImageRecord[];
  onLibraryChange: (library: ImageRecord[]) => void;
  onClose: () => void;
  onSave: (data: Omit<Laptop, 'id'>) => Promise<void>;
}

function genVariantId() {
  return 'v_' + Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
}

const inputClass = 'w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50';
const labelClass = 'block text-gray-400 text-xs mb-1';

export function LaptopForm({ laptop, laptops, categories, library, onLibraryChange, onClose, onSave }: LaptopFormProps) {
  const [form, setForm] = useState({
    name: laptop?.name || '',
    nameAr: laptop?.nameAr || '',
    sku: laptop?.sku || '',
    price: laptop?.price || 0,
    categories: laptop?.categories?.length ? laptop.categories : (laptop?.category ? [laptop.category] : []),
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
    images: laptop ? getProductImages(laptop) : [] as string[],
    specs: (laptop?.specs || []) as ProductSpec[],
    variants: (laptop?.variants || []) as LaptopVariant[],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const normalizedSku = normalizeSku(form.sku);
  const skuConflict = normalizedSku ? findSkuConflict(normalizedSku, laptops, laptop?.id) : undefined;
  const sortedCategories = [...categories].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

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

  const toggleCategory = (id: string) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter(c => c !== id)
        : [...prev.categories, id],
    }));
  };

  const generateUniqueSku = () => {
    let sku = generateSku();
    for (let i = 0; i < 20 && findSkuConflict(sku, laptops, laptop?.id); i++) {
      sku = generateSku();
    }
    setForm(prev => ({ ...prev, sku }));
  };

  const addVariant = () => {
    setForm(prev => ({
      ...prev,
      variants: [...prev.variants, { id: genVariantId(), ram: '', storage: '', priceAdjustment: 0, inStock: true }],
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
    setError('');

    if (form.categories.length === 0) {
      setError('Select at least one category.');
      return;
    }

    let sku = normalizedSku;
    if (!sku) {
      sku = generateSku();
      for (let i = 0; i < 20 && findSkuConflict(sku, laptops, laptop?.id); i++) {
        sku = generateSku();
      }
    }
    if (!isValidSku(sku)) {
      setError('SKU can only contain letters, numbers, dashes and underscores (max 40 characters).');
      return;
    }
    const conflict = findSkuConflict(sku, laptops, laptop?.id);
    if (conflict) {
      setError(`SKU "${sku}" is already used by "${conflict.name}".`);
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name: form.name,
        nameAr: form.nameAr,
        sku,
        price: form.price,
        category: form.categories[0],
        categories: form.categories,
        cpu: form.cpu,
        ram: form.ram,
        storage: form.storage,
        gpu: form.gpu,
        screen: form.screen,
        description: form.description,
        descriptionAr: form.descriptionAr,
        inStock: form.inStock,
        isActive: form.isActive,
        bestSeller: form.bestSeller,
        sortOrder: form.sortOrder,
        image: form.images[0] || '',
        images: form.images,
        specs: form.specs,
        variants: form.variants,
      });
    } catch {
      setError('Could not save the laptop. Please try again.');
    } finally {
      setSaving(false);
    }
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
              <label className={labelClass}>Name (EN) *</label>
              <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Name (AR)</label>
              <input name="nameAr" value={form.nameAr} onChange={handleChange} dir="rtl" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>SKU</label>
              <div className="flex gap-2">
                <input name="sku" value={form.sku} onChange={handleChange} placeholder="Leave empty to auto-generate" className={`${inputClass} font-mono uppercase`} />
                <button type="button" onClick={generateUniqueSku} title="Generate SKU" className="px-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              {skuConflict && <p className="text-red-400 text-xs mt-1">SKU already used by "{skuConflict.name}"</p>}
            </div>
            <div>
              <label className={labelClass}>Base Price (EGP) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required min={0} className={inputClass} />
            </div>
          </div>

          {/* Categories */}
          <div className="pt-2 border-t border-white/5">
            <label className={labelClass}>Categories * (first selected is the primary category)</label>
            {sortedCategories.length === 0 ? (
              <p className="text-gray-600 text-xs">No categories yet. Create them in the Categories tab.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sortedCategories.map(cat => {
                  const parent = cat.parentId ? categories.find(c => c.id === cat.parentId) : undefined;
                  return (
                    <label key={cat.id} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.categories.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="rounded border-white/20 bg-black text-green-500 focus:ring-green-500"
                      />
                      <span>{parent ? `${parent.nameEn} / ` : ''}{cat.nameEn}</span>
                      <span className="text-gray-500 text-xs" dir="rtl">{cat.nameAr}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div>
              <label className={labelClass}>CPU</label>
              <input name="cpu" value={form.cpu} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Base RAM</label>
              <input name="ram" value={form.ram} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Base Storage</label>
              <input name="storage" value={form.storage} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>GPU</label>
              <input name="gpu" value={form.gpu} onChange={handleChange} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Screen</label>
              <input name="screen" value={form.screen} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="pt-2 border-t border-white/5">
            <ProductSpecsEditor specs={form.specs} onChange={specs => setForm(prev => ({ ...prev, specs }))} />
          </div>

          {/* Descriptions */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <div>
              <label className={labelClass}>Description (EN)</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={labelClass}>Description (AR)</label>
              <textarea name="descriptionAr" value={form.descriptionAr} onChange={handleChange} dir="rtl" rows={3} className={`${inputClass} resize-none`} />
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
              Define your own RAM and storage options. Price adjustment is relative to the base price — use positive numbers for upgrades (e.g. +500) and negative for downgrades (e.g. -300). Leave empty if the laptop has only one configuration.
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
                      value={variant.priceAdjustment}
                      onChange={e => updateVariant(variant.id, 'priceAdjustment', Number(e.target.value))}
                      placeholder="Price Adj (e.g. +500 or -300)"
                      className="w-full sm:w-32 px-3 py-2 rounded-lg bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-green-500/50"
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

          {/* Gallery */}
          <div className="pt-2 border-t border-white/5">
            <ProductImagesEditor
              images={form.images}
              library={library}
              onLibraryChange={onLibraryChange}
              onChange={images => setForm(prev => ({ ...prev, images }))}
            />
          </div>

          {/* Sort + Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div>
              <label className={labelClass}>Sort Order</label>
              <input name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} className={inputClass} />
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

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-[#111] py-3">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 transition-all">Cancel</button>
            <button type="submit" disabled={saving || !!skuConflict} className="px-4 py-2.5 rounded-lg bg-green-500 text-black font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-all">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
