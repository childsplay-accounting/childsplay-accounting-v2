/**
 * Reusable form field components for Client Information forms.
 * All fields support copy-paste (select-text class).
 * All fields can be disabled via the `disabled` prop (for gating logic).
 */

/**
 * Text input field.
 */
export function TextField({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  readOnly = false,
  placeholder = "",
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg select-text transition-colors
          ${readOnly ? "bg-gray-100 text-gray-600 border-gray-200 cursor-default" : ""}
          ${disabled ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed" : "border-gray-300"}
          ${!disabled && !readOnly ? "focus:outline-none focus:ring-2 focus:ring-baby-300 focus:border-baby-300" : ""}
        `}
      />
    </div>
  );
}

/**
 * Select dropdown field.
 */
export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  placeholder = "— Select —",
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg transition-colors
          ${disabled ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed" : "border-gray-300"}
          ${!disabled ? "focus:outline-none focus:ring-2 focus:ring-baby-300 focus:border-baby-300" : ""}
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => {
          const optValue = typeof opt === "object" ? opt.value : opt;
          const optLabel = typeof opt === "object" ? opt.label : opt;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
}

/**
 * Checkbox field.
 */
export function CheckboxField({
  label,
  name,
  checked,
  onChange,
  disabled = false,
}) {
  return (
    <div className="flex items-center gap-2 pt-6">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`w-4 h-4 rounded border-gray-300 text-baby-600 focus:ring-baby-300
          ${disabled ? "cursor-not-allowed opacity-50" : ""}
        `}
      />
      <label
        htmlFor={name}
        className={`text-sm ${disabled ? "text-gray-400" : "text-gray-700"}`}
      >
        {label}
      </label>
    </div>
  );
}

/**
 * Date input field.
 */
export function DateField({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg select-text transition-colors
          ${disabled ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed" : "border-gray-300"}
          ${!disabled ? "focus:outline-none focus:ring-2 focus:ring-baby-300 focus:border-baby-300" : ""}
        `}
      />
    </div>
  );
}
