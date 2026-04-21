# Team CodeLager - Professional Portfolio

A dynamic team portfolio built with Next.js 15 that loads team member data from Google Sheets.

**Live Site:** https://codelager.vercel.app/

## Architecture

### Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Three.js + Vanta.js
- **Markdown:** react-markdown
- **Icons:** react-icons
- **API Client:** googleapis

## Google Sheets Integration

### How It Works

1. **Data Source:** Each team member has their own sheet/tab in a Google Spreadsheet
2. **Authentication:** Uses a Google Service Account with OAuth2 (JWT)
3. **Fetching:** Direct REST API calls to Google Sheets v4 API

### Key Files

```
lib/
├── sheets/
│   ├── client.ts    # Google Sheets API client (REST)
│   ├── parser.ts    # Data parsing
│   └── types.ts     # TypeScript interfaces
├── config.ts        # Environment config
└── i18n.ts         # Translations
```

### Flow

1. Server Component (`app/page.tsx`) fetches list of all sheets
2. For each sheet, fetches the data rows
3. Passes data to Client Component (`TeamContent`)
4. Renders each member's experience in a grid

### Security

- Credentials stored as base64 in `GOOGLE_SERVICE_ACCOUNT_KEY` env var
- Service Account has only read access (`spreadsheets.readonly` scope)
- API calls happen server-side (credentials never exposed to client)

## Environment Variables

Required in Vercel:

- `GOOGLE_SERVICE_ACCOUNT_KEY` - Base64-encoded service account JSON
- `GOOGLE_SHEET_ID` - Google Sheets spreadsheet ID

## Getting Started

```bash
# Install dependencies
npm install

# Run locally
npm run dev
```

Open http://localhost:3000

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Make sure to configure the environment variables in the Vercel dashboard.