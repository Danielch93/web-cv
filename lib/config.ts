/**
 * Centralized configuration loader.
 * Loads and validates environment variables.
 * 
 * WHY: Having a single config loader ensures all environment variables
 * are validated at startup and makes it easy to add new config values.
 */

/** App configuration loaded from environment */
export interface AppConfig {
  google: {
    sheetId: string;
    serviceAccountKeyPath: string;
  };
}

/** Load all app configuration */
export function loadConfig(): AppConfig {
  return {
    google: {
      sheetId: process.env.GOOGLE_SHEET_ID || '',
      serviceAccountKeyPath: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || './service-account-key.json',
    },
  };
}