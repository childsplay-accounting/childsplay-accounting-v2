/**
 * Page Navigation — Wizard + Tabs hybrid for Client Information forms.
 *
 * Displays:
 * 1. Tab bar at the top (jump to any page)
 * 2. Previous/Next buttons at the bottom (sequential navigation)
 *
 * Props:
 * - pages: Array of { label, key } objects
 * - activePage: Index of the currently active page
 * - onPageChange: Callback with new page index
 * - disabled: If true, all navigation is disabled (gating not yet satisfied)
 */

const PAGE_LABELS = [
  "1. Structural",
  "2. Segment ID",
  "3. Contacts",
  "4. Taxes & Income",
  "5. Marital & Dates",
  "6. Connected Persons",
];

/**
 * Tab bar — displays all page tabs horizontally.
 */
export function PageTabs({ activePage, onPageChange, disabled }) {
  return (
    <div className="flex border-b border-gray-200 mb-4">
      {PAGE_LABELS.map((label, index) => {
        const isActive = index === activePage;
        const isDisabled = disabled && index !== 0; // Page 1 always accessible (has gating fields)
        return (
          <button
            key={label}
            onClick={() => !isDisabled && onPageChange(index)}
            disabled={isDisabled}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
              ${isActive
                ? "border-baby-500 text-baby-700 bg-baby-50"
                : isDisabled
                  ? "border-transparent text-gray-300 cursor-not-allowed"
                  : "border-transparent text-gray-500 hover:text-baby-600 hover:border-baby-300"
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Bottom navigation — Previous/Next buttons.
 */
export function PageButtons({ activePage, onPageChange, totalPages, disabled }) {
  const isFirst = activePage === 0;
  const isLast = activePage === totalPages - 1;

  return (
    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
      <button
        onClick={() => onPageChange(activePage - 1)}
        disabled={isFirst}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
          ${isFirst
            ? "text-gray-300 cursor-not-allowed"
            : "text-baby-700 hover:bg-baby-50 border border-baby-300"
          }
        `}
      >
        &larr; Previous
      </button>

      <span className="text-sm text-gray-500">
        Page {activePage + 1} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(activePage + 1)}
        disabled={isLast || disabled}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
          ${isLast || disabled
            ? "text-gray-300 cursor-not-allowed"
            : "text-baby-700 hover:bg-baby-50 border border-baby-300"
          }
        `}
      >
        Next &rarr;
      </button>
    </div>
  );
}

/**
 * Combined navigation component.
 */
export default function PageNavigation({ activePage, onPageChange, disabled }) {
  return {
    tabs: (
      <PageTabs
        activePage={activePage}
        onPageChange={onPageChange}
        disabled={disabled}
      />
    ),
    buttons: (
      <PageButtons
        activePage={activePage}
        onPageChange={onPageChange}
        totalPages={PAGE_LABELS.length}
        disabled={disabled}
      />
    ),
  };
}
