import { SelectField, TextField, CheckboxField } from "../FormField";
import { ENUMS } from "../../../constants/enums";

/**
 * Page 1: Segment Structural
 *
 * Contains the two GATING FIELDS (Language + Entity Type) at the top.
 * All other fields are disabled until both gating fields are selected.
 *
 * Fields:
 * - Preferred Communication - Language (GATING)
 * - Entity Type (GATING)
 * - Client Code (auto-generated, read-only)
 * - Client Group Code
 * - Firm Code
 * - Client File Type
 * - Preferred Communication - Method
 * - Client Temporary Marker
 * - Segment Identification: Client ID Type, Client ID No
 */

function PageStructural({ formData, onChange, disabled, isGateComplete, isEditing }) {
  return (
    <div className="space-y-6">
      {/* Gating Fields Section */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-amber-800 mb-3">
          Required First — Select both to unlock all fields
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Preferred Communication - Language"
            name="preferred_language"
            value={formData.preferred_language}
            onChange={onChange}
            options={ENUMS.preferredLanguage}
            required
            disabled={false}
          />
          <SelectField
            label="Entity Type"
            name="entity_type"
            value={formData.entity_type}
            onChange={onChange}
            options={ENUMS.entityType}
            required
            disabled={false}
          />
        </div>
      </div>


      {/* Structural Fields */}
      <div>
        <h3 className="text-lg font-semibold text-baby-800 mb-3">
          Segment Structural
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Client Code"
            name="client_code"
            value={formData.client_code}
            onChange={onChange}
            readOnly={true}
            disabled={!isGateComplete}
            placeholder="Auto-generated on save"
          />
          <SelectField
            label="Client Group Code"
            name="client_group_id"
            value={formData.client_group_id}
            onChange={onChange}
            options={[]}
            disabled={!isGateComplete}
            placeholder="— Select Group —"
          />
          <SelectField
            label="Firm Code"
            name="firm_id"
            value={formData.firm_id}
            onChange={onChange}
            options={[]}
            disabled={!isGateComplete}
            placeholder="— Select Firm —"
          />
          <SelectField
            label="Client File Type"
            name="client_file_type"
            value={formData.client_file_type}
            onChange={onChange}
            options={ENUMS.clientFileType}
            disabled={!isGateComplete}
          />
          <SelectField
            label="Preferred Communication - Method"
            name="preferred_communication_method"
            value={formData.preferred_communication_method}
            onChange={onChange}
            options={ENUMS.preferredCommunicationMethod}
            disabled={!isGateComplete}
          />
          <CheckboxField
            label="Client Temporary Marker"
            name="temporary_marker"
            checked={formData.temporary_marker}
            onChange={onChange}
            disabled={!isGateComplete}
          />
        </div>
      </div>


      {/* Segment Identification */}
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
            disabled={!isGateComplete}
          />
          <TextField
            label="Client ID No"
            name="client_id_number"
            value={formData.client_id_number}
            onChange={onChange}
            disabled={!isGateComplete}
          />
        </div>
      </div>
    </div>
  );
}

export default PageStructural;
