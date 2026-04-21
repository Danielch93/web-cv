'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/I18nProvider';
import { t } from '@/lib/i18n';
import type { SheetRow } from '@/lib/sheets/types';
import { PersonDetail } from './PersonDetail';

interface PersonContentProps {
  personName: string;
  projects: SheetRow[];
  error?: string | null;
}

export function PersonContent({ personName, projects, error }: PersonContentProps) {
  const { language } = useLanguage();
  const translations = t(language);

  return (
    <div className="min-h-screen font-sans">
      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Back navigation */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {translations.volverAlEquipo}
        </Link>

        {/* Error display */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            Error: {error}
          </div>
        )}

        {/* Person detail */}
        {projects.length > 0 ? (
          <PersonDetail
            personName={personName}
            projects={projects}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
            <p>{translations.noDataAvailable}</p>
          </div>
        )}
      </main>
    </div>
  );
}