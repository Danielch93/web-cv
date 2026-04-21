'use client';

import { useLanguage } from './I18nProvider';
import { supportedLanguages, type Language } from '@/lib/i18n';

/**
 * Language switcher component.
 */
export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const labels: Record<Language, string> = {
    en: 'EN',
    es: 'ES',
  };

  return (
    <div className="flex items-center gap-2">
      {supportedLanguages.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
            language === lang
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
          }`}
        >
          {labels[lang]}
        </button>
      ))}
    </div>
  );
}