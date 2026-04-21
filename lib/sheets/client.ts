import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { SheetApiResponse, ParsedSheetData } from './types';
import type { SheetConfig } from '@/config/sheets';
import { parseRows } from './parser';

/**
 * Google Sheets client using REST API directly via fetch.
 * 
 * WHY: Using fetch directly provides more control and avoids issues
 * with the googleapis library validation.
 */
let accessToken: string | null = null;

/**
 * Gets OAuth2 access token from Service Account credentials.
 * Uses Google OAuth2 token endpoint for service account.
 */
async function getAccessToken(): Promise<string> {
  if (accessToken) return accessToken;

  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
  const base64Key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  let credentials: { client_email?: string; private_key?: string };

  if (keyPath) {
    const filePath = resolve(keyPath);
    const fileContents = readFileSync(filePath, 'utf-8');
    credentials = JSON.parse(fileContents);
  } else if (base64Key) {
    credentials = JSON.parse(Buffer.from(base64Key, 'base64').toString('utf-8'));
  } else {
    throw new Error(
      'No Google Service Account credentials found. Set GOOGLE_SERVICE_ACCOUNT_KEY_PATH or GOOGLE_SERVICE_ACCOUNT_KEY in .env.local'
    );
  }

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error('Invalid service account credentials');
  }

  const now = Math.floor(Date.now() / 1000);
  const jwtHeader = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const jwtClaim = Buffer.from(JSON.stringify({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })).toString('base64url');

  const crypto = await import('crypto');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${jwtHeader}.${jwtClaim}`);
  const jwtSignature = sign.sign(credentials.private_key, 'base64url');

  const jwt = `${jwtHeader}.${jwtClaim}.${jwtSignature}`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`Failed to get access token: ${errorText}`);
  }

  const tokenData = await tokenResponse.json() as { access_token?: string };
  if (!tokenData.access_token) {
    throw new Error('No access token in response');
  }

  accessToken = tokenData.access_token;
  return accessToken;
}

/**
 * Fetches data from a Google Sheets spreadsheet.
 */
/**
 * Fetches list of sheets in a spreadsheet.
 */
export async function fetchSheetsList(spreadsheetId: string): Promise<{ sheets: { title: string; index: number }[] }> {
  const token = await getAccessToken();

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Sheets API error: ${errorText}`);
  }

  const data = await response.json() as { sheets?: { properties: { title: string; index: number } }[] };
  
  const sheetList = data.sheets || [];
  return {
    sheets: sheetList.map(sheet => ({
      title: sheet.properties?.title || 'Unknown',
      index: sheet.properties?.index || 0,
    })),
  };
}

/**
 * Fetches data from a Google Sheets spreadsheet.
 */
export async function fetchSheetData(config: SheetConfig): Promise<ParsedSheetData> {
  const token = await getAccessToken();

  // Use specific range with rows to get data
  const range = config.range 
    ? `${config.sheetName}!${config.range}` 
    : `${config.sheetName}!A1:ZZ1000`;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${encodeURIComponent(range)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Sheets API error: ${errorText}`);
  }

  const data = await response.json() as SheetApiResponse;

  if (!data.values || data.values.length === 0) {
    return {
      rows: [],
      lastUpdated: new Date(),
      sheetName: config.sheetName,
    };
  }

  const rows = parseRows(data.values, true);

  return {
    rows,
    lastUpdated: new Date(),
    sheetName: config.sheetName,
  };
}

/**
 * Fetches data using a sheet configuration key.
 * @deprecated Use fetchData(spreadsheetId, sheetName) instead
 */
export async function fetchByKey(configKey: string): Promise<ParsedSheetData> {
  const { getSpreadsheetId, getDefaultRange } = await import('@/config/sheets');
  const spreadsheetId = getSpreadsheetId();

  if (!spreadsheetId) {
    throw new Error('Spreadsheet ID not configured');
  }

  // Use configKey as sheetName (backward compatibility)
  return fetchData(spreadsheetId, configKey, getDefaultRange());
}

/**
 * Fetches data from a specific sheet in a spreadsheet.
 * 
 * @param spreadsheetId - Google Sheets spreadsheet ID
 * @param sheetName - Name of the sheet/tab
 * @param range - Cell range (optional, defaults to A1:ZZ1000)
 */
export async function fetchData(
  spreadsheetId: string,
  sheetName: string,
  range = 'A1:ZZ1000'
): Promise<ParsedSheetData> {
  const token = await getAccessToken();

  const rangeStr = `${sheetName}!${range}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(rangeStr)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Sheets API error: ${errorText}`);
  }

  const data = await response.json() as SheetApiResponse;

  if (!data.values || data.values.length === 0) {
    return {
      rows: [],
      lastUpdated: new Date(),
      sheetName,
    };
  }

  const rows = parseRows(data.values, true);

  return {
    rows,
    lastUpdated: new Date(),
    sheetName,
  };
}

/**
 * Fetches person data from a sheet by person name.
 * Uses sheet name as identifier for the person.
 * 
 * @param personName - Name of the person (matches sheet name)
 */
export async function fetchPersonData(
  spreadsheetId: string,
  personName: string,
  range = 'A1:ZZ1000'
): Promise<ParsedSheetData> {
  return fetchData(spreadsheetId, personName, range);
}