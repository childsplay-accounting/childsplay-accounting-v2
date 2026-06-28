import { TextField, SelectField } from "../FormField";
import DynamicFieldGroup from "../DynamicFieldGroup";
import { ENUMS } from "../../../constants/enums";

/**
 * Page 3: Segment Contact Details
 *
 * Sections:
 * - Addresses (first entry shown by default, "Add another" for more, one per address_type for now)
 * - Phone Numbers (dynamic, one per phone_type for now)
 * - Third Party Contact Persons (dynamic)
 * - Email & Domain
 */

// Templates for new dynamic items
const ADDRESS_TEMPLATE = {
  address_type: "",
  complex_unit_number: "",
  complex_name: "",
  street_number: "",
  street_name: "",
  suburb: "",
  city: "",
  postal_code: "",
  province: "",
  country: "South Africa",
  is_primary: false,
};

const PHONE_TEMPLATE = {
  phone_type: "",
  phone_number: "",
  is_primary: false,
};

const CONTACT_PERSON_TEMPLATE = {
  contact_person_code: "",
  association: "",
};

function PageContacts({ formData, onChange, onArrayItemChange, onArrayAdd, onArrayRemove, disabled }) {
  return (
    <div className="space-y-6">
      {/* Addresses Section — first entry always visible */}
      <DynamicFieldGroup
        label="Addresses"
        items={formData.addresses}
        onAdd={() => onArrayAdd("addresses", ADDRESS_TEMPLATE)}
        onRemove={(index) => onArrayRemove("addresses", index)}
        disabled={disabled}
        maxItems={ENUMS.addressType.length}
        renderItem={(item, index, isDisabled) => (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <SelectField
              label="Address Type"
              name={`address_type_${index}`}
              value={item.address_type}
              onChange={(e) => onArrayItemChange("addresses", index, "address_type", e.target.value)}
              options={ENUMS.addressType}
              disabled={isDisabled}
              required
            />
            <TextField
              label="Complex Unit Number"
              name={`complex_unit_${index}`}
              value={item.complex_unit_number}
              onChange={(e) => onArrayItemChange("addresses", index, "complex_unit_number", e.target.value)}
              disabled={isDisabled}
            />
            <TextField
              label="Complex Name"
              name={`complex_name_${index}`}
              value={item.complex_name}
              onChange={(e) => onArrayItemChange("addresses", index, "complex_name", e.target.value)}
              disabled={isDisabled}
            />
            <TextField
              label="Street Number"
              name={`street_number_${index}`}
              value={item.street_number}
              onChange={(e) => onArrayItemChange("addresses", index, "street_number", e.target.value)}
              disabled={isDisabled}
            />
            <TextField
              label="Street Name"
              name={`street_name_${index}`}
              value={item.street_name}
              onChange={(e) => onArrayItemChange("addresses", index, "street_name", e.target.value)}
              disabled={isDisabled}
            />
            <TextField
              label="Suburb"
              name={`suburb_${index}`}
              value={item.suburb}
              onChange={(e) => onArrayItemChange("addresses", index, "suburb", e.target.value)}
              disabled={isDisabled}
            />
            <TextField
              label="City / Town"
              name={`city_${index}`}
              value={item.city}
              onChange={(e) => onArrayItemChange("addresses", index, "city", e.target.value)}
              disabled={isDisabled}
            />
            <TextField
              label="Postal Code"
              name={`postal_code_${index}`}
              value={item.postal_code}
              onChange={(e) => onArrayItemChange("addresses", index, "postal_code", e.target.value)}
              disabled={isDisabled}
            />
            <SelectField
              label="Province"
              name={`province_${index}`}
              value={item.province}
              onChange={(e) => onArrayItemChange("addresses", index, "province", e.target.value)}
              options={ENUMS.province}
              disabled={isDisabled}
            />
            <TextField
              label="Country"
              name={`country_${index}`}
              value={item.country}
              onChange={(e) => onArrayItemChange("addresses", index, "country", e.target.value)}
              disabled={isDisabled}
            />
          </div>
        )}
      />

      {/* Phone Numbers Section */}
      <DynamicFieldGroup
        label="Phone Numbers"
        items={formData.phones}
        onAdd={() => onArrayAdd("phones", PHONE_TEMPLATE)}
        onRemove={(index) => onArrayRemove("phones", index)}
        disabled={disabled}
        maxItems={ENUMS.phoneType.length}
        renderItem={(item, index, isDisabled) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SelectField
              label="Phone Type"
              name={`phone_type_${index}`}
              value={item.phone_type}
              onChange={(e) => onArrayItemChange("phones", index, "phone_type", e.target.value)}
              options={ENUMS.phoneType}
              disabled={isDisabled}
              required
            />
            <TextField
              label="Phone Number"
              name={`phone_number_${index}`}
              value={item.phone_number}
              onChange={(e) => onArrayItemChange("phones", index, "phone_number", e.target.value)}
              disabled={isDisabled}
            />
          </div>
        )}
      />

      {/* Third Party Contact Persons */}
      <DynamicFieldGroup
        label="Third Party Contact Persons"
        items={formData.contact_persons}
        onAdd={() => onArrayAdd("contact_persons", CONTACT_PERSON_TEMPLATE)}
        onRemove={(index) => onArrayRemove("contact_persons", index)}
        disabled={disabled}
        renderItem={(item, index, isDisabled) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SelectField
              label="Third Party Contact Person Code"
              name={`contact_code_${index}`}
              value={item.contact_person_code}
              onChange={(e) => onArrayItemChange("contact_persons", index, "contact_person_code", e.target.value)}
              options={[]}
              disabled={isDisabled}
              placeholder="— Select Third Party —"
            />
            <SelectField
              label="Contact Person Association"
              name={`association_${index}`}
              value={item.association}
              onChange={(e) => onArrayItemChange("contact_persons", index, "association", e.target.value)}
              options={ENUMS.connectedPersonRelationship}
              disabled={isDisabled}
            />
          </div>
        )}
      />

      {/* Email & Domain */}
      <div>
        <h3 className="text-lg font-semibold text-baby-800 mb-3">
          Email &amp; Domain
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="E-mail Address"
            name="email_address"
            value={formData.emails[0]?.email_address || ""}
            onChange={(e) => onArrayItemChange("emails", 0, "email_address", e.target.value)}
            disabled={disabled}
          />
          <TextField
            label="Domain"
            name="domain"
            value={formData.domain}
            onChange={onChange}
            disabled={disabled}
            placeholder="e.g. company.co.za"
          />
        </div>
      </div>
    </div>
  );
}

export default PageContacts;
