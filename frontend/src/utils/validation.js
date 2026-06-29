/**
 * Client form validation utilities.
 *
 * Validations are "soft" / delayed — they don't block input but show
 * warnings on each page's status bar. Errors appear in red; informational
 * warnings in subtle amber.
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
  const year = idNumber.substring(0, 2);
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
 * Validate a SARS tax reference number (10 digits, Luhn check on last digit).
 * @param {string} taxNumber
 * @param {string} taxType - The type of tax (to check first digit)
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateSATaxNumber(taxNumber, taxType) {
  const errors = [];

  if (!taxNumber) return { valid: true, errors }; // Empty is OK

  // Must be exactly 10 digits
  if (!/^\d{10}$/.test(taxNumber)) {
    errors.push("SARS tax reference number must be exactly 10 digits.");
    return { valid: false, errors };
  }

  // Check first digit matches tax type
  const firstDigit = taxNumber[0];
  const expectedFirstDigits = {
    "Income Tax (IT)": "0",
    "Value Added Tax (VAT)": "4",
    "Employees Tax (EMP)": "7",
  };

  if (expectedFirstDigits[taxType] && firstDigit !== expectedFirstDigits[taxType]) {
    errors.push(
      `Tax reference for ${taxType} should start with "${expectedFirstDigits[taxType]}" but starts with "${firstDigit}".`
    );
  }

  // Luhn check digit (last digit)
  if (!luhnCheck(taxNumber)) {
    errors.push("Tax reference number failed the check digit validation (Luhn algorithm).");
  }

  return { valid: errors.length === 0, errors };
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
 * Generate all page-level warnings and errors for the form.
 *
 * Returns an object keyed by page index (0-5) with arrays of
 * { type: "error" | "warning", message: string }
 *
 * @param {Object} formData - The full form data
 * @returns {Object} - { 0: [...], 1: [...], ... }
 */
export function getPageWarnings(formData) {
  const warnings = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] };

  // --- File Type warnings (all pages) ---
  const fileType = formData.client_file_type || "";
  if (fileType === "New") {
    warnings[0].push({
      type: "info",
      message: 'Client File Type is "New" — this file is a draft and not yet active.',
    });
  } else if (fileType === "Third Party") {
    warnings[0].push({
      type: "info",
      message: 'Client File Type is "Third Party" — this file serves as a reference contact only.',
    });
  } else if (fileType === "Archived") {
    warnings[0].push({
      type: "info",
      message: 'Client File Type is "Archived" — this file is disabled and hidden from normal views.',
    });
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
  if (formData.tax_registrations) {
    for (const tax of formData.tax_registrations) {
      if (tax.tax_number && tax.tax_type) {
        const { errors } = validateSATaxNumber(tax.tax_number, tax.tax_type);
        for (const err of errors) {
          warnings[3].push({ type: "error", message: err });
        }
      }
    }
  }

  return warnings;
}
