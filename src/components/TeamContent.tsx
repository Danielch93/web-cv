'use client';

import { useLanguage } from '@/components/I18nProvider';
import { t } from '@/lib/i18n';
import type { SheetRow } from '@/lib/sheets/types';
import { SheetDataGrid } from './SheetDataGrid';
import { LanguageSwitcher } from './LanguageSwitcher';

interface TeamContentProps {
  teamMembers: { name: string; data: { rows: SheetRow[] } | null }[];
}

export function TeamContent({ teamMembers }: TeamContentProps) {
  const { language } = useLanguage();
  const translations = t(language);

  return (
    <div className="min-h-screen font-sans">
      <main className="mx-auto max-w-6xl px-4 py-12">
        <header className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Team 🍻CodeLager
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {translations.homeSubtitle}
            </p>
          </div>
          <LanguageSwitcher />
        </header>

        {teamMembers.map(member => (
          <section key={member.name} className="mb-16 last:mb-0">
            {member.data && member.data.rows.length > 0 ? (
              <SheetDataGrid
                data={member.data.rows}
                title={`${member.name}'s ${translations.experience}`}
                personName={member.name}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <p>{translations.noDataAvailable} for {member.name}</p>
              </div>
            )}
          </section>
        ))}

        {teamMembers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
            <p>{translations.noDataAvailable}</p>
          </div>
        )}
      </main>
    </div>
  );
}