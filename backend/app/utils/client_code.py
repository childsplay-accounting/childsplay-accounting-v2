"""
Client Code auto-generation utility.

Rules:
- Format: 3 UPPERCASE alpha + 4 zero-padded numeric (e.g., OLI0001)
- Alpha derived from Client Name (the primary name_value)
- Excludes spaces and special characters from the name
- For individuals with non_capitalization_surname set: skip the prefix(es),
  use first 3 letters of the root surname
  (e.g., "de Kock" → KOC, "van der Merwe" → MER)
- Numeric is sequential within the same 3-letter prefix per firm
"""

import re

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.client import Client


def extract_alpha_prefix(
    name_value: str,
    non_capitalization_surname: str | None = None,
) -> str:
    """
    Extract the 3-letter alphabetic prefix for the client code.

    For individuals with a non-capitalization surname prefix:
      - Strip the prefix(es) from the name, then take first 3 alpha chars
      - e.g., name="de Kock", non_cap="de" → "KOC"
      - e.g., name="van der Merwe", non_cap="van der" → "MER"

    For all other entities / individuals without prefix:
      - Remove all non-alpha characters from the name
      - Take the first 3 letters, uppercase
      - e.g., "B & C Enterprises (Pty) Ltd" → "BCE"
      - e.g., "Olivier Broers" → "OLI"
    """
    if not name_value:
        return "XXX"  # Fallback — should not happen with validation

    working_name = name_value.strip()

    # If there's a non-capitalization surname marker, strip the prefix
    if non_capitalization_surname:
        prefix = non_capitalization_surname.strip()
        # The surname might be stored as the full name including prefix
        # or just the surname part. Handle both cases.
        if working_name.lower().startswith(prefix.lower()):
            # Strip the prefix and any following spaces
            working_name = working_name[len(prefix):].lstrip()

    # Remove all non-alphabetic characters
    alpha_only = re.sub(r"[^a-zA-Z]", "", working_name)

    if len(alpha_only) < 3:
        # Pad with 'X' if name is too short
        alpha_only = alpha_only.ljust(3, "X")

    return alpha_only[:3].upper()


def generate_client_code(
    db: Session,
    firm_id: str,
    name_value: str,
    non_capitalization_surname: str | None = None,
) -> str:
    """
    Generate a unique client code for the given firm.

    Format: ABC0001 (3 alpha + 4 numeric, zero-padded)
    The numeric portion is sequential within the same alpha prefix per firm.
    """
    prefix = extract_alpha_prefix(name_value, non_capitalization_surname)

    # Find the highest existing numeric suffix for this prefix in the firm
    # Client codes matching this prefix pattern: PREFIX followed by 4 digits
    pattern = f"{prefix}%"

    # Query for the max numeric suffix
    result = (
        db.query(func.max(Client.client_code))
        .filter(
            Client.firm_id == firm_id,
            Client.client_code.like(pattern),
        )
        .scalar()
    )

    if result:
        # Extract the numeric part (last 4 characters)
        try:
            existing_num = int(result[-4:])
            next_num = existing_num + 1
        except (ValueError, IndexError):
            next_num = 1
    else:
        next_num = 1

    # Format: PREFIX + 4-digit zero-padded number
    client_code = f"{prefix}{next_num:04d}"

    return client_code
