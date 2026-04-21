/**
 * Internationalization (i18n) system for the application.
 * Supports English (default) and Spanish.
 */

export type Language = 'en' | 'es';

export interface Translations {
  homeTitle: string;
  homeSubtitle: string;
  experience: string;
  noDataAvailable: string;
  columnsExpected: string;
  verPerfil: string;
  volverAlEquipo: string;
  links: string;
  description: string;
  enlaces: string;
}

const translations: Record<Language, Translations> = {
  en: {
    homeTitle: 'Team 🍻CodeLager',
    homeSubtitle: 'Projects & Experiences',
    experience: "Experience",
    noDataAvailable: 'No data available',
    columnsExpected: 'Expected columns: A (title), B (color), C (urls)',
    verPerfil: 'View profile',
    volverAlEquipo: 'Back to team',
    links: 'Links',
    description: 'Description',
    enlaces: 'Links',
  },
  es: {
    homeTitle: 'Team 🍻CodeLager',
    homeSubtitle: 'Proyectos & Experiencias',
    experience: 'Experiencia',
    noDataAvailable: 'No hay datos disponibles',
    columnsExpected: 'Columnas esperadas: A (título), B (color), C (urls)',
    verPerfil: 'Ver perfil',
    volverAlEquipo: 'Volver al equipo',
    links: 'Enlaces',
    description: 'Descripción',
    enlaces: 'Enlaces',
  },
};

/**
 * Get translations for the current language.
 */
export function t(lang: Language): Translations {
  return translations[lang];
}

/**
 * Get translation by key.
 */
export function tl(lang: Language, key: keyof Translations): string {
  return translations[lang][key];
}

/**
 * Default language.
 */
export const defaultLanguage: Language = 'en';

/**
 * All supported languages.
 */
export const supportedLanguages: Language[] = ['en', 'es'];