/**
 * Configuration file for Google Sheets integration.
 * Single spreadsheet with multiple sheets (one per person).
 * 
 * WHY: Using one spreadsheet with multiple sheets keeps data
 * organized per person while maintaining a single data source.
 */

export interface SheetConfig {
  /** Unique key to reference this sheet configuration */
  key: string;
  /** Human-readable name for the person (from sheet name) */
  name: string;
  /** Google Sheets spreadsheet ID (single source for all) */
  spreadsheetId: string;
  /** Name of the tab/sheet within the spreadsheet */
  sheetName: string;
  /** Cell range to read */
  range?: string;
}

/**
 * Default configuration using single spreadsheet ID.
 * Sheet names dynamically mapped to person names.
 */
export const config: SheetConfig = {
  key: 'default',
  name: 'CV',
  spreadsheetId: process.env.GOOGLE_SHEET_ID || '',
  sheetName: '',
  range: 'A1:ZZ1000',
};

/** Get main spreadsheet ID */
export function getSpreadsheetId(): string {
  return config.spreadsheetId;
}

/** Get default range */
export function getDefaultRange(): string {
  return config.range || 'A1:ZZ1000';
}