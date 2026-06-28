/**
 * DynamicFieldGroup — supports "Add another" rows for repeating data.
 *
 * Props:
 * - label: Section heading
 * - items: Array of item objects
 * - onAdd: Callback to add a new empty item
 * - onRemove: Callback with index to remove an item
 * - onItemChange: Callback (index, fieldName, value) when a field changes
 * - renderItem: Function (item, index, onChange, disabled) => JSX
 * - disabled: If true, all fields and buttons are disabled
 * - maxItems: Maximum number of items allowed (optional)
 */
function DynamicFieldGroup({
  label,
  items,
  onAdd,
  onRemove,
  renderItem,
  disabled = false,
  maxItems = null,
}) {
  const canAdd = !disabled && (maxItems === null || items.length < maxItems);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-600">{label}</h4>
        {canAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="text-xs px-3 py-1 text-baby-700 border border-baby-300 rounded-lg hover:bg-baby-50 transition-colors"
          >
            + Add another
          </button>
        )}
      </div>

      {items.length === 0 && (
        <p className="text-sm text-gray-400 italic">
          No entries yet.{" "}
          {canAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="text-baby-600 hover:text-baby-800 underline"
            >
              Add one
            </button>
          )}
        </p>
      )}

      {items.map((item, index) => (
        <div
          key={index}
          className="relative border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
          {/* Remove button */}
          {!disabled && items.length > 0 && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm transition-colors"
              title="Remove"
            >
              &times;
            </button>
          )}

          {renderItem(item, index, disabled)}
        </div>
      ))}
    </div>
  );
}

export default DynamicFieldGroup;
