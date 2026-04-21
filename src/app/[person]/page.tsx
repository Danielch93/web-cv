import { fetchPersonData } from '@/lib/sheets/client';
import { PersonContent } from '@/components/PersonContent';
import { getSpreadsheetId, getDefaultRange } from '@/config/sheets';

/**
 * Person detail page - Shows complete profile for a specific person.
 */
export const dynamic = 'force-dynamic';

interface PersonPageProps {
  params: Promise<{ person: string }>;
}

function decodePersonName(encoded: string): string {
  try {
    return decodeURIComponent(encoded);
  } catch {
    return encoded;
  }
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { person } = await params;
  const personName = decodePersonName(person);
  const spreadsheetId = getSpreadsheetId();
  const defaultRange = getDefaultRange();

  let projects: Awaited<ReturnType<typeof fetchPersonData>>['rows'] = [];
  let error: string | null = null;

  try {
    if (spreadsheetId && personName) {
      const personData = await fetchPersonData(spreadsheetId, personName, defaultRange);
      projects = personData.rows;
    }
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to fetch person data';
  }

  return (
    <PersonContent
      personName={personName}
      projects={projects}
      error={error}
    />
  );
}