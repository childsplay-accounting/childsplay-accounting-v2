# Client Information GUI Specification

## Overview
The Client Information module provides three main user interfaces, accessible from the **Clients** menu in the top menu bar:
1. **Add New Client** — Create a new client file (multi-page wizard/tabbed form)
2. **Edit Existing Client** — Modify an existing client file (search/select → same form pre-populated)
3. **Remove Terminated Client** — Disable (archive) a client file (search/select → confirmation)

These GUIs are presented as **windows within the workpage area** (the body of the web app).

---

## Styling Consistency Rule

All styling implemented for the Client Information module (form layout, field components, colours, spacing, tab navigation, dynamic field groups, etc.) **must be applied consistently in all future modules** of Childsplay Accounting. This includes:
- Form field components (TextField, SelectField, CheckboxField, DateField)
- Page/tab navigation (wizard + tabs hybrid)
- Dynamic "Add another" field groups
- Window presentation within workpage area
- Baby blue colour scheme with accents
- Copy-paste friendly text selection on all fields

---

## Navigation Style: Wizard + Tabs Hybrid

The Client Information form uses a **combined multi-step wizard and tabbed interface**:
- Page tabs are always visible at the top of the form window, allowing the user to jump to any page
- Next/Previous buttons are available at the bottom of each page for sequential navigation
- The currently active page tab is visually highlighted
- Future: Certain tabs/pages will be hidden based on entity type and user access level

---

## Prerequisite Fields (Gating Logic)

On **Page 1**, the following two fields must be selected **first**, before any other fields on any page become enabled:
1. **Preferred Communication - Language** (defaults to "English")
2. **Entity Type**

Until both are selected, all remaining fields across all pages are **disabled/greyed out**. These two fields drive future validation logic (entity-type-specific required fields, conditional visibility, etc.).

---

## Page Structure (6 Pages)

### Page 1: Segment Structural
| Field | Type | Notes |
|-------|------|-------|
| Preferred Communication - Language | Dropdown | **GATING FIELD** — defaults to "English" |
| Entity Type | Dropdown | **GATING FIELD** — must be selected first |
| Client Code | Text (read-only) | Auto-generated. See Client Code Rules below |
| Client Group Code | Dropdown | Groups belonging to the same Firm |
| Firm Code | Dropdown | Pre-populated from firms table |
| Client File Type | Dropdown | Defaults to "New" for new clients |
| Preferred Communication - Method | Dropdown | Defaults to "Email" |
| Client Temporary Marker | Checkbox | Default false |

---

### Page 2: Segment ID
| Field | Type | Notes |
|-------|------|-------|
| Client ID Type | Dropdown | |
| Client ID No | Text | |
| Client Name | Text | Primary name value |
| Name Type | Dropdown | |
| Individual Title | Dropdown | **Only editable when Entity Type starts with "Individual"** |
| Non-Capitalization Surname | Boolean (Yes/No) | **Only editable when Entity Type starts with "Individual" AND Name Type is "Surname"** |

---

### Page 3: Segment Contact Details

#### Addresses (first entry shown by default, "Add another" for more, one per address_type for now)
| Field | Type | Notes |
|-------|------|-------|
| Address Type | Dropdown | |
| Complex Unit Number | Text | Nullable |
| Complex Name | Text | Nullable |
| Street Number | Text | |
| Street Name | Text | |
| Suburb | Text | Nullable |
| City / Town | Text | |
| Postal Code | Text | |
| Province | Dropdown | South African provinces |
| Country | Text | Default "South Africa" |

#### Phone Numbers (dynamic — "Add another", one per phone_type for now)
| Field | Type | Notes |
|-------|------|-------|
| Phone Type | Dropdown | |
| Phone Number | Text | |

#### Third Party Contact Person (dynamic — "Add another")
| Field | Type | Notes |
|-------|------|-------|
| Third Party Contact Person Code | Dropdown | Filtered to same Client Group + Firm |
| Third Party Contact Person Association | Dropdown | Connected person relationship enum |

#### Email & Domain
| Field | Type | Notes |
|-------|------|-------|
| E-mail Address | Text | |
| Domain | Text | Nullable (web domain) |

---

### Page 4: Segment Taxes & Income Sources

#### Tax Registrations (dynamic — "Add another")
| Field | Type | Notes |
|-------|------|-------|
| Tax Type | Dropdown | |
| Tax No | Text | |
| Tax Status | Dropdown | |
| VAT Registration | Text | Only visible when Tax Type = VAT |
| VAT Period | Dropdown | Only visible when Tax Type = VAT |
| eFiling Client Code | Text | Nullable |

#### Segment Income Sources (first entry shown by default, "Add another" for more)
| Field | Type | Notes |
|-------|------|-------|
| Associated Trading Name | Text | |
| Main Business Description | Text | Nullable |
| Occupation Description | Text | Nullable |

---

### Page 5: Segment Marital Status & Dates

**Visibility:** This entire page only applies when **Entity Type starts with "Individual"**. For non-individual entities, this page tab is disabled/hidden.

#### Marital Status Section
| Field | Type | Notes |
|-------|------|-------|
| Marital Status | Dropdown | |
| Third Party Spouse Code | Dropdown | **Only shown/required when Marital Status starts with "Married"**. Filtered to same Client Group + Firm |

#### Segment Dates (dynamic — "Add another")
| Field | Type | Notes |
|-------|------|-------|
| Official Date Type | Dropdown | |
| Official Date | Date picker | |
| Year-end | Dropdown (month) | Nullable |

---

### Page 6: Segment Connected Persons

**Layout:** Similar structure to Page 5 (Segment Marital Status).

#### Connected Persons (dynamic — "Add another")
| Field | Type | Notes |
|-------|------|-------|
| Connected Person Relationship | Dropdown | |
| Third Party Connected Person Code | Dropdown | Filtered to same Client Group + Firm |

---

## Pages 7+ (Future — Not Yet Specified)
Additional pages will be added as the module expands. The tab interface supports unlimited pages.

---

## Client Code Auto-Generation Rules

The Client Code is **7 characters**: 3 alphabetic + 4 numeric.

### First 3 Letters (alphabetic)
- Based on the **Client Name** field value
- For **all entity types**: Use the first 3 letters of the name
- For **individuals with Non-Capitalization Surname = Yes**: Skip the prefix(es), use the first 3 letters of the root surname
  - Example: "de Kock" → KOC, "van der Merwe" → MER
- **Exclude** all spaces and special characters from the name before extracting letters
  - Example: "B & C Enterprises (Pty) Ltd" → BCE
  - Example: "Olivier Broers" → OLI
- Letters are **UPPERCASE**

### Last 4 Digits (numeric)
- Sequential number within the same 3-letter prefix per firm
- Zero-padded: 0001, 0002, 0003, etc.
- **Gap-filling:** If a code is removed (e.g., after permanent deletion), the gap is filled by the next new client
  - Example: OLI0001, OLI0002, OLI0003, OLI0005 → next OLI client gets OLI0004

### Display
- Client Code is **read-only** in the form (auto-generated on save)
- Displayed after the Client Name is entered (preview)

---

## Three GUI Operations

### 1. Add New Client
- Accessed via: Clients → Add New Client
- Opens a new (blank) 6-page form in the workpage area
- Language defaults to "English"; Entity Type must be selected (gating)
- Client File Type defaults to "New"
- Client Code auto-generated when Client Name is provided
- User can save at any time (draft state while File Type = "New")
- All pages accessible but fields disabled until gate fields selected

### 2. Edit Existing Client
- Accessed via: Clients → Edit Existing Client
- First shows a **client search/selection** interface
- After selection, opens the same 6-page form pre-populated with existing data
- All fields are currently editable (future: some read-only based on access rights)
- Save updates the existing record

### 3. Remove Terminated Client (Disable/Archive)
- Accessed via: Clients → Remove Terminated Client
- Shows a **client search/selection** interface
- After selection, displays a **confirmation dialog** with client summary
- On confirm: Sets `client_file_type` to "Archived"
- Archived clients are **hidden from normal views** (future: visible to supervisors)
- **No data is deleted** — the record remains in the database

---

## Client File Type Lifecycle

```
New (draft, partially complete allowed)
  ↓ (supervisor changes status when complete)
Active (all required fields must be complete)
  ↓ (Remove Terminated Client action)
Archived (hidden from normal views, data preserved)
  ↓ (future: housekeeping process, normally after 10 years)
Permanently Deleted (data removed from database)
```

### Third Party
- A special file type for contacts/related persons who are not direct clients
- Captured similarly to other clients but serve as reference targets
- Referenced by Third Party codes in contact person, spouse, and connected person fields
- Dropdown lists for Third Party selection are **filtered** to clients of the same Client Group Code and Firm Code

---

## Conditional Visibility Rules

### Entity Type Conditionals
- **Individual Title**: Only editable when Entity Type starts with "Individual"
- **Non-Capitalization Surname**: Only editable when Entity Type starts with "Individual" AND Name Type is "Surname"
- **Page 5 (Marital Status & Dates)**: Entire page only visible/applicable when Entity Type starts with "Individual"
- **Spouse details**: Only required/shown when Marital Status starts with "Married"

### Client ID Type Conditionals
- **"Identification Document"** and **"Passport"**: Only valid for Individual entity types. Non-individuals must use "Registration Number".
- **"Passport"**: Only valid if the individual resides outside South Africa (Residential Address with Country ≠ "South Africa").
- This is a **soft/delayed validation** — checked when both fields are filled or form is submitted. Error shown while the problem persists.

### VAT Conditionals
- **VAT Registration** and **VAT Period**: Only visible when Tax Type = "Value Added Tax (VAT)"

---

## Page Status Warnings

Each page displays a status warning area at the top showing:
1. **Errors** (red ink — bg-red-50, text-red-700): Validation errors that must be resolved
2. **Informational warnings** (subtle amber — bg-amber-50, text-amber-600): File type notices, etc.

### Always-visible warnings:
- When Client File Type is "New": amber info that file is a draft
- When Client File Type is "Third Party": amber info that file is a reference contact
- When Client File Type is "Archived": amber info that file is disabled/hidden
- When Client File Type is "Active" (no errors): green success that file is live and operational

### Validation errors shown per page:
- **Page 2**: Client ID Type mismatch with Entity Type or address country
- **Page 2**: SA ID number Luhn check failure (13 digits, check digit)
- **Page 4**: SARS tax reference number Luhn check failure (10 digits, check digit)

---

## Number Validation (Luhn Algorithm)

### SA Identity Number (13 digits)
- Digits 1-6: Date of birth (YYMMDD)
- Digits 7-10: Gender (0000-4999 female, 5000-9999 male)
- Digit 11: Citizenship (0 = SA citizen, 1 = permanent resident)
- Digit 13: Check digit (Luhn algorithm)

### SARS Tax Reference Number (10 digits)
- Digit 1: Tax type indicator
  - 0 = Income Tax (Individuals and Estates — entity types starting with "Individual" or "Estate")
  - 9 = Income Tax (All other entity types: Companies, Close Corporations, Trusts, Partnerships, etc.)
  - 4 = Value Added Tax (VAT) — all entity types
  - 7 = Employees Tax (EMP/PAYE) — all entity types that are employers
- Digits 2-9: Unique taxpayer identifier
- Digit 10: Check digit (Luhn algorithm)

### Tax Number Validations Still To Be Implemented (REMINDER)
The following tax types need their reference number format and validation rules researched and implemented:
- Diesel Rebate (DR)
- Dividend Withholding Tax (DWT)
- Donations Tax (DT)
- Employment Equity (EE)
- Employment Tax Incentive (ETI)
- Estate Duty (ED)
- Public Benefit Organisation (PBO)
- Securities Transfer Tax (STT)
- Skills Development Levies (SDL)
- Transfer Duty (TD)
- Turnover Tax
- Unemployment Insurance Fund Contributions (UIF)
- Workmen's Compensation Fund Contributions (WCF)

---

## Save Behaviour

- **File Type = "New"**: User may save a partially-completed form (draft). No mandatory field validation beyond Language and Entity Type.
- **File Type = "Active"**: All relevant required fields across all 6 pages must be completed before saving. Validation enforced.
- **File Type = "Third Party"**: Minimal required fields (to be defined later).
- **File Type = "Archived"**: Read-only (no saves allowed except by supervisor to change status).

---

## Third Party Code Dropdowns

All "Third Party" code dropdowns (Contact Person, Spouse, Connected Person) are:
- Populated from the `clients` table where `client_file_type = 'Third Party'`
- **Filtered** to clients belonging to the same `client_group_id` AND `firm_id` as the current client
- Displayed as: `client_code - client_name`

### REMINDER: Populate Third Party / Firm / Group Dropdowns
The following dropdowns currently show empty options and need to be connected to the API:
- Third Party Contact Person Code → needs API endpoint to list Third Party clients filtered by group + firm
- Third Party Spouse Code → same filter
- Third Party Connected Person Code → same filter
- Client Group Code → needs API endpoint to list groups for the current firm
- Firm Code → needs API endpoint to list firms
**This must be tested and verified in an upcoming session.**

---

## Future Work (Not Yet Implemented)

### Visibility & Access Control
- Hide/show pages and fields based on Entity Type (partially implemented: Individual Title, Non-Cap Surname, Page 5)
- Read-only fields based on user role (standard user vs supervisor)
- Supervisor-only access to view Archived clients
- Supervisor-only ability to change File Type from "New" to "Active"

### Validation Rules
- Entity-type-specific required fields
- Language-dependent validation messages
- ID number format validation (SA ID, passport, registration number)
- Cross-field validation (e.g., marital status vs spouse code)

### Housekeeping: Permanent Deletion
- Archived client files will be permanently deleted after **10 years** from the archive date
- This will be an automated housekeeping process (batch job)
- Requires an audit trail / logging system to record the archive date
- Supervisor approval required before permanent deletion
- Deletion cascades to all related records (addresses, phones, taxes, etc.)
- Future: configurable retention period per firm
- Gap-filling: When a client code is permanently deleted, the number becomes available for reuse

### Additional Future Enhancements
- Cascading dropdowns: Country → Province → City → Suburb
- Multiple addresses per type (for businesses with branches)
- Integrated logging/audit system for all changes
- Termination date capture as part of archive process
- Bulk operations (archive multiple clients)
- Export/print client information
- Client file comparison (diff between versions)

---

## UI/UX Rules (inherited from data-model.md)
- **Colour scheme:** Baby blue primary (#a2cffe), with accents
- **Copy-paste friendly:** All field values selectable and copyable
- **Surname display logic:** Non-capitalization prefix lowercase after given names, capitalized when standalone
- **Window presentation:** Forms open as windows within the workpage area
- **Consistent layout:** All module forms follow the same visual structure
- **Styling consistency:** All styling from this module applies to ALL future modules

---

## General Development Note
The Client Information module is the **core structural backbone** of the Childsplay Accounting application. It will undergo several iterative refinements including:
- GUI layout adjustments
- Visibility rules per entity type and user role
- Default value logic
- Validation rules (progressive, building on Language + Entity Type)
- Exception handling
- Integration with other modules (Tax Register, Timesheets, Communications)

Each refinement will be documented in this steering file as specifications are finalized.

---

## Cross-Table Dependency: clients ↔ business_details

**IMPORTANT:** Structural changes to the Client Information database table (`clients`) may result in structural changes to the associated fields of the **Childsplay Accounting DB Master File** database structure (`business_details`).

This relationship has been documented in a separate session (possibly in the `childsplay-accounting-v` repository). When modifying the `clients` table schema, always consider:
- Whether equivalent fields exist in `business_details` that need updating
- Whether new fields in `clients` should be reflected in the Master File
- Whether validation rules or ENUMs shared between the two tables need synchronising

This cross-table dependency must be checked whenever:
- New columns are added to `clients`
- Column types or constraints are changed on `clients`
- ENUM values are added/modified
- Relationships between `clients` and other tables change
