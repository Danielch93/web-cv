import type { SheetRow } from '@/lib/sheets/types';
import { parseUrlInfos } from '@/lib/sheets/parser';

/**
 * SheetDataCard - Renders a summary card for a project.
 * 
 * Clicking the card navigates to the person's detail page.
 * Shows title, color indicator, and link count.
 */
interface SheetDataCardProps {
  /** Project data row */
  data: SheetRow;
  /** Person name for navigation (the sheet name) */
  personName: string;
}

export function SheetDataCard({ data, personName }: SheetDataCardProps) {
  const urlInfos = parseUrlInfos(data.urls);
  const hasLinks = urlInfos.length > 0;

  const cardContent = (
    <article className="group flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 sm:flex-row sm:items-center sm:justify-between lg:gap-6">
      {/* Color indicator strip */}
      <div
        className="h-2 w-full rounded-full sm:h-16 sm:w-2"
        style={{ backgroundColor: data.color }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {data.title}
        </h3>
        
        {/* Show link count if has links */}
        {hasLinks && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {urlInfos.length} enlace{urlInfos.length !== 1 ? 's' : ''}
          </p>
        )}
        
        {data.description && (
          <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
            {data.description}
          </p>
        )}
        
        {data.metadata && (
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            {data.metadata}
          </p>
        )}
      </div>

      {/* Arrow indicator - shows on hover */}
      <div className="flex items-center justify-end opacity-0 transition-opacity group-hover:opacity-100">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </article>
  );

  // Always link to person detail page
  return (
    <a
      href={`/${encodeURIComponent(personName)}`}
      className="block cursor-pointer"
    >
      {cardContent}
    </a>
  );
}