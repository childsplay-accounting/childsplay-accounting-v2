/**
 * Combined/computed field utilities.
 *
 * These fields are calculated from existing data — they do not take up storage space.
 * They are displayed in the UI for user convenience and used in reports/exports.
 */

/**
 * Calculate the Combined Name of a client.
 *
 * For Individuals:
 *   [Individual Title] [Initials (from Full Names, no spaces)] [Surname]
 *   - If Non-Capitalization Surname is TRUE, the surname prefix(es) appear in lowercase
 *     (e.g., "Mr JC de Kock", "Prof AB van der Merwe")
 *   - Initials are derived by taking the first letter of each word in "Full Names"
 *
 * For all other entity types:
 *   The "Registered Name" is also the Combined Name.
 *
 * @param {Object} params
 * @param {string} params.entityType - The entity type
 * @param {Array} params.names - Array of name records ({ name_type, name_value, individual_title, non_capitalization_surname })
 * @returns {string} - The combined name, or empty string if insufficient data
 */
export function getCombinedName({ entityType, names }) {
  if (!entityType || !names || names.length === 0) return "";

  const isIndividual = entityType.startsWith("Individual");

  if (!isIndividual) {
    // Non-individual: Combined Name = Registered Name
    const registeredName = names.find((n) => n.name_type === "Registered Name");
    return registeredName?.name_value || "";
  }

  // Individual: Title + Initials + Surname
  const primaryName = names[0] || {};
  const title = primaryName.individual_title || "";

  // Find the Full Names entry (for initials)
  const fullNamesEntry = names.find((n) => n.name_type === "Full Names");
  const fullNames = fullNamesEntry?.name_value || "";

  // Find the Surname entry
  const surnameEntry = names.find((n) => n.name_type === "Surname");
  const surname = surnameEntry?.name_value || primaryName.name_value || "";
  const hasNonCapPrefix = surnameEntry?.non_capitalization_surname || primaryName.non_capitalization_surname || false;

  // Calculate initials from Full Names (first letter of each word, uppercase, no spaces)
  const initials = fullNames
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map((word) => word[0].toUpperCase())
    .join("");

  // Format surname based on Non-Capitalization Surname flag
  let displaySurname = surname;
  if (!hasNonCapPrefix && surname) {
    // Normal capitalization — use as-is (should already be capitalized)
    displaySurname = surname;
  }
  // If hasNonCapPrefix is true, the surname is stored with the prefix in lowercase
  // (e.g., "de Kock", "van der Merwe") — display as-is

  // Build combined name
  const parts = [];
  if (title) parts.push(title);
  if (initials) parts.push(initials);
  if (displaySurname) parts.push(displaySurname);

  return parts.join(" ");
}

/**
 * Calculate the Combined Income Tax (IT) No.
 *
 * Format: XXXX/XXX/XX/X (4 digits / 3 digits / 2 digits / 1 digit)
 * Followed by "P" if Tax Status = "Provisional"
 *
 * Example: 0123/456/78/9 or 0123/456/78/9P (provisional)
 *
 * @param {Object} params
 * @param {string} params.taxNumber - The 10-digit tax reference number
 * @param {string} params.taxStatus - The tax status (e.g., "Provisional")
 * @returns {string} - The formatted tax number, or empty string if invalid
 */
export function getCombinedIncomeTaxNo({ taxNumber, taxStatus }) {
  if (!taxNumber || !/^\d{10}$/.test(taxNumber)) return "";

  const formatted =
    taxNumber.substring(0, 4) +
    "/" +
    taxNumber.substring(4, 7) +
    "/" +
    taxNumber.substring(7, 9) +
    "/" +
    taxNumber.substring(9, 10);

  const provisional = taxStatus === "Provisional" ? "P" : "";

  return formatted + provisional;
}

/**
 * Calculate the formatted Identification Document No.
 *
 * Format: XXXXXX XXXX XX X (6 digits, space, 4 digits, space, 2 digits, space, 1 digit)
 *
 * Example: 850101 5001 08 3
 *
 * @param {Object} params
 * @param {string} params.idNumber - The 13-digit SA ID number
 * @returns {string} - The formatted ID number, or empty string if invalid
 */
export function getFormattedIdNumber({ idNumber }) {
  if (!idNumber || !/^\d{13}$/.test(idNumber)) return "";

  return (
    idNumber.substring(0, 6) +
    " " +
    idNumber.substring(6, 10) +
    " " +
    idNumber.substring(10, 12) +
    " " +
    idNumber.substring(12, 13)
  );
}
