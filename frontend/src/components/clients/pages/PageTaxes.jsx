import { TextField, SelectField } from "../FormField";
import DynamicFieldGroup from "../DynamicFieldGroup";
import { ENUMS } from "../../../constants/enums";

/**
 * Page 4: Segment Taxes & Income Sources
 *
 * Sections:
 * - Tax Registrations (dynamic — add another)
 *   - Tax Type, Tax No, Tax Status
 *   - VAT Registration, VAT Period (only visible when Tax Type = VAT)
 *   - eFiling Client Code
 * - Income Sources (first entry shown by default, "Add another" for more)
 *   - Associated Trading Name
 *   - Main Business Description
 *   - Occupation Description
 */


const TAX_TEMPLATE = {
  tax_type: "",
  tax_number: "",
  tax_status: "",
  vat_registration: "",
  vat_period: "",
  efiling_client_code: "",
};

const INCOME_SOURCE_TEMPLATE = {
  trading_name: "",
  business_description: "",
  occupation_description: "",
};


function PageTaxes({ formData, onArrayItemChange, onArrayAdd, onArrayRemove, disabled }) {
  return (
    <div className="space-y-6">
      {/* Tax Registrations */}
      <DynamicFieldGroup
        label="Tax Registrations"
        items={formData.tax_registrations}
        onAdd={() => onArrayAdd("tax_registrations", TAX_TEMPLATE)}
        onRemove={(index) => onArrayRemove("tax_registrations", index)}
        disabled={disabled}
        renderItem={(item, index, isDisabled) => {
          const isVAT = item.tax_type === "Value Added Tax (VAT)";
          return (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <SelectField
                  label="Tax Type"
                  name={`tax_type_${index}`}
                  value={item.tax_type}
                  onChange={(e) => onArrayItemChange("tax_registrations", index, "tax_type", e.target.value)}
                  options={ENUMS.taxType}
                  disabled={isDisabled}
                  required
                />
                <TextField
                  label="Tax No"
                  name={`tax_number_${index}`}
                  value={item.tax_number}
                  onChange={(e) => onArrayItemChange("tax_registrations", index, "tax_number", e.target.value)}
                  disabled={isDisabled}
                />
                <SelectField
                  label="Tax Status"
                  name={`tax_status_${index}`}
                  value={item.tax_status}
                  onChange={(e) => onArrayItemChange("tax_registrations", index, "tax_status", e.target.value)}
                  options={ENUMS.taxStatus}
                  disabled={isDisabled}
                />
              </div>


              {/* VAT-specific fields — only visible when Tax Type = VAT */}
              {isVAT && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                  <TextField
                    label="VAT Registration"
                    name={`vat_registration_${index}`}
                    value={item.vat_registration}
                    onChange={(e) => onArrayItemChange("tax_registrations", index, "vat_registration", e.target.value)}
                    disabled={isDisabled}
                  />
                  <SelectField
                    label="VAT Period"
                    name={`vat_period_${index}`}
                    value={item.vat_period}
                    onChange={(e) => onArrayItemChange("tax_registrations", index, "vat_period", e.target.value)}
                    options={ENUMS.vatPeriod}
                    disabled={isDisabled}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextField
                  label="eFiling Client Code"
                  name={`efiling_${index}`}
                  value={item.efiling_client_code}
                  onChange={(e) => onArrayItemChange("tax_registrations", index, "efiling_client_code", e.target.value)}
                  disabled={isDisabled}
                />
              </div>
            </div>
          );
        }}
      />


      {/* Income Sources */}
      <DynamicFieldGroup
        label="Income Sources"
        items={formData.income_sources}
        onAdd={() => onArrayAdd("income_sources", INCOME_SOURCE_TEMPLATE)}
        onRemove={(index) => onArrayRemove("income_sources", index)}
        disabled={disabled}
        renderItem={(item, index, isDisabled) => (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <TextField
              label="Associated Trading Name"
              name={`trading_name_${index}`}
              value={item.trading_name}
              onChange={(e) => onArrayItemChange("income_sources", index, "trading_name", e.target.value)}
              disabled={isDisabled}
              required
            />
            <TextField
              label="Main Business Description"
              name={`business_desc_${index}`}
              value={item.business_description}
              onChange={(e) => onArrayItemChange("income_sources", index, "business_description", e.target.value)}
              disabled={isDisabled}
            />
            <TextField
              label="Occupation Description"
              name={`occupation_desc_${index}`}
              value={item.occupation_description}
              onChange={(e) => onArrayItemChange("income_sources", index, "occupation_description", e.target.value)}
              disabled={isDisabled}
            />
          </div>
        )}
      />
    </div>
  );
}

export default PageTaxes;
