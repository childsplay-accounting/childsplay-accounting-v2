import { useState } from "react";
import ClientLayout from "../components/clients/ClientLayout";
import ClientArchiveConfirm from "../components/clients/ClientArchiveConfirm";

/**
 * Remove Terminated Client page.
 * 3-panel layout:
 * - Left: Client list with search (select a client to archive)
 * - Center: Archive confirmation dialog (once a client is selected)
 * - Right: Related (future)
 *
 * On confirm: sets client_file_type to "Archived".
 * No data is deleted — the record remains in the database.
 */
function ClientRemove() {
  const [selectedClientId, setSelectedClientId] = useState(null);

  return (
    <ClientLayout
      onSelectClient={(clientId) => setSelectedClientId(clientId)}
      selectedClientId={selectedClientId}
      excludeArchived={true}
      mode="remove"
    >
      {selectedClientId ? (
        <ClientArchiveConfirm
          clientId={selectedClientId}
          onCancel={() => setSelectedClientId(null)}
        />
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-400 text-sm italic">
            Select a client from the list to archive.
          </p>
        </div>
      )}
    </ClientLayout>
  );
}

export default ClientRemove;
