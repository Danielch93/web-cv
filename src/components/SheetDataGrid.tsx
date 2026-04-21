import type { SheetRow } from '@/lib/sheets/types';
import { SheetDataCard } from './SheetDataCard';

/**
 * SheetDataGrid - Renders a grid of SheetDataCard components.
 * 
 * WHY: This component handles layout and list management.
 * It delegates individual card rendering to SheetDataCard.
 * Responsive grid layout:
 * - mobile: single column
 * - md: 2 columns
 * - lg: 3 columns
 */
interface SheetDataGridProps {
  /** Array of data rows from Google Sheets */
  data: SheetRow[];
  /** Optional title for the grid section */
  title?: string;
  /** Person name for navigation to detail page */
  personName: string;
}

/**
 * Grid container with responsive columns.
 * Uses CSS Grid with auto-fit for flexible layout.
 */
export function SheetDataGrid({ data, title, personName }: SheetDataGridProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <section>
      {title && (
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
      )}
      
      {/* 
        Responsive grid:
        - 1 column on mobile (default)
        - 2 columns on md (768px+)
        - 3 columns on lg (1024px+)
        Uses auto-fit for automatic column adjustment
      */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((row, index) => (
          <SheetDataCard
            key={row.title || index}
            data={row}
            personName={personName}
          />
        ))}
      </div>
    </section>
  );
}