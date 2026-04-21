/**
 * TypeScript types for Google Sheets data.
 * 
 * WHY: These types mirror the column structure of the source Excel.
 * The spreadsheet columns are the source of truth for these types.
 */

/** Row data structure from Google Sheets */
export interface SheetRow {
  title: string;
  color: string;
  urls: string[];
  description?: string;
  metadata?: string;
}

/** Raw row from Google Sheets API (before parsing) */
export type RawSheetRow = (string | number | boolean | null)[];

/** Response from Google Sheets API */
export interface SheetApiResponse {
  range: string;
  majorDimension: 'ROWS' | 'COLUMNS';
  values: RawSheetRow[];
}

/** Parsed sheet data ready for UI */
export interface ParsedSheetData {
  rows: SheetRow[];
  lastUpdated: Date;
  sheetName: string;
}

/** URL domain extracted for icon mapping */
export interface UrlInfo {
  url: string;
  domain: string;
  name: string;
}