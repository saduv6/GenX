// ============================================================
// Product Specifications Editor - unlimited bilingual spec rows
// ============================================================

import { Plus, Trash2 } from 'lucide-react';
import type { ProductSpec } from '@/types';

interface ProductSpecsEditorProps {
  specs: ProductSpec[];
  onChange: (specs: ProductSpec[]) => void;
}

const inputClass = 'w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-green-500/50 min-w-0';

export function ProductSpecsEditor({ specs, onChange }: ProductSpecsEditorProps) {
  const addSpec = () => {
    onChange([...specs, { id: 'spec_' + Math.random().toString(36).substring(2, 10), nameEn: '', nameAr: '', valueEn: '', valueAr: '' }]);
  };

  const updateSpec = (id: string, field: keyof Omit<ProductSpec, 'id'>, value: string) => {
    onChange(specs.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSpec = (id: string) => {
    onChange(specs.filter(s => s.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-gray-400 text-xs">Specifications</label>
        <button
          type="button"
          onClick={addSpec}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs hover:bg-white/10 transition-all"
        >
          <Plus className="w-3 h-3" /> Add Specification
        </button>
      </div>
      <p className="text-gray-500 text-xs mb-3">
        Add as many specifications as needed. Each one has an English and an Arabic name and value. The storefront shows the version matching the visitor's language.
      </p>
      {specs.length === 0 ? (
        <div className="bg-black/50 rounded-lg border border-dashed border-white/10 p-4 text-center">
          <p className="text-gray-600 text-xs">No custom specifications.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {specs.map(spec => (
            <div key={spec.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center bg-black/50 rounded-lg border border-white/10 p-3">
              <input value={spec.nameEn} onChange={e => updateSpec(spec.id, 'nameEn', e.target.value)} placeholder="Name (EN) e.g. Battery" className={inputClass} />
              <input value={spec.nameAr} dir="rtl" onChange={e => updateSpec(spec.id, 'nameAr', e.target.value)} placeholder="الاسم (AR)" className={inputClass} />
              <input value={spec.valueEn} onChange={e => updateSpec(spec.id, 'valueEn', e.target.value)} placeholder="Value (EN) e.g. 6 hours" className={inputClass} />
              <input value={spec.valueAr} dir="rtl" onChange={e => updateSpec(spec.id, 'valueAr', e.target.value)} placeholder="القيمة (AR)" className={inputClass} />
              <button
                type="button"
                onClick={() => removeSpec(spec.id)}
                title="Delete specification"
                className="justify-self-end p-1.5 rounded text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
