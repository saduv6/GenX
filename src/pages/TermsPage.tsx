// ============================================================
// Terms of Service Page - Content editable from dashboard
// ============================================================

import { useLanguage } from '@/hooks/useLanguage';
import { useSettings } from '@/hooks/useSettings';

export function TermsPage() {
  const { lang, t } = useLanguage();
  const { settings } = useSettings();

  const content = lang === 'ar'
    ? (settings?.termsContentAr || '')
    : (settings?.termsContent || '');

  const sections = parseSections(content);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">{t('termsTitle')}</h1>
        <p className="text-gray-400 mb-8">{t('termsSubtitle')}</p>

        <div className="space-y-6">
          {sections.map((s, i) => (
            <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-5">
              <h2 className="text-white font-semibold text-sm mb-2">{s.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type Section = { title: string; body: string };

function parseSections(md: string): Section[] {
  if (!md) return [];
  const lines = md.split('\n');
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('# ')) continue;

    if (trimmed.startsWith('## ')) {
      if (current) sections.push(current);
      current = { title: trimmed.slice(3), body: '' };
    } else if (current) {
      current.body += (current.body ? '\n' : '') + trimmed;
    }
  }
  if (current) sections.push(current);
  return sections;
}
