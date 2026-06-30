import ClientListPanel from "./ClientListPanel";
import ClientRelatedPanel from "./ClientRelatedPanel";

/**
 * ClientLayout — 3-panel layout for all Client Information pages.
 *
 * Structure:
 * ┌──────────────┬─────────────────────────────┬──────────────┐
 * │  Left Panel  │      Center Panel           │  Right Panel │
 * │  Client List │  (Client Info form/content) │  (Related)   │
 * │  + Search    │                             │  (Future)    │
 * └──────────────┴─────────────────────────────┴──────────────┘
 *
 * Props:
 * - children: The center panel content (form wizard, archive confirm, etc.)
 * - onSelectClient: Callback when a client is selected from the left panel
 * - selectedClientId: Currently selected client ID
 * - excludeArchived: Whether to hide archived clients from the left list
 * - mode: "new" | "edit" | "remove"
 */
function ClientLayout({ children, onSelectClient, selectedClientId, excludeArchived = false, mode }) {
  return (
    <div className="h-full flex overflow-hidden">
      {/* Left Panel — Client List */}
      <div className="w-56 flex-shrink-0">
        <ClientListPanel
          onSelect={onSelectClient}
          selectedClientId={selectedClientId}
          excludeArchived={excludeArchived}
          mode={mode}
        />
      </div>

      {/* Center Panel — Client Information Form */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

      {/* Right Panel — Related (future) */}
      <div className="w-48 flex-shrink-0">
        <ClientRelatedPanel clientId={selectedClientId} />
      </div>
    </div>
  );
}

export default ClientLayout;
