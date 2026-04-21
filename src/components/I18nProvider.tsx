'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { type Language, defaultLanguage } from '@/lib/i18n';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
});

/**
 * Language provider component.
 * Initializes with English on server, then updates from localStorage on client.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const hasCheckedStorage = useRef(false);

  useEffect(() => {
    if (hasCheckedStorage.current) return;
    hasCheckedStorage.current = true;

    const stored = localStorage.getItem('language') as Language | null;
    if (stored && (stored === 'en' || stored === 'es')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional sync with localStorage
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook to access the current language.
 */
export function useLanguage() {
  return useContext(I18nContext);
}