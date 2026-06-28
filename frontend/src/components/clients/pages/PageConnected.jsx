import { SelectField } from "../FormField";
import DynamicFieldGroup from "../DynamicFieldGroup";
import { ENUMS } from "../../../constants/enums";

/**
 * Page 5: Segment Connected Persons
 *
 * Sections:
 * - Connected Persons (dynamic — add another)
 *   - Connected Person Relationship (dropdown)
 *   - Third Party Connected Person Code (filtered dropdown)
 */

const CONNECTED_PERSON_TEMPLATE = {
  relationship: "",
  connected_person_code: "",
};


function PageConnected({ formData, onArrayItemChange, onArrayAdd, onArrayRemove, disabled }) {
  return (
    <div className="space-y-6">
      <DynamicFieldGroup
        label="Connected Persons"
        items={formData.connected_persons}
        onAdd={() => onArrayAdd("connected_persons", CONNECTED_PERSON_TEMPLATE)}
        onRemove={(index) => onArrayRemove("connected_persons", index)}
        disabled={disabled}
        renderItem={(item, index, isDisabled) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SelectField
              label="Connected Person Relationship"
              name={`relationship_${index}`}
              value={item.relationship}
              onChange={(e) => onArrayItemChange("connected_persons", index, "relationship", e.target.value)}
              options={ENUMS.connectedPersonRelationship}
              disabled={isDisabled}
              required
            />
            <SelectField
              label="Third Party Connected Person Code"
              name={`connected_code_${index}`}
              value={item.connected_person_code}
              onChange={(e) => onArrayItemChange("connected_persons", index, "connected_person_code", e.target.value)}
              options={[]}
              disabled={isDisabled}
              placeholder="— Select Third Party —"
            />
          </div>
        )}
      />

      {/* Future pages note */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-500 italic">
          Pages 6 onwards will be added in future sessions as additional
          segments are specified.
        </p>
      </div>
    </div>
  );
}

export default PageConnected;
