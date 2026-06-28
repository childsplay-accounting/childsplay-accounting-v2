# Backlog: Childsplay Accounting

## Status
- Backend API: LIVE on Railway (https://childsplay-accounting-v2-production.up.railway.app)
- Database: PostgreSQL on Railway (connected and working)
- Frontend: Scaffolded but NOT yet deployed
- Interactive API docs: Available at /docs on the live URL
- Client Information GUIs: IN PROGRESS (this session)

---

## Current Sprint: Client Information GUIs

### Scope (IN PROGRESS)
- 5-page wizard/tabbed form for Add New Client, Edit Existing Client, Remove Terminated Client
- Pages: Structural, ID & Contact Details, Taxes & Income Sources, Marital Status & Dates, Connected Persons
- Gating logic: Language + Entity Type must be selected before other fields unlock
- Client Code auto-generation (3 alpha + 4 numeric)
- Third Party code dropdowns filtered by Client Group + Firm
- Save behaviour: draft allowed for "New", full validation for "Active"
- Archive (disable) flow with confirmation dialog
- See `.kiro/steering/client-information-gui.md` for full specification

---

## Immediate Next Steps (After Current Sprint)

### 1. Deploy the Frontend
- The React + Tailwind frontend is scaffolded in `/frontend/`
- Needs to be deployed as a separate service (Railway, Vercel, or Netlify)
- Must connect to the live backend API
- Staff can start using the app once the frontend is live

### 2. Railway Housekeeping
- Revert DATABASE_URL to reference format: `${{Postgres.DATABASE_URL}}`
  (Remember: click the "Changes" badge on the canvas to deploy after changing)
- Regenerate the PostgreSQL password (it was exposed in chat)
- Add `PORT=8000` variable if not already set

### 3. Client Information Refinements (Iterative)
- Entity-type-specific field visibility (hide irrelevant fields per entity type)
- Entity-type-specific required fields and validation rules
- Language-dependent validation messages
- ID number format validation (SA ID, passport, registration number)
- Cross-field validation (e.g., marital status vs spouse code)
- Default value logic per entity type
- Supervisor-only: change File Type from "New" to "Active"
- Supervisor-only: view Archived clients
- Read-only fields based on user role
- Multiple addresses per type (for businesses with branches)
- Cascading dropdowns: Country → Province → City → Suburb
- Integrated termination date capture on archive
- Client file comparison (diff between versions)
- Bulk archive operations
- Export/print client information

### 4. Link Status Bar to Active Details
- Connect all status bar placeholder values to real data:
  - Application version from package.json
  - Current module name from active route/module
  - Current client code from selected client
  - Logged-in user name from auth session
  - Current firm name from firm context
  - Date/time live updates
  - Copyright with current year
  - Online connection status (real network check)
  - Screen reference code from route/component metadata
  - Popup notifications from notification system

---

## Future Modules (Not Yet Started)

### Housekeeping: Permanent Deletion of Archived Clients
- Automated batch process to permanently delete client files
- Triggered **10 years** after the archive date (configurable per firm in future)
- Requires:
  - Audit trail / logging system to record archive date
  - Supervisor approval before permanent deletion
  - Cascading deletion of all related records (addresses, phones, taxes, names, dates, connected persons, income sources, personal details)
  - Notification to supervisor before deletion occurs
  - Grace period for supervisor to extend retention
- Must comply with data retention policies (POPIA, tax record requirements)
- Future: configurable retention period per firm and per record type

### Tax Administrative Register
- Tracks tax compliance deadlines, submissions, and statuses per client
- Links to client_tax_registrations data
- Uses timesheets for time tracking

### Timesheets
- Time tracking for work done per client
- Links to invoicing

### Communications Module
- **Gmail** integration (not SendGrid — user preference)
- **WhatsApp** integration
- **Push notifications**
- Automated communication hooks based on client events/deadlines

### Invoicing
- Links to timesheets and client data
- Google Drive integration for storage

---

## UI/UX Decisions (Discussed & Being Implemented)

### Colour Scheme
- **Primary:** Baby blue `#a2cffe`
- **Accent colours:**
  - Yellow: `#fdfea2`
  - Pink: `#fea2fd`
  - Peach: `#fed0a2`
  - Purple: `#e7a2fe`
  - Green: `#a2fea2`
- **Theme:** Dark blue menu/status bars with baby blue accents
- Reference site: https://www.childsplay-accounting.co.za/

### Copy-Paste Requirement
- ALL database fields must be accessible to the user to copy-paste from (and to) the application
- Use `select-text` CSS class on all text fields
- No fancy styled inputs that block text selection

### Surname Display Logic
- `non_capitalization_surname` field stores lowercase prefix (e.g., "de Kock", "van der Merwe")
- When following given names: display as lowercase ("Jan de Kock")
- When standalone: capitalize first letter ("De Kock", "Van der Merwe")

### Client Information GUI Style
- **Wizard + Tabs hybrid:** Tabs visible for page jumping, Next/Previous for sequential navigation
- **Window presentation:** Forms open as windows within the workpage area
- **Gating fields:** Language + Entity Type must be set before other fields unlock
- **Dynamic rows:** "Add another" for repeating fields (addresses, phones, taxes, etc.)
- **One per type (for now):** Limit to one entry per address type, phone type, etc.

---

## Architecture Decisions

### Multi-Firm Support
- `firm_id` on all core tables
- Default firm: "Childsplay Accounting" (code: "CPA", UUID: 00000000-0000-0000-0000-000000000001)
- Future: expand to serve other accounting firms

### Modular Design
- Client Information Database = Module 1 (core structural backbone)
- Each future module links to clients table
- Modules: Tax Register, Timesheets, Communications, Invoicing

### Client Code Auto-Generation
- Format: 3 UPPERCASE alpha + 4 zero-padded numeric (e.g., OLI0001)
- Alpha derived from Client Name (excluding spaces, special chars, surname prefixes for individuals)
- Numeric is sequential within the same alpha prefix
- Read-only in form — auto-generated on save

### Client File Type Lifecycle
```
New (draft) → Active (complete) → Archived (disabled) → Permanently Deleted (10 years)
```
- "Third Party" is a parallel state for reference-only contacts

### Deployment Architecture
- Backend: Railway (FastAPI + PostgreSQL)
- Frontend: TBD (Railway / Vercel / Netlify)
- Future production: Google Cloud (Cloud SQL for PostgreSQL)
- Data migration path: PostgreSQL export from Railway → import to Google Cloud SQL

### Integration Plans (Not Yet Started)
- **Google Drive API** — For invoice/media asset storage
- **Gmail** — For email communications
- **WhatsApp** — For client messaging
- **Push notifications** — For team alerts

---

## User Preferences (For All Future Sessions)

- User is a beginner at Kiro and GitHub — explain technical concepts when needed
- Push directly to `main` branch (no pull requests for now)
- After pushing, always watch for Railway's "Changes" badge and deploy staged changes
- Keep MVP deeply downscaled — no legacy data imports yet
- Absolute data integrity — no duplication (Core Rule 1)
- Client Information is the core backbone — expect many iterative refinements
- All Client Information pages are windows within the workpage area
- Future visibility/validation will be progressively built on Language + Entity Type selections
