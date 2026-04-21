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

  // Debug: Log the spreadsheet ID
  console.log('[DEBUG] Spreadsheet ID:', spreadsheetId);

  // Fetch list of all sheets (team members)
  const teamMembers: { name: string; data: { rows: Awaited<ReturnType<typeof fetchPersonData>>['rows'] } | null }[] = [];

  try {
    if (spreadsheetId) {
      const sheetsList = await fetchSheetsList(spreadsheetId);
      const sheetNames = sheetsList.sheets.map(s => s.title);
      
      console.log('[DEBUG] Sheet names found:', sheetNames);

      // Fetch data for each team member
      for (const sheetName of sheetNames) {
        try {
          console.log('[DEBUG] Fetching data for sheet:', sheetName);
          const personData = await fetchPersonData(spreadsheetId, sheetName, defaultRange);
          console.log('[DEBUG] Data received for', sheetName, ':', personData.rows.length, 'rows');
          teamMembers.push({ name: sheetName, data: { rows: personData.rows } });
        } catch (e) {
          // Log error instead of silent skip
          console.error('[ERROR] Failed to fetch data for sheet', sheetName, ':', e);
        }
      }
    } else {
      console.error('[ERROR] Spreadsheet ID not configured');
    }
  } catch (e) {
    console.error('[ERROR] Failed to fetch sheets list:', e);
  }

  return <TeamContent teamMembers={teamMembers} />;
}