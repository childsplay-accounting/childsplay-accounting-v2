/**
 * ENUM values matching the backend definitions.
 * Single source of truth for all dropdown options in the UI.
 */
export const ENUMS = {
  entityType: [
    "Church",
    "Close Corporation",
    "Club",
    "Co-operative",
    "Company: Private",
    "Company: Public",
    "Estate: Deceased",
    "Estate: Insolvent",
    "Individual: Deceased Estate Only",
    "Individual: Defined Farmer",
    "Individual: Tax Calculation Only",
    "Individual: With Balance Sheet",
    "Partnership",
    "Property Association",
    "School",
    "Trust: Inter Vivos",
    "Trust: Testamentary",
    "Welfare Organisation",
  ],

  clientFileType: ["New", "Active", "Third Party", "Archived"],

  clientIdType: [
    "Identification Document",
    "Passport",
    "Registration Number",
  ],

  nameType: [
    "Nickname",
    "Surname",
    "Full Names",
    "Registered Name",
    "Trading Name",
    "Defensive Name",
  ],

  individualTitle: ["Dr", "Hon", "Mr", "Mrs", "Ms", "Prof", "Rev", "St"],


  addressType: ["Business Address", "Home Address", "Registered Address"],

  phoneType: ["Business Phone", "Home Phone", "Mobile Phone"],

  taxType: [
    "Diesel Rebate (DR)",
    "Dividend Withholding Tax (DWT)",
    "Donations Tax (DT)",
    "Employees Tax (EMP)",
    "Employment Equity (EE)",
    "Employment Tax Incentive (ETI)",
    "Estate Duty (ED)",
    "Income Tax (IT)",
    "Public Benefit Organisation (PBO)",
    "Securities Transfer Tax (STT)",
    "Skills Development Levies (SDL)",
    "Transfer Duty (TD)",
    "Turnover Tax",
    "Unemployment Insurance Fund Contributions (UIF)",
    "Value Added Tax (VAT)",
    "Workmen's Compensation Fund Contributions (WCF)",
  ],

  taxStatus: ["Active", "Dormant", "Provisional", "Suspended"],

  vatPeriod: [
    "A (bi-monthly, ending January)",
    "B (bi-monthly, ending February)",
    "C (monthly)",
    "D (bi-annually, ending February)",
    "D (bi-annually, ending June)",
    "E (annually, ending February)",
    "F (quarterly, ending February)",
  ],

  officialDateType: [
    "Birthday",
    "Deceased",
    "Deregistered",
    "Divorced",
    "Incorporated",
    "Married",
    "Registered",
    "Signed",
    "Widowed",
  ],

  yearEndMonth: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],


  connectedPersonRelationship: [
    "Accountant", "Administrator", "Auditor", "Board Member", "Bookkeeper",
    "Beneficiary", "Chairperson", "Child", "Contact Person",
    "Corporate Secretary", "Curator", "Customer", "Director", "Employee",
    "Employer", "Executor", "Heir", "Legal Representative", "Manager",
    "Member", "Originator", "Parent", "Partner", "Principal",
    "Representative Taxpayer", "Secretary", "Shareholder", "Sibling",
    "Spouse", "Supplier", "Treasurer", "Trustee",
  ],

  maritalStatus: [
    "Deceased",
    "Divorced",
    "Married (in Community of Property)",
    "Married (out of Community of Property)",
    "Single",
  ],

  preferredLanguage: ["English"],

  preferredCommunicationMethod: ["Email"],

  province: [
    "Eastern Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "North West",
    "Northern Cape",
    "Western Cape",
  ],
};
