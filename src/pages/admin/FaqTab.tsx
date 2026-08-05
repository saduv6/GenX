// ============================================================
// Admin FAQ Tab - CRUD for FAQ items (bilingual)
// ============================================================

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, GripVertical, Eye, EyeOff } from 'lucide-react';
import { subscribeToFaqs, createFaq, updateFaq, deleteFaq } from '@/lib/firebase';
import type { FaqItem } from '@/types';

const ICON_OPTIONS = [
  'Truck', 'CreditCard', 'Package', 'RotateCcw', 'Shield', 'HelpCircle',
  'Clock', 'Wrench', 'CheckCircle', 'XCircle', 'Phone', 'MessageCircle',
];

export function FaqTab() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    return subscribeToFaqs(data => {
      setFaqs(data.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
    });
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-white font-semibold text-sm">FAQ Management ({faqs.length})</h2>
        <button
          onClick={() => { setCreating(true); setEditing(null); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-500 text-black text-sm font-medium hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {/* FAQ list */}
      <div className="space-y-3">
        {faqs.length === 0 ? (
          <div className="bg-white/5 rounded-xl border border-white/10 p-8 text-center">
            <p className="text-gray-500 text-sm">No FAQs yet. Click "Add FAQ" to create one.</p>
          </div>
        ) : (
          faqs.map(faq => (
            <div key={faq.id} className="bg-white/5 rounded-xl border border-white/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <GripVertical className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">{faq.icon}</span>
                      <span className="text-[10px] text-gray-500">#{faq.sortOrder}</span>
                      {!faq.isActive && <span className="text-[10px] text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">Hidden</span>}
                    </div>
                    <p className="text-white text-sm font-medium">{faq.question}</p>
                    {faq.questionAr && <p className="text-gray-400 text-sm" dir="rtl">{faq.questionAr}</p>}
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">{faq.answer}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={async () => { await updateFaq(faq.id, { isActive: !faq.isActive }); }}
                    className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    title={faq.isActive ? 'Hide' : 'Show'}
                  >
                    {faq.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => { setEditing(faq); setCreating(false); }}
                    className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={async () => { if (confirm('Delete this FAQ?')) await deleteFaq(faq.id); }}
                    className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit/Create Modal */}
      {(editing || creating) && (
        <FaqForm
          faq={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={async (data) => {
            if (editing) {
              await updateFaq(editing.id, data);
              setEditing(null);
            } else {
              await createFaq(data as Omit<FaqItem, 'id'>);
              setCreating(false);
            }
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// FAQ Form Modal
// ============================================================
function FaqForm({ faq, onClose, onSave }: {
  faq: FaqItem | null;
  onClose: () => void;
  onSave: (data: Partial<FaqItem>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    question: faq?.question || '',
    questionAr: faq?.questionAr || '',
    answer: faq?.answer || '',
    answerAr: faq?.answerAr || '',
    icon: faq?.icon || 'HelpCircle',
    sortOrder: faq?.sortOrder || 1,
    isActive: faq?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);

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
          <h2 className="text-white font-semibold">{faq ? 'Edit' : 'Add'} FAQ</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* English */}
          <div className="space-y-3 pb-3 border-b border-white/5">
            <h3 className="text-gray-500 text-xs uppercase tracking-wide">English</h3>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Question (EN) *</label>
              <input
                value={form.question}
                onChange={e => setForm(prev => ({ ...prev, question: e.target.value }))}
                required
                className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Answer (EN) *</label>
              <textarea
                value={form.answer}
                onChange={e => setForm(prev => ({ ...prev, answer: e.target.value }))}
                required
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 resize-none"
              />
            </div>
          </div>

          {/* Arabic */}
          <div className="space-y-3 pb-3 border-b border-white/5">
            <h3 className="text-gray-500 text-xs uppercase tracking-wide">Arabic</h3>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Question (AR)</label>
              <input
                value={form.questionAr}
                onChange={e => setForm(prev => ({ ...prev, questionAr: e.target.value }))}
                dir="rtl"
                className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Answer (AR)</label>
              <textarea
                value={form.answerAr}
                onChange={e => setForm(prev => ({ ...prev, answerAr: e.target.value }))}
                dir="rtl"
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50 resize-none"
              />
            </div>
          </div>

          {/* Icon + Sort + Active */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs mb-1">Icon</label>
              <select
                value={form.icon}
                onChange={e => setForm(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50"
              >
                {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={e => setForm(prev => ({ ...prev, sortOrder: Number(e.target.value) }))}
                className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-green-500/50"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))} className="rounded border-white/20 bg-black text-green-500 focus:ring-green-500" />
            Active (visible on site)
          </label>

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
