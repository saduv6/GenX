// ============================================================
// Language Context - manages current language (EN/AR) + RTL
// ============================================================

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { translations, type Language, type TranslationKey } from '@/lib/translations';

type LanguageContextType = {
  lang: Language;
  setLang: (l: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
  dir: 'ltr' | 'rtl';
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
  t: (key) => key,
  dir: 'ltr',
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('genx_lang');
    return saved === 'ar' ? 'ar' : 'en';
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem('genx_lang', lang);
  }, [lang, dir]);

  const setLang = useCallback((l: Language) => setLangState(l), []);
  const toggleLang = useCallback(() => setLangState(prev => (prev === 'en' ? 'ar' : 'en')), []);

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key] ?? translations.en[key] ?? key,
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
