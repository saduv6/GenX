// ============================================================
// Category Form Modal - bilingual name, image, parent, active state
// ============================================================

import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import type { Category } from '@/types';
import { readImageFile } from '@/lib/product-utils';

interface CategoryFormProps {
  category: Category | null;
  categories: Category[];
  defaultParentId: string;
  onClose: () => void;
  onSave: (data: Omit<Category, 'id' | 'sortOrder'>) => Promise<void>;
}

const inputClass = 'w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50';
const labelClass = 'block text-gray-400 text-xs mb-1';

export function CategoryForm({ category, categories, defaultParentId, onClose, onSave }: CategoryFormProps) {
  const [nameEn, setNameEn] = useState(category?.nameEn || '');
  const [nameAr, setNameAr] = useState(category?.nameAr || '');
  const [parentId, setParentId] = useState(category?.parentId || defaultParentId);
  const [image, setImage] = useState(category?.image || '');
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const hasChildren = category ? categories.some(c => c.parentId === category.id) : false;
  const parentOptions = categories.filter(c => !c.parentId && c.id !== category?.id);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are allowed');
      return;
    }
    try {
      setImage(await readImageFile(file, 800));
      setError('');
    } catch {
      setError('Could not process this image. Please try another file.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim()) {
      setError('English name is required.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSave({
        nameEn: nameEn.trim(),
        nameAr: nameAr.trim(),
        parentId: hasChildren ? '' : parentId,
        image,
        isActive,
      });
    } catch {
      setError('Could not save the category. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 overflow-y-auto py-10">
      <div className="bg-[#111] rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/5 sticky top-0 bg-[#111] z-10">
          <h2 className="text-white font-semibold">{category ? 'Edit' : 'Add'} Category</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className={labelClass}>Name (EN) *</label>
            <input value={nameEn} onChange={e => setNameEn(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Name (AR)</label>
            <input value={nameAr} onChange={e => setNameAr(e.target.value)} dir="rtl" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Parent Category</label>
            {hasChildren ? (
              <p className="text-gray-500 text-xs">This category has subcategories, so it stays top-level.</p>
            ) : (
              <select value={parentId} onChange={e => setParentId(e.target.value)} className={inputClass}>
                <option value="">None (top-level category)</option>
                {parentOptions.map(c => <option key={c.id} value={c.id}>{c.nameEn}</option>)}
              </select>
            )}
          </div>

          <div>
            <label className={labelClass}>Category Image</label>
            <div className="flex items-center gap-3">
              {image ? (
                <img src={image} alt="" className="w-20 h-14 object-cover rounded-lg border border-white/10" />
              ) : (
                <div className="w-20 h-14 rounded-lg border border-dashed border-white/10 flex items-center justify-center text-gray-600 text-xs">None</div>
              )}
              <label className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs cursor-pointer hover:bg-white/10 transition-all">
                <Upload className="w-3 h-3" /> Upload
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} className="hidden" />
              </label>
              {image && (
                <button type="button" onClick={() => setImage('')} className="text-xs text-gray-500 hover:text-red-400 transition-all">Remove</button>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="rounded border-white/20 bg-black text-green-500 focus:ring-green-500" />
            Visible on the storefront
          </label>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
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
