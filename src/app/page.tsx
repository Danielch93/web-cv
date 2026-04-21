import { fetchSheetsList, fetchPersonData } from '@/lib/sheets/client';
import { getSpreadsheetId, getDefaultRange } from '@/config/sheets';
import { TeamContent } from '@/components/TeamContent';

/**
 * Home page - Server Component showing all team members' CV data.
 */
export const dynamic = 'force-dynamic';

export default async function Home() {
  const spreadsheetId = getSpreadsheetId();
  const defaultRange = getDefaultRange();

  // Fetch list of all sheets (team members)
  const teamMembers: { name: string; data: { rows: Awaited<ReturnType<typeof fetchPersonData>>['rows'] } | null }[] = [];

  try {
    if (spreadsheetId) {
      const sheetsList = await fetchSheetsList(spreadsheetId);
      const sheetNames = sheetsList.sheets.map(s => s.title);

      // Fetch data for each team member
      for (const sheetName of sheetNames) {
        try {
          const personData = await fetchPersonData(spreadsheetId, sheetName, defaultRange);
          teamMembers.push({ name: sheetName, data: { rows: personData.rows } });
        } catch {
          // Skip members with fetch errors
        }
      }
    }
  } catch {
    // Handle error silently for now
  }

  return <TeamContent teamMembers={teamMembers} />;
}