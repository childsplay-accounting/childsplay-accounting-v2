# Backlog: Childsplay Accounting

## Status
- Backend API: LIVE on Railway (https://childsplay-accounting-v2-production.up.railway.app)
- Database: PostgreSQL on Railway (connected and working)
- Frontend: Scaffolded but NOT yet deployed
- Interactive API docs: Available at /docs on the live URL

---

## Immediate Next Steps

### 1. Workpage GUI (IN PROGRESS)
- Replacing sidebar layout with three-area workpage layout
- Top horizontal drop-down menu bar (full width)
- Open workpage area (fills remaining space)
- Bottom status bar (full width)
- See `.kiro/steering/workpage-gui.md` for full specification

### 2. Deploy the Frontend
- The React + Tailwind frontend is scaffolded in `/frontend/`
- Needs to be deployed as a separate service (Railway, Vercel, or Netlify)
- Must connect to the live backend API
- Staff can start using the app once the frontend is live

### 3. Complete the Client Form UI
- Currently only core fields are in the form (client code, entity type, file status, ID)
- Needs full sections for:
  - Names (multiple, with title, surname capitalization logic)
  - Addresses (multiple, with type)
  - Phone numbers (multiple, with type)
  - Email addresses (multiple)
  - Tax registrations (multiple, with VAT-specific fields)
  - Income sources (trading names, business descriptions)
  - Official dates (birthday, registration, year-end, etc.)
  - Connected persons (link to other clients or third-party contacts)
  - Personal details (marital status, domain)

### 4. Make GitHub Repository Private Again
- The repo was made public temporarily to allow Vercel (Hobby plan) to deploy commits from Kiro Agent
- Once you upgrade Vercel to Pro, or find an alternative deployment workflow, switch the repo back to private:
  1. Go to github.com/childsplay-accounting/childsplay-accounting-v2 → Settings → Danger Zone → Change visibility → Private
- This is a security/privacy best practice for production business applications

### 5. Railway Housekeeping
- Revert DATABASE_URL to reference format: `${{Postgres.DATABASE_URL}}`
  (Remember: click the "Changes" badge on the canvas to deploy after changing)
- Regenerate the PostgreSQL password (it was exposed in chat)
- Add `PORT=8000` variable if not already set

---

## Future Modules (Not Yet Started)

### Link Status Bar to Active Details
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

### Tax Administrative Register
- Tracks tax compliance deadlines, submissions, and statuses per client
- Links to client_tax_registrations data
- Uses timesheets for time tracking

### Timesheets
- Time tracking for work done per client
- Links to invoicing

### Communications Module
- **Gmail** integration (not SendGrid as originally planned — user preference)
- **WhatsApp** integration
- **Push notifications**
- Automated communication hooks based on client events/deadlines

---

## UI/UX Decisions (Discussed, Not Yet Implemented)

### Colour Scheme
- **Primary:** Baby blue `#a2cffe`
- **Accent colours:**
  - Yellow: `#fdfea2`
  - Pink: `#fea2fd`
  - Peach: `#fed0a2`
  - Purple: `#e7a2fe`
  - Green: `#a2fea2`
- **Theme:** Dark blue sidebar with baby blue accents (current)
- Reference site: https://www.childsplay-accounting.co.za/ (blocked for bot access — use colours above)

### Copy-Paste Requirement
- ALL database fields must be accessible to the user to copy-paste from (and to) the application
- Use `data-copyable` attribute and `select-text` CSS class
- No fancy styled inputs that block text selection

### Surname Display Logic
- `non_capitalization_surname` field stores lowercase prefix (e.g., "de Kock", "van der Merwe")
- When following given names: display as lowercase ("Jan de Kock")
- When standalone: capitalize first letter ("De Kock", "Van der Merwe")

### Future: Cascading Dropdowns
- Country → Province → City/Town → Suburb
- Initially South African provinces only
- Later expand to other countries

---

## Architecture Decisions

### Multi-Firm Support
- `firm_id` on all core tables
- Default firm: "Childsplay Accounting" (code: "CPA", UUID: 00000000-0000-0000-0000-000000000001)
- Future: expand to serve other accounting firms

### Modular Design
- Client Information Database = Module 1
- Each future module links to clients table
- Modules: Tax Register, Timesheets, Communications, Invoicing

### Deployment Architecture
- Backend: Railway (FastAPI + PostgreSQL)
- Frontend: TBD (Railway / Vercel / Netlify)
- Future production: Google Cloud (Cloud SQL for PostgreSQL)
- Data migration path: PostgreSQL export from Railway → import to Google Cloud SQL

### Integration Plans (Not Yet Started)
- **Google Drive API** — For invoice/media asset storage
- **Gmail** — For email communications (replaces SendGrid in original tech.md)
- **WhatsApp** — For client messaging
- **Push notifications** — For team alerts

---

## User Preferences (For All Future Sessions)

- User is a beginner at Kiro and GitHub — explain technical concepts when needed
- Push directly to `main` branch (no pull requests for now)
- After pushing, always watch for Railway's "Changes" badge and deploy staged changes
- Keep MVP deeply downscaled — no legacy data imports yet
- Absolute data integrity — no duplication (Core Rule 1)
- **Styling consistency:** All styling from Client Information module must be applied to ALL future modules
- **Non-Capitalization Surname** is a BOOLEAN (Yes/No) field, not a text field

---

## REMINDERS (Check in Next Sessions)

### Version Bumping (Remind Kiro at End of Each Session)
- The application version is stored in the `business_details` master file (`current_version` field)
- The Status Bar displays this version dynamically from the API
- **At the end of each session where notable work was done, remind Kiro to bump the version**
- Kiro will update the `current_version` field in the seed file and database

**Semantic Versioning explained:**
- Format: `v major.minor.patch` (e.g. `v0.1.0`)
- **Patch** (0.1.0 → 0.1.**1**): Small bug fixes
- **Minor** (0.1.0 → 0.**2**.0): New features added (like adding a new database table or module)
- **Major** (0.1.0 → **1**.0.0): Big milestone or breaking change (e.g. the app goes live to real users)

### Implement Admin Housekeeping for Business Details Master File
- The `business_details` table has a single record with all Childsplay Accounting business information
- Currently seeded with default values and accessible via `GET /business-details` and `PUT /business-details`
- **TODO:** Build an administrative GUI (housekeeping function) to allow editing this single record directly from the frontend
- This should be a simple form (no wizard needed — single record, no repeating panels)
- Once built, the Status Bar copyright and other application-wide references will pull from this record

### Populate Third Party / Firm / Group Dropdowns
The following dropdowns currently show empty and need API endpoints + frontend wiring:
- Third Party Contact Person Code → list Third Party clients filtered by group + firm
- Third Party Spouse Code → same filter
- Third Party Connected Person Code → same filter
- Client Group Code → list groups for the current firm
- Firm Code → list available firms
**Must be tested and verified.**

### Client Code Gap-Filling
- The auto-generation now fills gaps in the numeric sequence
- When a client is permanently deleted after 10 years, the code becomes available for reuse
- Verify this works correctly once permanent deletion housekeeping is implemented
