# Data Model: Client Information Database

## Overview
The Client Information Database is the first module of Childsplay Accounting. It stores permanent client information for communication, tax administration, corporate secretarial work, and invoicing.

## Design Principles
- Normalized schema — no data duplication (Core Rule 1)
- One-to-many relationships for repeating data (addresses, phones, tax registrations, etc.)
- Multi-firm ready (firm_id on all core tables)
- All ENUMs defined below are the single source of truth

---

## Tables

### firms
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| firm_code | VARCHAR(20) | Unique |
| firm_name | VARCHAR(255) | |
| created_at | TIMESTAMP | Auto-set |

### client_groups
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| firm_id | UUID (FK → firms) | |
| group_code | VARCHAR(20) | Unique per firm |
| group_name | VARCHAR(255) | |

### clients
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| firm_id | UUID (FK → firms) | |
| client_group_id | UUID (FK → client_groups) | Nullable |
| client_code | VARCHAR(20) | Unique per firm |
| entity_type | ENUM | See ENUMs below |
| client_file_type | ENUM | See ENUMs below |
| client_id_type | ENUM | See ENUMs below |
| client_id_number | VARCHAR(50) | |
| preferred_language | ENUM | Default "English" |
| preferred_communication_method | ENUM | Default "Email" |
| temporary_marker | BOOLEAN | Default false |
| created_at | TIMESTAMP | Auto-set |
| updated_at | TIMESTAMP | Auto-updated |

### client_names
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| client_id | UUID (FK → clients) | |
| name_type | ENUM | See ENUMs below |
| name_value | VARCHAR(255) | |
| individual_title | ENUM | Nullable. See ENUMs below |
| non_capitalization_surname | VARCHAR(255) | Nullable. Lowercase prefix surname (e.g., "de Kock", "van der Merwe"). Display as lowercase after given names; capitalize when standalone. |
| is_primary | BOOLEAN | One primary per client |

### client_addresses
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| client_id | UUID (FK → clients) | |
| address_type | ENUM | See ENUMs below |
| complex_unit_number | VARCHAR(20) | Nullable |
| complex_name | VARCHAR(255) | Nullable |
| street_number | VARCHAR(20) | |
| street_name | VARCHAR(255) | |
| suburb | VARCHAR(255) | Nullable |
| city | VARCHAR(255) | |
| postal_code | VARCHAR(10) | |
| province | VARCHAR(100) | See ENUMs below |
| country | VARCHAR(100) | Default "South Africa" |
| is_primary | BOOLEAN | |

### client_phones
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| client_id | UUID (FK → clients) | |
| phone_type | ENUM | See ENUMs below |
| phone_number | VARCHAR(20) | |
| is_primary | BOOLEAN | |

### client_emails
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| client_id | UUID (FK → clients) | |
| email_address | VARCHAR(255) | |
| is_primary | BOOLEAN | |

### client_tax_registrations
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| client_id | UUID (FK → clients) | |
| tax_type | ENUM | See ENUMs below |
| tax_number | VARCHAR(50) | |
| tax_status | ENUM | See ENUMs below |
| vat_registration | VARCHAR(50) | Nullable (only for VAT type) |
| vat_period | ENUM | Nullable (only for VAT type). See ENUMs below |
| efiling_client_code | VARCHAR(50) | Nullable |

### client_income_sources
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| client_id | UUID (FK → clients) | |
| trading_name | VARCHAR(255) | |
| business_description | VARCHAR(500) | Nullable |
| occupation_description | VARCHAR(500) | Nullable |

### client_dates
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| client_id | UUID (FK → clients) | |
| date_type | ENUM | See ENUMs below |
| date_value | DATE | |
| year_end_month | ENUM | Nullable. See ENUMs below |

### contact_persons
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| firm_id | UUID (FK → firms) | |
| contact_code | VARCHAR(20) | Unique per firm |
| full_name | VARCHAR(255) | |
| phone_number | VARCHAR(20) | Nullable |
| email_address | VARCHAR(255) | Nullable |

### client_connected_persons
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| client_id | UUID (FK → clients) | The client this person is connected to |
| connected_client_id | UUID (FK → clients) | Nullable — if the connected person is also a client |
| contact_person_id | UUID (FK → contact_persons) | Nullable — if they're a third-party contact |
| relationship | ENUM | See ENUMs below |

> Constraint: Either `connected_client_id` OR `contact_person_id` must be set — never both, never neither.

### client_personal_details
| Field | Type | Notes |
|-------|------|-------|
| id | UUID (PK) | Auto-generated |
| client_id | UUID (FK → clients) | One-to-one |
| marital_status | ENUM | Nullable. See ENUMs below |
| spouse_contact_code | VARCHAR(20) | Nullable (references contact_persons.contact_code) |
| domain | VARCHAR(255) | Nullable (web domain) |

---

## ENUMs

### entity_type
- Church
- Close Corporation
- Club
- Co-operative
- Company: Private
- Company: Public
- Estate: Deceased
- Estate: Insolvent
- Individual: Deceased Estate Only
- Individual: Defined Farmer
- Individual: Tax Calculation Only
- Individual: With Balance Sheet
- Partnership
- Property Association
- School
- Trust: Inter Vivos
- Trust: Testamentary
- Welfare Organisation

### client_file_type
- New
- Active
- Third Party
- Archived

### client_id_type
- Identification Document
- Passport
- Registration Number

### name_type
- Nickname
- Surname
- Full Names
- Registered Name
- Trading Name
- Defensive Name

### individual_title
- Dr
- Hon
- Mr
- Mrs
- Ms
- Prof
- Rev
- St

### address_type
- Business Address
- Home Address
- Registered Address

### phone_type
- Business Phone
- Home Phone
- Mobile Phone

### tax_type
- Diesel Rebate (DR)
- Dividend Withholding Tax (DWT)
- Donations Tax (DT)
- Employees Tax (EMP)
- Employment Equity (EE)
- Employment Tax Incentive (ETI)
- Estate Duty (ED)
- Income Tax (IT)
- Public Benefit Organisation (PBO)
- Securities Transfer Tax (STT)
- Skills Development Levies (SDL)
- Transfer Duty (TD)
- Turnover Tax
- Unemployment Insurance Fund Contributions (UIF)
- Value Added Tax (VAT)
- Workmen's Compensation Fund Contributions (WCF)

### tax_status
- Active
- Dormant
- Provisional
- Suspended

### vat_period
- A (bi-monthly, ending January)
- B (bi-monthly, ending February)
- C (monthly)
- D (bi-annually, ending February)
- D (bi-annually, ending June)
- E (annually, ending February)
- F (quarterly, ending February)

### official_date_type
- Birthday
- Deceased
- Deregistered
- Divorced
- Incorporated
- Married
- Registered
- Signed
- Widowed

### year_end_month
- January
- February
- March
- April
- May
- June
- July
- August
- September
- October
- November
- December

### connected_person_relationship
- Accountant
- Administrator
- Auditor
- Board Member
- Bookkeeper
- Beneficiary
- Chairperson
- Child
- Contact Person
- Corporate Secretary
- Curator
- Customer
- Director
- Employee
- Employer
- Executor
- Heir
- Legal Representative
- Manager
- Member
- Originator
- Parent
- Partner
- Principal
- Representative Taxpayer
- Secretary
- Shareholder
- Sibling
- Spouse
- Supplier
- Treasurer
- Trustee

### marital_status
- Deceased
- Divorced
- Married (in Community of Property)
- Married (out of Community of Property)
- Single

### preferred_language
- English

### preferred_communication_method
- Email

### province (South Africa)
- Eastern Cape
- Free State
- Gauteng
- KwaZulu-Natal
- Limpopo
- Mpumalanga
- North West
- Northern Cape
- Western Cape

---

## UI/UX Rules
- **Colour scheme:** Baby blue primary (#a2cffe), with accents (#fdfea2, #fea2fd, #fed0a2, #e7a2fe, #a2fea2)
- **Copy-paste friendly:** All field values must be selectable and copyable in both view and edit modes
- **Surname display logic:** When `non_capitalization_surname` is set, display as lowercase prefix after given names (e.g., "Jan de Kock") but capitalize when standalone ("De Kock")
- **Future:** Cascading dropdowns for Country → Province → City → Suburb
