// ============================================================
// Admin Categories Tab - create, edit, delete, reorder, subcategories
// ============================================================

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { subscribeToCategories, createCategory, updateCategory, deleteCategory, addAuditLog, getLoggedInAdmin } from '@/lib/firebase';
import { CategoryForm } from './CategoryForm';
import type { Category } from '@/types';

const iconButtonClass = 'p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:hover:bg-transparent';

function siblingsOf(categories: Category[], parentId: string): Category[] {
  return categories
    .filter(c => c.parentId === parentId)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [newParentId, setNewParentId] = useState('');

  useEffect(() => subscribeToCategories(setCategories), []);

  const roots = siblingsOf(categories, '');
  const nameOf = (id: string) => categories.find(c => c.id === id)?.nameEn || '';

  const openCreate = (parentId = '') => {
    setEditing(null);
    setNewParentId(parentId);
    setCreating(true);
  };

  const move = async (category: Category, direction: -1 | 1) => {
    const siblings = siblingsOf(categories, category.parentId);
    const index = siblings.findIndex(c => c.id === category.id);
    const target = index + direction;
    if (target < 0 || target >= siblings.length) return;
    const reordered = [...siblings];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    for (let i = 0; i < reordered.length; i++) {
      if (reordered[i].sortOrder !== i + 1) {
        await updateCategory(reordered[i].id, { sortOrder: i + 1 });
      }
    }
  };

  const toggleActive = async (category: Category) => {
    await updateCategory(category.id, { isActive: !category.isActive });
    await addAuditLog('UPDATE', 'category', category.id, `${category.isActive ? 'Hid' : 'Showed'} category "${category.nameEn}"`, getLoggedInAdmin() || '');
  };

  const handleDelete = async (category: Category) => {
    const childCount = categories.filter(c => c.parentId === category.id).length;
    const message = childCount > 0
      ? `Delete "${category.nameEn}"? Its ${childCount} subcategor${childCount === 1 ? 'y' : 'ies'} will become top-level categories, and products will be unassigned from it.`
      : `Delete "${category.nameEn}"? Products will be unassigned from it.`;
    if (!confirm(message)) return;
    await deleteCategory(category.id);
    await addAuditLog('DELETE', 'category', category.id, `Deleted category "${category.nameEn}"`, getLoggedInAdmin() || '');
  };

  const renderRow = (category: Category, depth: number) => {
    const siblings = siblingsOf(categories, category.parentId);
    const index = siblings.findIndex(c => c.id === category.id);
    return (
      <div key={category.id}>
        <div className="flex items-center gap-3 p-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02]" style={{ paddingInlineStart: `${16 + depth * 32}px` }}>
          <div className="flex flex-col">
            <button type="button" onClick={() => move(category, -1)} disabled={index <= 0} title="Move up" className={iconButtonClass}>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={() => move(category, 1)} disabled={index >= siblings.length - 1} title="Move down" className={iconButtonClass}>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
          {category.image ? (
            <img src={category.image} alt="" className="w-14 h-10 object-cover rounded border border-white/10" />
          ) : (
            <div className="w-14 h-10 rounded border border-dashed border-white/10 flex items-center justify-center text-gray-600 text-[10px]">No img</div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm truncate">{category.nameEn}</p>
            <p className="text-gray-500 text-xs truncate" dir="rtl">{category.nameAr || '—'}</p>
          </div>
          <button
            type="button"
            onClick={() => toggleActive(category)}
            className={`hidden sm:inline-block px-2 py-1 rounded text-xs border transition-all ${category.isActive ? 'border-green-500/40 text-green-400' : 'border-white/10 text-gray-500'}`}
          >
            {category.isActive ? 'Visible' : 'Hidden'}
          </button>
          {depth === 0 && (
            <button type="button" onClick={() => openCreate(category.id)} className="hidden sm:inline-block px-2 py-1 rounded text-xs border border-white/10 text-gray-300 hover:bg-white/5 transition-all">
              + Subcategory
            </button>
          )}
          <button type="button" onClick={() => { setCreating(false); setEditing(category); }} title="Edit" className={iconButtonClass}>
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => handleDelete(category)} title="Delete" className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        {siblingsOf(categories, category.id).map(child => renderRow(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-semibold">Categories</h2>
          <p className="text-gray-500 text-xs">Changes appear on the storefront immediately. Use the arrows to reorder.</p>
        </div>
        <button
          onClick={() => openCreate('')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-500 text-black text-sm font-medium hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        {roots.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-sm">No categories yet</p>
          </div>
        ) : (
          roots.map(root => renderRow(root, 0))
        )}
      </div>

      {(creating || editing) && (
        <CategoryForm
          category={editing}
          categories={categories}
          defaultParentId={newParentId}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSave={async (data) => {
            if (editing) {
              await updateCategory(editing.id, data);
              await addAuditLog('UPDATE', 'category', editing.id, `Updated category "${data.nameEn}"`, getLoggedInAdmin() || '');
              setEditing(null);
            } else {
              const parentSiblings = siblingsOf(categories, data.parentId);
              const sortOrder = (parentSiblings[parentSiblings.length - 1]?.sortOrder || 0) + 1;
              const id = await createCategory({ ...data, sortOrder });
              await addAuditLog('CREATE', 'category', id, `Created category "${data.nameEn}"${data.parentId ? ` under "${nameOf(data.parentId)}"` : ''}`, getLoggedInAdmin() || '');
              setCreating(false);
            }
          }}
        />
      )}
    </div>
  );
}
