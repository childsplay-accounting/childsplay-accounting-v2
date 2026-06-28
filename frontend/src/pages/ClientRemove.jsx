import { useState } from "react";
import ClientSearch from "../components/clients/ClientSearch";
import ClientArchiveConfirm from "../components/clients/ClientArchiveConfirm";

/**
 * Remove Terminated Client page.
 * Shows a search/select interface, then a confirmation dialog.
 * On confirm: sets client_file_type to "Archived".
 * No data is deleted — the record remains in the database.
 */
function ClientRemove() {
  const [selectedClientId, setSelectedClientId] = useState(null);

  if (!selectedClientId) {
    return (
      <ClientSearch
        title="Remove Terminated Client"
        subtitle="Search and select a client to archive"
        onSelect={(clientId) => setSelectedClientId(clientId)}
        excludeArchived={true}
      />
    );
  }

  return (
    <ClientArchiveConfirm
      clientId={selectedClientId}
      onCancel={() => setSelectedClientId(null)}
    />
  );
}

export default ClientRemove;
