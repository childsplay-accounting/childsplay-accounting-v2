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
