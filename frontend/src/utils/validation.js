/**
 * Client form validation utilities.
 *
 * Validations are "soft" / delayed — they don't block input but show
 * warnings on each page's status bar. Errors appear in red; informational
 * warnings in subtle amber; active status in green.
 */

/**
 * Luhn algorithm check (used for SA ID numbers and SARS tax reference numbers).
 * @param {string} number - Numeric string to validate
 * @returns {boolean} - True if the check digit is valid
 */
export function luhnCheck(number) {
  if (!number || !/^\d+$/.test(number)) return false;

  let sum = 0;
  let alternate = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i], 10);

    if (alternate) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}

/**
 * Validate a South African ID number (13 digits, Luhn check on last digit).
 * @param {string} idNumber
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateSAIdNumber(idNumber) {
  const errors = [];

  if (!idNumber) return { valid: true, errors }; // Empty is OK (not required yet)

  // Must be exactly 13 digits
  if (!/^\d{13}$/.test(idNumber)) {
    errors.push("SA ID number must be exactly 13 digits.");
    return { valid: false, errors };
  }

  // Check date of birth (first 6 digits = YYMMDD)
  const month = parseInt(idNumber.substring(2, 4), 10);
  const day = parseInt(idNumber.substring(4, 6), 10);

  if (month < 1 || month > 12) {
    errors.push("SA ID number has an invalid month (digits 3-4).");
  }
  if (day < 1 || day > 31) {
    errors.push("SA ID number has an invalid day (digits 5-6).");
  }

  // Citizenship digit (position 11): must be 0 or 1
  const citizenship = parseInt(idNumber[10], 10);
  if (citizenship !== 0 && citizenship !== 1) {
    errors.push("SA ID number has an invalid citizenship digit (position 11).");
  }

  // Luhn check digit (last digit)
  if (!luhnCheck(idNumber)) {
    errors.push("SA ID number failed the check digit validation (Luhn algorithm).");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a SARS tax reference number.
 *
 * Format rules:
 * - Most tax numbers are 10 digits with Luhn check on last digit
 * - SDL numbers: "L" + 9 digits (same as EMP but first char is "L" instead of "7")
 * - UIF calculated number: "U" + 9 digits (derived from EMP, not user-entered)
 *
 * First digit indicates tax type for numeric-only numbers:
 * - 0 = Income Tax — Individuals and Estates
 * - 9 = Income Tax — Companies/Corporates/Trusts/Partnerships/all other entities
 * - 4 = Value Added Tax (VAT) — all entity types
 * - 7 = Employees Tax (EMP/PAYE) — all entity types
 *
 * Cross-reference rules (same number as counterpart):
 * - Diesel Rebate (DR) = same as VAT number (starts with "4")
 * - Dividend Withholding Tax (DWT) = same as corporate Income Tax (starts with "9")
 * - Donations Tax (DT) = same as Income Tax (IT) (starts with "0" or "9" per entity)
 * - Employment Tax Incentive (ETI) = same as Employees Tax (starts with "7")
 * - Estate Duty (ED) = same as individual Income Tax (starts with "0")
 * - Securities Transfer Tax (STT) = same as corporate Income Tax (starts with "9")
 * - Turnover Tax (TT) = same as Income Tax (IT) (starts with "0" or "9" per entity)
 * - Skills Development Levies (SDL) = same as EMP but starts with "L" instead of "7"
 *
 * @param {string} taxNumber - The tax reference number
 * @param {string} taxType - The type of tax
 * @param {string} entityType - The entity type of the client
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateSATaxNumber(taxNumber, taxType, entityType) {
  const errors = [];

  if (!taxNumber) return { valid: true, errors }; // Empty is OK

  const isIndividualOrEstate =
    (entityType || "").startsWith("Individual") ||
    (entityType || "").startsWith("Estate");

  // SDL has special format: "L" + 9 digits
  if (taxType === "Skills Development Levies (SDL)") {
    if (!/^L\d{9}$/.test(taxNumber)) {
      errors.push('SDL reference number must be "L" followed by 9 digits (e.g., L123456789).');
      return { valid: false, errors };
    }
    // Luhn check on the 9 numeric digits + the check digit concept
    const numericPart = taxNumber.substring(1);
    if (!luhnCheck(numericPart)) {
      errors.push("SDL reference number failed the check digit validation (Luhn algorithm on digits after L).");
    }
    return { valid: errors.length === 0, errors };
  }

  // All other tax numbers: must be exactly 10 digits
  if (!/^\d{10}$/.test(taxNumber)) {
    errors.push("SARS tax reference number must be exactly 10 digits.");
    return { valid: false, errors };
  }

  const firstDigit = taxNumber[0];

  // Determine expected first digit based on tax type
  switch (taxType) {
    case "Income Tax (IT)":
    case "Donations Tax (DT)":
    case "Turnover Tax (TT)":
      // These follow Income Tax rules: 0 for individuals/estates, 9 for corporates
      if (isIndividualOrEstate && firstDigit !== "0") {
        errors.push(
          `${taxType} reference for individuals/estates should start with "0" but starts with "${firstDigit}".`
        );
      } else if (!isIndividualOrEstate && firstDigit !== "9") {
        errors.push(
          `${taxType} reference for corporate/non-individual entities should start with "9" but starts with "${firstDigit}".`
        );
      }
      break;

    case "Estate Duty (ED)":
      // Always individual Income Tax format (starts with "0")
      if (firstDigit !== "0") {
        errors.push(
          `Estate Duty reference should start with "0" (individual Income Tax format) but starts with "${firstDigit}".`
        );
      }
      break;

    case "Dividend Withholding Tax (DWT)":
    case "Securities Transfer Tax (STT)":
      // Always corporate Income Tax format (starts with "9")
      if (firstDigit !== "9") {
        errors.push(
          `${taxType} reference should start with "9" (corporate Income Tax format) but starts with "${firstDigit}".`
        );
      }
      break;

    case "Value Added Tax (VAT)":
    case "Diesel Rebate (DR)":
      // VAT format (starts with "4")
      if (firstDigit !== "4") {
        errors.push(
          `${taxType} reference number should start with "4" but starts with "${firstDigit}".`
        );
      }
      break;

    case "Employees Tax (EMP)":
    case "Employment Tax Incentive (ETI)":
      // EMP/PAYE format (starts with "7")
      if (firstDigit !== "7") {
        errors.push(
          `${taxType} reference number should start with "7" but starts with "${firstDigit}".`
        );
      }
      break;

    case "Unemployment Insurance Fund Contributions (UIF)":
      // UIF uses same format as EMP (starts with "7")
      if (firstDigit !== "7") {
        errors.push(
          `UIF reference number should start with "7" (same as Employees Tax) but starts with "${firstDigit}".`
        );
      }
      break;

    // Other tax types not yet validated for first digit:
    // Employment Equity (EE), Public Benefit Organisation (PBO),
    // Transfer Duty (TD), Workmen's Compensation Fund (WCF)
    default:
      break;
  }

  // Luhn check digit (last digit) — applies to all 10-digit tax numbers
  if (!luhnCheck(taxNumber)) {
    errors.push("Tax reference number failed the check digit validation (Luhn algorithm).");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Calculate the UIF derived number from an Employees Tax (EMP) number.
 * UIF calculated = EMP number with first digit "7" replaced by "U".
 *
 * This is NOT user-entered — it is auto-calculated when either UIF or EMP is filled.
 *
 * @param {string} empNumber - The 10-digit EMP reference number (starts with "7")
 * @returns {string|null} - The calculated UIF number (e.g., "U234567890") or null
 */
export function calculateUIFDerivedNumber(empNumber) {
  if (!empNumber || !/^7\d{9}$/.test(empNumber)) return null;
  return "U" + empNumber.substring(1);
}

/**
 * Validate Client ID Type against Entity Type and address data.
 *
 * Rules:
 * 1. Only Individuals may use "Identification Document" or "Passport"
 * 2. "Passport" is only valid if the individual resides outside South Africa
 *    (Residential Address with Country ≠ "South Africa")
 *
 * This is a SOFT/DELAYED validation — it checks cross-field dependencies
 * that may not be filled at the same time.
 *
 * @param {Object} formData - The full form data
 * @returns {string[]} - Array of error messages (empty if valid)
 */
export function validateClientIdType(formData) {
  const errors = [];
  const entityType = formData.entity_type || "";
  const idType = formData.client_id_type || "";
  const isIndividual = entityType.startsWith("Individual");

  if (!idType) return errors; // Not yet selected

  // Rule 1: Only Individuals may use ID Document or Passport
  if (!isIndividual && (idType === "Identification Document" || idType === "Passport")) {
    errors.push(
      `"${idType}" is only valid for Individual entity types. Non-individual entities must use "Registration Number".`
    );
  }

  // Rule 2: Passport only valid if individual lives outside SA
  if (isIndividual && idType === "Passport") {
    const residentialAddress = (formData.addresses || []).find(
      (addr) => addr.address_type === "Residential Address"
    );

    if (residentialAddress && residentialAddress.country) {
      const country = residentialAddress.country.trim().toLowerCase();
      if (country === "south africa") {
        errors.push(
          '"Passport" is only valid for individuals residing outside South Africa. ' +
          'The Residential Address shows "South Africa" as the country. Use "Identification Document" instead.'
        );
      }
    }
    // If no residential address yet, don't show error (delayed validation)
  }

  return errors;
}

/**
 * Get the file type status warning/success message.
 * @param {string} fileType
 * @returns {{ type: string, message: string } | null}
 */
function getFileTypeWarning(fileType) {
  switch (fileType) {
    case "New":
      return {
        type: "info",
        message: 'Client File Type is "New" — this file is a draft and not yet active.',
      };
    case "Third Party":
      return {
        type: "info",
        message: 'Client File Type is "Third Party" — this file serves as a reference contact only.',
      };
    case "Archived":
      return {
        type: "info",
        message: 'Client File Type is "Archived" — this file is disabled and hidden from normal views.',
      };
    case "Active":
      return {
        type: "success",
        message: 'Client File Type is "Active" — this client file is live and operational.',
      };
    default:
      return null;
  }
}

/**
 * Generate all page-level warnings and errors for the form.
 *
 * Returns an object keyed by page index (0-5) with arrays of
 * { type: "error" | "info" | "success", message: string }
 *
 * Types:
 * - "error": Red ink — validation errors that must be resolved
 * - "info": Subtle amber — informational (New, Third Party, Archived file types)
 * - "success": Green — active file type with no errors
 *
 * @param {Object} formData - The full form data
 * @returns {Object} - { 0: [...], 1: [...], ... }
 */
export function getPageWarnings(formData) {
  const warnings = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] };

  // --- File Type status (shown on ALL pages) ---
  const fileType = formData.client_file_type || "";
  const fileTypeWarning = getFileTypeWarning(fileType);
  if (fileTypeWarning) {
    for (let i = 0; i <= 5; i++) {
      warnings[i].push(fileTypeWarning);
    }
  }

  // --- Page 2: Client ID Type validation ---
  const idTypeErrors = validateClientIdType(formData);
  for (const err of idTypeErrors) {
    warnings[1].push({ type: "error", message: err });
  }

  // --- Page 2: SA ID number validation ---
  if (
    formData.client_id_type === "Identification Document" &&
    formData.client_id_number
  ) {
    const { errors } = validateSAIdNumber(formData.client_id_number);
    for (const err of errors) {
      warnings[1].push({ type: "error", message: err });
    }
  }

  // --- Page 4: Tax number validation ---
  const entityType = formData.entity_type || "";
  if (formData.tax_registrations) {
    for (const tax of formData.tax_registrations) {
      if (tax.tax_number && tax.tax_type) {
        const { errors } = validateSATaxNumber(tax.tax_number, tax.tax_type, entityType);
        for (const err of errors) {
          warnings[3].push({ type: "error", message: err });
        }
      }
    }

    // --- UIF calculated number: if EMP or UIF is filled, validate the derived UIF number ---
    const empRegistration = formData.tax_registrations.find(
      (t) => t.tax_type === "Employees Tax (EMP)" && t.tax_number
    );
    const uifRegistration = formData.tax_registrations.find(
      (t) => t.tax_type === "Unemployment Insurance Fund Contributions (UIF)" && t.tax_number
    );

    if (empRegistration || uifRegistration) {
      const sourceNumber = empRegistration?.tax_number || uifRegistration?.tax_number;
      const derivedUIF = calculateUIFDerivedNumber(sourceNumber);
      if (derivedUIF) {
        warnings[3].push({
          type: "info",
          message: `Calculated UIF number (derived from EMP): ${derivedUIF}`,
        });
      }
    }
  }

  return warnings;
}
