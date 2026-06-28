import { useState } from "react";
import { useParams } from "react-router-dom";
import ClientSearch from "../components/clients/ClientSearch";
import ClientFormWizard from "../components/clients/ClientFormWizard";

/**
 * Edit Existing Client page.
 * If accessed via /clients/:id/edit — directly opens the form for that client.
 * If accessed via /clients/edit — shows search/select first, then opens form.
 */
function ClientEdit() {
  const { id } = useParams();
  const [selectedClientId, setSelectedClientId] = useState(id || null);

  if (!selectedClientId) {
    return (
      <ClientSearch
        title="Edit Existing Client"
        subtitle="Search and select a client to edit"
        onSelect={(clientId) => setSelectedClientId(clientId)}
        excludeArchived={true}
      />
    );
  }

  return <ClientFormWizard mode="edit" clientId={selectedClientId} />;
}

export default ClientEdit;
