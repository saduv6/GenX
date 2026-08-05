// ============================================================
// Warranty Page - Content editable from dashboard
// ============================================================

import { Shield } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSettings } from '@/hooks/useSettings';

export function WarrantyPage() {
  const { lang, t } = useLanguage();
  const { settings } = useSettings();

  const content = lang === 'ar'
    ? (settings?.warrantyContentAr || '')
    : (settings?.warrantyContent || '');

  const blocks = parseMarkdown(content);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">{t('warrantyTitle')}</h1>
        <p className="text-gray-400 mb-8">{t('warrantySubtitle')}</p>

        <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">{t('oneYearWarranty')}</h2>
              <p className="text-gray-500 text-sm">{t('warrantyAllLaptops')}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {blocks.map((block, i) => {
            if (block.type === 'heading') {
              return (
                <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-5">
                  <h2 className="text-white font-semibold text-sm mb-3">{block.text}</h2>
                  {block.items.length > 0 && (
                    <ul className="space-y-2">
                      {block.items.map((item, j) => (
                        <li key={j} className="text-gray-400 text-xs flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">+</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {block.body && <p className="text-gray-400 text-sm leading-relaxed mt-2">{block.body}</p>}
                </div>
              );
            }
            if (block.type === 'paragraph') {
              return (
                <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-5">
                  <p className="text-gray-400 text-sm leading-relaxed">{block.text}</p>
                </div>
              );
            }
            if (block.type === 'steps') {
              return (
                <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-5">
                  <h2 className="text-white font-semibold text-sm mb-4">{block.text}</h2>
                  <div className="space-y-4">
                    {block.items.map((item, j) => (
                      <div key={j} className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {j + 1}
                        </div>
                        <p className="text-gray-400 text-xs pt-1">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

type Block = { type: 'heading' | 'paragraph' | 'steps'; text: string; items: string[]; body: string };

function parseMarkdown(md: string): Block[] {
  if (!md) return [];
  const lines = md.split('\n');
  const blocks: Block[] = [];
  let current: Block | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('# ')) {
      if (current) blocks.push(current);
      current = { type: 'paragraph', text: trimmed.slice(2), items: [], body: '' };
    } else if (trimmed.startsWith('## ')) {
      if (current) blocks.push(current);
      current = { type: 'heading', text: trimmed.slice(3), items: [], body: '' };
    } else if (/^\d+\.\s/.test(trimmed)) {
      const item = trimmed.replace(/^\d+\.\s/, '');
      if (current && current.type === 'heading') {
        if (!current.body) {
          current.body = item;
        } else {
          current.body += '\n' + item;
        }
      } else if (current && current.type === 'steps') {
        current.items.push(item);
      } else {
        if (current) blocks.push(current);
        current = { type: 'steps', text: 'Steps', items: [item], body: '' };
      }
    } else if (trimmed.startsWith('- ')) {
      const item = trimmed.slice(2);
      if (current && current.type === 'heading') {
        current.items.push(item);
      } else if (current && current.type === 'steps') {
        current.items.push(item);
      } else {
        if (current) blocks.push(current);
        current = { type: 'heading', text: '', items: [item], body: '' };
      }
    } else {
      if (current && current.type === 'paragraph') {
        current.text += '\n' + trimmed;
      } else {
        if (current) blocks.push(current);
        current = { type: 'paragraph', text: trimmed, items: [], body: '' };
      }
    }
  }
  if (current) blocks.push(current);
  return blocks;
}
