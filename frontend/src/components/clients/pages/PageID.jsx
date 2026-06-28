import { TextField, SelectField, CheckboxField } from "../FormField";
import { ENUMS } from "../../../constants/enums";

/**
 * Page 2: Segment ID
 *
 * Contains:
 * - Client ID Type and Client ID No (moved from Page 1)
 * - Client Name, Name Type
 * - Individual Title (only editable when Entity Type starts with "Individual")
 * - Non-Capitalization Surname (BOOLEAN Yes/No, only editable when Entity Type
 *   starts with "Individual" AND Name Type is "Surname")
 */

function PageID({ formData, onChange, onArrayItemChange, disabled }) {
  const entityType = formData.entity_type || "";
  const isIndividual = entityType.startsWith("Individual");
  const nameType = formData.names[0]?.name_type || "";
  const isSurname = nameType === "Surname";

  return (
    <div className="space-y-6">
      {/* Client Identification */}
      <div>
        <h3 className="text-lg font-semibold text-baby-800 mb-3">
          Segment Identification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Client ID Type"
            name="client_id_type"
            value={formData.client_id_type}
            onChange={onChange}
            options={ENUMS.clientIdType}
            disabled={disabled}
          />
          <TextField
            label="Client ID No"
            name="client_id_number"
            value={formData.client_id_number}
            onChange={onChange}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Client Name */}
      <div>
        <h3 className="text-lg font-semibold text-baby-800 mb-3">
          Client Name
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Client Name"
            name="name_value"
            value={formData.names[0]?.name_value || ""}
            onChange={(e) => onArrayItemChange("names", 0, "name_value", e.target.value)}
            disabled={disabled}
            required
          />
          <SelectField
            label="Name Type"
            name="name_type"
            value={formData.names[0]?.name_type || ""}
            onChange={(e) => onArrayItemChange("names", 0, "name_type", e.target.value)}
            options={ENUMS.nameType}
            disabled={disabled}
          />
          <SelectField
            label="Individual Title"
            name="individual_title"
            value={formData.names[0]?.individual_title || ""}
            onChange={(e) => onArrayItemChange("names", 0, "individual_title", e.target.value)}
            options={ENUMS.individualTitle}
            disabled={disabled || !isIndividual}
            placeholder="— None —"
          />
          <CheckboxField
            label="Non-Capitalization Surname"
            name="non_capitalization_surname"
            checked={formData.names[0]?.non_capitalization_surname || false}
            onChange={(e) => onArrayItemChange("names", 0, "non_capitalization_surname", e.target.checked)}
            disabled={disabled || !isIndividual || !isSurname}
          />
        </div>
        {!isIndividual && (
          <p className="text-xs text-gray-400 mt-2 italic">
            Individual Title and Non-Capitalization Surname are only applicable to Individual entity types.
          </p>
        )}
        {isIndividual && !isSurname && (
          <p className="text-xs text-gray-400 mt-2 italic">
            Non-Capitalization Surname is only applicable when Name Type is &ldquo;Surname&rdquo;.
          </p>
        )}
      </div>
    </div>
  );
}

export default PageID;
