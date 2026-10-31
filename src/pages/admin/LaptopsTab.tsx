// ============================================================
// Admin Laptops Tab - product list with search, SKU and category filters
// ============================================================

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { subscribeToLaptops, subscribeToCategories, getImages, createLaptop, updateLaptop, deleteLaptop, addAuditLog, getLoggedInAdmin } from '@/lib/firebase';
import { getProductImages, normalizeSku } from '@/lib/product-utils';
import { LaptopForm } from './LaptopForm';
import type { Laptop, Category, ImageRecord } from '@/types';

export function LaptopsTab() {
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [library, setLibrary] = useState<ImageRecord[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editing, setEditing] = useState<Laptop | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => subscribeToLaptops(setLaptops), []);
  useEffect(() => subscribeToCategories(setCategories), []);

  useEffect(() => {
    async function load() {
      setLibrary(await getImages());
    }
    load();
  }, []);

  const categoryName = (id: string) => categories.find(c => c.id === id)?.nameEn || id;

  const query = search.trim().toLowerCase();
  const filtered = laptops
    .filter(l => {
      if (!query) return true;
      const skuQuery = normalizeSku(search);
      return l.name.toLowerCase().includes(query)
        || (l.nameAr || '').includes(search.trim())
        || (l.sku || '').toUpperCase().includes(skuQuery);
    })
    .filter(l => !categoryFilter || l.category === categoryFilter || l.categories?.includes(categoryFilter))
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or SKU..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500/50"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="sm:w-52 px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50"
          >
            <option value="">All categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.nameEn}</option>)}
          </select>
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
                  <th className="text-left p-4 font-medium">SKU</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Variants</th>
                  <th className="text-left p-4 font-medium">Categories</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium">Active</th>
                  <th className="text-left p-4 font-medium">Best Seller</th>
                  <th className="p-4 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => {
                  const cover = getProductImages(l)[0] || l.image;
                  const categoryIds = l.categories?.length ? l.categories : (l.category ? [l.category] : []);
                  return (
                    <tr key={l.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                      <td className="p-4">
                        {cover && <img src={cover} alt={l.name} className="w-12 h-10 object-cover rounded" />}
                      </td>
                      <td className="p-4 text-white">
                        {l.name}
                        {l.nameAr && <span className="block text-gray-500 text-xs" dir="rtl">{l.nameAr}</span>}
                      </td>
                      <td className="p-4 text-gray-300 font-mono text-xs">{l.sku || '-'}</td>
                      <td className="p-4 text-green-400 font-medium">{l.price.toLocaleString()} EGP</td>
                      <td className="p-4 text-gray-400 text-xs">
                        {l.variants?.length || 0} configs
                      </td>
                      <td className="p-4 text-gray-400 text-xs">
                        {categoryIds.map(categoryName).join(', ') || '-'}
                      </td>
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
                            onClick={async () => { if (confirm('Delete this laptop?')) { await deleteLaptop(l.id); await addAuditLog('DELETE', 'laptop', l.id, `Deleted laptop "${l.name}"`, getLoggedInAdmin() || ''); } }}
                            className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(editing || creating) && (
        <LaptopForm
          laptop={editing}
          laptops={laptops}
          categories={categories}
          library={library}
          onLibraryChange={setLibrary}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={async (data) => {
            if (editing) {
              await updateLaptop(editing.id, data);
              await addAuditLog('UPDATE', 'laptop', editing.id, `Updated laptop "${data.name}"`, getLoggedInAdmin() || '');
              setEditing(null);
            } else {
              const id = await createLaptop(data);
              await addAuditLog('CREATE', 'laptop', id, `Created laptop "${data.name}"`, getLoggedInAdmin() || '');
              setCreating(false);
            }
          }}
        />
      )}
    </div>
  );
}
