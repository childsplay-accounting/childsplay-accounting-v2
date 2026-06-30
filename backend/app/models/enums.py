"""All ENUM definitions for the Client Information Database."""

import enum


class EntityType(str, enum.Enum):
    CHURCH = "Church"
    CLOSE_CORPORATION = "Close Corporation"
    CLUB = "Club"
    COOPERATIVE = "Co-operative"
    COMPANY_PRIVATE = "Company: Private"
    COMPANY_PUBLIC = "Company: Public"
    ESTATE_DECEASED = "Estate: Deceased"
    ESTATE_INSOLVENT = "Estate: Insolvent"
    INDIVIDUAL_DECEASED_ESTATE_ONLY = "Individual: Deceased Estate Only"
    INDIVIDUAL_DEFINED_FARMER = "Individual: Defined Farmer"
    INDIVIDUAL_TAX_CALCULATION_ONLY = "Individual: Tax Calculation Only"
    INDIVIDUAL_WITH_BALANCE_SHEET = "Individual: With Balance Sheet"
    PARTNERSHIP = "Partnership"
    PROPERTY_ASSOCIATION = "Property Association"
    SCHOOL = "School"
    TRUST_INTER_VIVOS = "Trust: Inter Vivos"
    TRUST_TESTAMENTARY = "Trust: Testamentary"
    WELFARE_ORGANISATION = "Welfare Organisation"


class ClientFileType(str, enum.Enum):
    NEW = "New"
    ACTIVE = "Active"
    THIRD_PARTY = "Third Party"
    ARCHIVED = "Archived"


class ClientIdType(str, enum.Enum):
    IDENTIFICATION_DOCUMENT = "Identification Document"
    PASSPORT = "Passport"
    REGISTRATION_NUMBER = "Registration Number"


class NameType(str, enum.Enum):
    NICKNAME = "Nickname"
    SURNAME = "Surname"
    FULL_NAMES = "Full Names"
    REGISTERED_NAME = "Registered Name"
    TRADING_NAME = "Trading Name"
    DEFENSIVE_NAME = "Defensive Name"


class IndividualTitle(str, enum.Enum):
    DR = "Dr"
    HON = "Hon"
    MR = "Mr"
    MRS = "Mrs"
    MS = "Ms"
    PROF = "Prof"
    REV = "Rev"
    ST = "St"


class AddressType(str, enum.Enum):
    BUSINESS_ADDRESS = "Business Address"
    REGISTERED_ADDRESS = "Registered Address"
    RESIDENTIAL_ADDRESS = "Residential Address"


class PhoneType(str, enum.Enum):
    BUSINESS_PHONE = "Business Phone"
    HOME_PHONE = "Home Phone"
    MOBILE_PHONE = "Mobile Phone"


class TaxType(str, enum.Enum):
    DIESEL_REBATE = "Diesel Rebate (DR)"
    DIVIDEND_WITHHOLDING_TAX = "Dividend Withholding Tax (DWT)"
    DONATIONS_TAX = "Donations Tax (DT)"
    EMPLOYEES_TAX = "Employees Tax (EMP)"
    EMPLOYMENT_EQUITY = "Employment Equity (EE)"
    EMPLOYMENT_TAX_INCENTIVE = "Employment Tax Incentive (ETI)"
    ESTATE_DUTY = "Estate Duty (ED)"
    INCOME_TAX = "Income Tax (IT)"
    PUBLIC_BENEFIT_ORGANISATION = "Public Benefit Organisation (PBO)"
    SECURITIES_TRANSFER_TAX = "Securities Transfer Tax (STT)"
    SKILLS_DEVELOPMENT_LEVIES = "Skills Development Levies (SDL)"
    TRANSFER_DUTY = "Transfer Duty (TD)"
    TURNOVER_TAX = "Turnover Tax (TT)"
    UIF = "Unemployment Insurance Fund Contributions (UIF)"
    VAT = "Value Added Tax (VAT)"
    WORKMENS_COMPENSATION = "Workmen's Compensation Fund Contributions (WCF)"


class TaxStatus(str, enum.Enum):
    ACTIVE = "Active"
    DORMANT = "Dormant"
    PROVISIONAL = "Provisional"
    SUSPENDED = "Suspended"


class VatPeriod(str, enum.Enum):
    A = "A (bi-monthly, ending January)"
    B = "B (bi-monthly, ending February)"
    C = "C (monthly)"
    D_FEB = "D (bi-annually, ending February)"
    D_JUN = "D (bi-annually, ending June)"
    E = "E (annually, ending February)"
    F = "F (quarterly, ending February)"


class OfficialDateType(str, enum.Enum):
    BIRTHDAY = "Birthday"
    DECEASED = "Deceased"
    DEREGISTERED = "Deregistered"
    DIVORCED = "Divorced"
    INCORPORATED = "Incorporated"
    MARRIED = "Married"
    REGISTERED = "Registered"
    SIGNED = "Signed"
    WIDOWED = "Widowed"


class YearEndMonth(str, enum.Enum):
    JANUARY = "January"
    FEBRUARY = "February"
    MARCH = "March"
    APRIL = "April"
    MAY = "May"
    JUNE = "June"
    JULY = "July"
    AUGUST = "August"
    SEPTEMBER = "September"
    OCTOBER = "October"
    NOVEMBER = "November"
    DECEMBER = "December"


class ConnectedPersonRelationship(str, enum.Enum):
    ACCOUNTANT = "Accountant"
    ADMINISTRATOR = "Administrator"
    AUDITOR = "Auditor"
    BOARD_MEMBER = "Board Member"
    BOOKKEEPER = "Bookkeeper"
    BENEFICIARY = "Beneficiary"
    CHAIRPERSON = "Chairperson"
    CHILD = "Child"
    CONTACT_PERSON = "Contact Person"
    CORPORATE_SECRETARY = "Corporate Secretary"
    CURATOR = "Curator"
    CUSTOMER = "Customer"
    DIRECTOR = "Director"
    EMPLOYEE = "Employee"
    EMPLOYER = "Employer"
    EXECUTOR = "Executor"
    HEIR = "Heir"
    LEGAL_REPRESENTATIVE = "Legal Representative"
    MANAGER = "Manager"
    MEMBER = "Member"
    ORIGINATOR = "Originator"
    PARENT = "Parent"
    PARTNER = "Partner"
    PRINCIPAL = "Principal"
    REPRESENTATIVE_TAXPAYER = "Representative Taxpayer"
    SECRETARY = "Secretary"
    SHAREHOLDER = "Shareholder"
    SIBLING = "Sibling"
    SPOUSE = "Spouse"
    SUPPLIER = "Supplier"
    TREASURER = "Treasurer"
    TRUSTEE = "Trustee"


class MaritalStatus(str, enum.Enum):
    DECEASED = "Deceased"
    DIVORCED = "Divorced"
    MARRIED_IN_COP = "Married (in Community of Property)"
    MARRIED_OUT_COP = "Married (out of Community of Property)"
    SINGLE = "Single"


class PreferredLanguage(str, enum.Enum):
    ENGLISH = "English"


class PreferredCommunicationMethod(str, enum.Enum):
    EMAIL = "Email"


class Province(str, enum.Enum):
    EASTERN_CAPE = "Eastern Cape"
    FREE_STATE = "Free State"
    GAUTENG = "Gauteng"
    KWAZULU_NATAL = "KwaZulu-Natal"
    LIMPOPO = "Limpopo"
    MPUMALANGA = "Mpumalanga"
    NORTH_WEST = "North West"
    NORTHERN_CAPE = "Northern Cape"
    WESTERN_CAPE = "Western Cape"
