/**
 * PageStatusWarning — displays validation errors and informational warnings
 * at the top of each page within the Client Information wizard.
 *
 * Props:
 * - warnings: Array of { type: "error" | "info", message: string }
 *
 * Styling:
 * - Errors: red ink (bg-red-50, border-red-200, text-red-700)
 * - Informational warnings: subtle amber (bg-amber-50, border-amber-200, text-amber-700)
 */
function PageStatusWarning({ warnings }) {
  if (!warnings || warnings.length === 0) return null;

  const errors = warnings.filter((w) => w.type === "error");
  const infos = warnings.filter((w) => w.type === "info");

  return (
    <div className="space-y-2 mb-4">
      {/* Errors — red ink */}
      {errors.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-red-500 text-sm font-bold mt-0.5">!</span>
            <div className="space-y-1">
              {errors.map((warning, idx) => (
                <p key={idx} className="text-sm text-red-700">
                  {warning.message}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Informational — subtle amber */}
      {infos.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-amber-400 text-sm mt-0.5">&#9432;</span>
            <div className="space-y-1">
              {infos.map((warning, idx) => (
                <p key={idx} className="text-sm text-amber-600">
                  {warning.message}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PageStatusWarning;
