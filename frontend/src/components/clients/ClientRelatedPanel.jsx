/**
 * Client Related Panel — right panel in the 3-panel Client Information layout.
 *
 * Reserved for future relational data tables associated with each client:
 * - Tax Register
 * - Timesheets
 * - Comments
 * - Outstanding Documents and Information
 *
 * For now, this panel shows a placeholder indicating future functionality.
 *
 * Props:
 * - clientId: Currently selected client ID (for future data loading)
 */
function ClientRelatedPanel({ clientId }) {
  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-baby-800">Related</h3>
      </div>

      {/* Placeholder content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xs text-gray-400 italic">
            Future modules:
          </p>
          <ul className="mt-2 text-xs text-gray-400 space-y-1">
            <li>Tax Register</li>
            <li>Timesheets</li>
            <li>Comments</li>
            <li>Outstanding Documents</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ClientRelatedPanel;
