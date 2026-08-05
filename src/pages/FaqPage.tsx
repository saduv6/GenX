// ============================================================
// FAQ Page - Loads editable FAQs from database
// ============================================================

import { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { subscribeToFaqs } from '@/lib/firebase';
import { useLanguage } from '@/hooks/useLanguage';
import type { FaqItem } from '@/types';

export function FaqPage() {
  const { lang, t } = useLanguage();
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToFaqs(data => {
      setFaqs(data.filter(f => f.isActive).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const getQuestion = (f: FaqItem) => (lang === 'ar' && f.questionAr) ? f.questionAr : f.question;
  const getAnswer = (f: FaqItem) => (lang === 'ar' && f.answerAr) ? f.answerAr : f.answer;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">{t('faqTitle')}</h1>
        <p className="text-gray-400 mb-8">{t('faqSubtitle')}</p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : faqs.length === 0 ? (
          <p className="text-gray-500 text-center py-20">No FAQs available.</p>
        ) : (
          <div className="space-y-4">
            {faqs.map(faq => {
              const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[faq.icon] || LucideIcons.HelpCircle;
              return (
                <div key={faq.id} className="bg-white/5 rounded-xl border border-white/10 p-5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white/5 flex-shrink-0">
                      <Icon className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm mb-2">{getQuestion(faq)}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{getAnswer(faq)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
