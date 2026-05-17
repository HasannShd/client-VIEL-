import React, { useEffect, useMemo, useState } from 'react';
import { dictionary } from '../data/i18n.js';
import { LanguageContext } from './languageStore.js';

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem('viel-language') || 'de');

  const setLanguage = (nextLanguage) => {
    const normalized = dictionary[nextLanguage] ? nextLanguage : 'de';
    localStorage.setItem('viel-language', normalized);
    setLanguageState(normalized);
  };

  const value = useMemo(() => ({
    language,
    copy: dictionary[language],
    setLanguage,
    toggleLanguage: () => setLanguage(language === 'de' ? 'en' : 'de')
  }), [language]);

  useEffect(() => {
    document.documentElement.lang = language === 'de' ? 'de' : 'en';
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
