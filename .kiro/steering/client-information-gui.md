# Client Information GUI Specification

## Overview
The Client Information module provides three main user interfaces, accessible from the **Clients** menu in the top menu bar:
1. **Add New Client** — Create a new client file (multi-page wizard/tabbed form)
2. **Edit Existing Client** — Modify an existing client file (search/select → same form pre-populated)
3. **Remove Terminated Client** — Disable (archive) a client file (search/select → confirmation)

These GUIs are presented as **windows within the workpage area** (the body of the web app).

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
1. **Preferred Communication - Language** (currently only "English")
2. **Entity Type**

Until both are selected, all remaining fields across all pages are **disabled/greyed out**. These two fields drive future validation logic (entity-type-specific required fields, conditional visibility, etc.).

---

## Page Structure

### Page 1: Segment Structural
| Field | Type | Notes |
|-------|------|-------|
| Preferred Communication - Language | Dropdown | **GATING FIELD** — must be selected first |
| Entity Type | Dropdown | **GATING FIELD** — must be selected first |
| Client Code | Text (read-only) | Auto-generated. See Client Code Rules below |
| Client Group Code | Dropdown | Groups belonging to the same Firm |
| Firm Code | Dropdown | Pre-populated from firms table |
| Client File Type | Dropdown | Defaults to "New" for new clients |
| Preferred Communication - Method | Dropdown | Defaults to "Email" |
| Client Temporary Marker | Checkbox | Default false |

#### Segment Identification (sub-heading on Page 1)
| Field | Type | Notes |
|-------|------|-------|
| Client ID Type | Dropdown | |
| Client ID No | Text | |

---

### Page 2: Segment ID & Contact Details

#### Client Name Section
| Field | Type | Notes |
|-------|------|-------|
| Client Name | Text | Primary name value |
| Name Type | Dropdown | |
| Individual Title | Dropdown | Nullable, visible for Individual entity types |
| Non-Capitalization Surname | Text | Nullable, for surname prefixes (de, van der, etc.) |

#### Segment Contact Details (sub-heading)

##### Addresses (dynamic — "Add another", one per address_type for now)
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

##### Phone Numbers (dynamic — "Add another", one per phone_type for now)
| Field | Type | Notes |
|-------|------|-------|
| Phone Type | Dropdown | |
| Phone Number | Text | |

##### Third Party Contact Person (dynamic — "Add another")
| Field | Type | Notes |
|-------|------|-------|
| Third Party Contact Person Code | Dropdown | Filtered to same Client Group + Firm |
| Third Party Contact Person Association | Dropdown | Connected person relationship enum |

##### Email & Domain
| Field | Type | Notes |
|-------|------|-------|
| E-mail Address | Text | |
| Domain | Text | Nullable (web domain) |

---

### Page 3: Segment Taxes & Income Sources

#### Tax Registrations (dynamic — "Add another")
| Field | Type | Notes |
|-------|------|-------|
| Tax Type | Dropdown | |
| Tax No | Text | |
| Tax Status | Dropdown | |
| VAT Registration | Text | Only visible when Tax Type = VAT |
| VAT Period | Dropdown | Only visible when Tax Type = VAT |
| eFiling Client Code | Text | Nullable |

#### Segment Income Sources (sub-heading, dynamic — "Add another")
| Field | Type | Notes |
|-------|------|-------|
| Associated Trading Name | Text | |
| Main Business Description | Text | Nullable |
| Occupation Description | Text | Nullable |

---

### Page 4: Segment Marital Status & Dates

#### Marital Status Section
| Field | Type | Notes |
|-------|------|-------|
| Marital Status | Dropdown | |
| Third Party Spouse Code | Dropdown | Filtered to same Client Group + Firm (Third Party clients) |

#### Segment Dates (sub-heading, dynamic — "Add another")
| Field | Type | Notes |
|-------|------|-------|
| Official Date Type | Dropdown | |
| Official Date | Date picker | |
| Year-end | Dropdown (month) | Nullable |

---

### Page 5: Segment Connected Persons

#### Connected Persons (dynamic — "Add another")
| Field | Type | Notes |
|-------|------|-------|
| Connected Person Relationship | Dropdown | |
| Third Party Connected Person Code | Dropdown | Filtered to same Client Group + Firm |

---

## Pages 6+ (Future — Not Yet Specified)
Additional pages will be added as the module expands. The tab interface supports unlimited pages.

---

## Client Code Auto-Generation Rules

The Client Code is **7 characters**: 3 alphabetic + 4 numeric.

### First 3 Letters (alphabetic)
- Based on the **Client Name** field value
- For **all entity types**: Use the first 3 letters of the name
- For **individuals with Non-Capitalization Surname marked**: Skip the prefix(es), use the first 3 letters of the root surname
  - Example: "de Kock" → KOC, "van der Merwe" → MER
- **Exclude** all spaces and special characters from the name before extracting letters
  - Example: "B & C Enterprises (Pty) Ltd" → BCE
  - Example: "Olivier Broers" → OLI
- Letters are **UPPERCASE**

### Last 4 Digits (numeric)
- Sequential number within the same 3-letter prefix
- Zero-padded: 0001, 0002, 0003, etc.
- Example sequence: BAR0001, BAR0002, BAR0003

### Display
- Client Code is **read-only** in the form (auto-generated on save)
- Displayed after the Client Name is entered (preview)

---

## Three GUI Operations

### 1. Add New Client
- Accessed via: Clients → Add New Client
- Opens a new (blank) 5-page form in the workpage area
- Language and Entity Type must be selected first (gating)
- Client File Type defaults to "New"
- Client Code auto-generated when Client Name is provided
- User can save at any time (draft state while File Type = "New")
- All pages accessible but fields disabled until gate fields selected

### 2. Edit Existing Client
- Accessed via: Clients → Edit Existing Client
- First shows a **client search/selection** interface
- After selection, opens the same 5-page form pre-populated with existing data
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

## Save Behaviour

- **File Type = "New"**: User may save a partially-completed form (draft). No mandatory field validation beyond Language and Entity Type.
- **File Type = "Active"**: All relevant required fields across all 5 pages must be completed before saving. Validation enforced.
- **File Type = "Third Party"**: Minimal required fields (to be defined later).
- **File Type = "Archived"**: Read-only (no saves allowed except by supervisor to change status).

---

## Third Party Code Dropdowns

All "Third Party" code dropdowns (Contact Person, Spouse, Connected Person) are:
- Populated from the `clients` table where `client_file_type = 'Third Party'`
- **Filtered** to clients belonging to the same `client_group_id` AND `firm_id` as the current client
- Displayed as: `client_code - client_name`

---

## Future Work (Not Yet Implemented)

### Visibility & Access Control
- Hide/show pages and fields based on Entity Type
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
