# AGENTS.md

Dynamic Frontend with Google Sheets

This file serves as the README for AI agents, providing the technical context and rules required for consistent, secure, and educational development

## Commands

- Install dependencies: npm install

- Development server: npm run dev

- Build project: npm run build

- Linting: npm run lint (Agent MUST run this before finishing any task to ensure code quality).

- Add Skills: npx skills add <owner/repo>


## Architecture

- Main Stack: Next.js 15+ (App Router), React, Tailwind CSS

- Entry Point: app/page.tsx.

- Key Directories:
    - /components: Pure UI components, pedagogically commented for learning.
    - /lib: Connection logic for Google Drive and Google Sheets API.
    - /hooks: Reusable state management and logic.

- Connectivity: Integration via Model Context Protocol (MCP) or specific Skills such as - - googleworkspace/cli/gws-sheets to access Google Workspace data

## Gotchas

- Mentor Comments: For every new file or function, the agent MUST add comments explaining not just "what" the code does, but the technical "why" (e.g., "We use a Server Component here to keep the API Key secure and improve SEO").

- Naming Convention: Always use camelCase for variables and functions. Names must be highly descriptive to aid the learning process.

- Responsive Tailwind: When using complex Tailwind classes, add a comment explaining how they affect the design across different breakpoints (sm, md, lg).

- Security First: Never hardcode credentials. Use .env.local for API Keys and ensure the file is listed in .gitignore

- Source of Truth: The column structure of the Google Sheet in Drive is the absolute source of truth for frontend data types.

## References

- Agent Standard: https://agents.md

- MCP Documentation: Model Context Protocol

- Skills Ecosystem: https://skills.sh

- Google Sheets API: Official Google Workspace Documentation