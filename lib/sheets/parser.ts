import type { RawSheetRow, SheetRow, UrlInfo } from './types';

/**
 * Extracts domain from URL for icon mapping.
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'unknown';
  }
}

/**
 * Gets display name for a domain (for button label).
 */
function getDomainName(domain: string): string {
  const names: Record<string, string> = {
    'linkedin.com': 'LinkedIn',
    'upwork.com': 'Upwork',
    'fiverr.com': 'Fiverr',
    'github.com': 'GitHub',
    'gitlab.com': 'GitLab',
    'bitbucket.org': 'Bitbucket',
    'twitter.com': 'Twitter',
    'x.com': 'X',
    'instagram.com': 'Instagram',
    'youtube.com': 'YouTube',
    'stackoverflow.com': 'Stack Overflow',
    'medium.com': 'Medium',
    'dev.to': 'Dev.to',
    'codepen.io': 'CodePen',
    'codesandbox.io': 'CodeSandbox',
    'figma.com': 'Figma',
    'dribbble.com': 'Dribbble',
    'behance.net': 'Behance',
    'web': 'Web',
  };
  return names[domain] || domain;
}

/**
 * Parse URLs from comma-separated string.
 */
function parseUrls(urlString: string): string[] {
  if (!urlString || typeof urlString !== 'string') {
    return [];
  }
  return urlString
    .split(',')
    .map(url => url.trim())
    .filter(url => url.length > 0);
}

/**
 * Parse a raw row from Google Sheets into a typed SheetRow.
 * 
 * Column format:
 * - A: title
 * - B: color  
 * - C: urls (comma-separated)
 * - D: description
 */
export function parseRow(rawRow: RawSheetRow): SheetRow {
  const [title, color, urlsRaw, description, metadata] = rawRow;

  const urlsArray = parseUrls(String(urlsRaw || ''));

  return {
    title: String(title ?? ''),
    color: String(color ?? ''),
    urls: urlsArray,
    description: description ? String(description) : undefined,
    metadata: metadata ? String(metadata) : undefined,
  };
}

/**
 * Parse multiple rows from Google Sheets response.
 */
export function parseRows(values: RawSheetRow[], skipHeader = true): SheetRow[] {
  const dataRows = skipHeader && values.length > 0 ? values.slice(1) : values;
  return dataRows.filter(row => row.length > 0).map(parseRow);
}

/**
 * Validate that a row has the minimum required fields.
 */
export function isValidRow(row: SheetRow): boolean {
  return Boolean(row.title && row.color);
}

/**
 * Convert URLs to UrlInfo array with domain and name.
 */
export function parseUrlInfos(urls: string[]): UrlInfo[] {
  return urls.map(url => {
    const domain = extractDomain(url);
    return {
      url: url.startsWith('http') ? url : `https://${url}`,
      domain,
      name: getDomainName(domain),
    };
  });
}