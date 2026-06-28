import { SelectField, DateField } from "../FormField";
import DynamicFieldGroup from "../DynamicFieldGroup";
import { ENUMS } from "../../../constants/enums";

/**
 * Page 4: Segment Marital Status & Dates
 *
 * Sections:
 * - Marital Status
 *   - Marital Status dropdown
 *   - Third Party Spouse Code (filtered dropdown)
 * - Segment Dates (dynamic — add another)
 *   - Official Date Type
 *   - Official Date
 *   - Year-end (month dropdown, nullable)
 */


const DATE_TEMPLATE = {
  date_type: "",
  date_value: "",
  year_end_month: "",
};

function PageMarital({ formData, onChange, onArrayItemChange, onArrayAdd, onArrayRemove, disabled }) {
  return (
    <div className="space-y-6">
      {/* Marital Status Section */}
      <div>
        <h3 className="text-lg font-semibold text-baby-800 mb-3">
          Segment Marital Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Marital Status"
            name="marital_status"
            value={formData.marital_status}
            onChange={onChange}
            options={ENUMS.maritalStatus}
            disabled={disabled}
          />
          <SelectField
            label="Third Party Spouse Code"
            name="spouse_contact_code"
            value={formData.spouse_contact_code}
            onChange={onChange}
            options={[]}
            disabled={disabled}
            placeholder="— Select Spouse (Third Party) —"
          />
        </div>
      </div>


      {/* Segment Dates */}
      <DynamicFieldGroup
        label="Segment Dates"
        items={formData.dates}
        onAdd={() => onArrayAdd("dates", DATE_TEMPLATE)}
        onRemove={(index) => onArrayRemove("dates", index)}
        disabled={disabled}
        renderItem={(item, index, isDisabled) => (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SelectField
              label="Official Date Type"
              name={`date_type_${index}`}
              value={item.date_type}
              onChange={(e) => onArrayItemChange("dates", index, "date_type", e.target.value)}
              options={ENUMS.officialDateType}
              disabled={isDisabled}
              required
            />
            <DateField
              label="Official Date"
              name={`date_value_${index}`}
              value={item.date_value}
              onChange={(e) => onArrayItemChange("dates", index, "date_value", e.target.value)}
              disabled={isDisabled}
            />
            <SelectField
              label="Year-end"
              name={`year_end_${index}`}
              value={item.year_end_month}
              onChange={(e) => onArrayItemChange("dates", index, "year_end_month", e.target.value)}
              options={ENUMS.yearEndMonth}
              disabled={isDisabled}
              placeholder="— None —"
            />
          </div>
        )}
      />
    </div>
  );
}

export default PageMarital;
