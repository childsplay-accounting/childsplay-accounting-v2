import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientLayout from "../components/clients/ClientLayout";
import ClientFormWizard from "../components/clients/ClientFormWizard";

/**
 * Add New Client page.
 * 3-panel layout:
 * - Left: Client list (select to switch to edit mode)
 * - Center: Blank 6-page wizard form
 * - Right: Related (future)
 */
function ClientNew() {
  const navigate = useNavigate();

  function handleSelectClient(clientId) {
    // If user clicks an existing client from the left list, switch to edit mode
    navigate(`/clients/${clientId}/edit`);
  }

  return (
    <ClientLayout
      onSelectClient={handleSelectClient}
      selectedClientId={null}
      excludeArchived={true}
      mode="new"
    >
      <ClientFormWizard mode="create" />
    </ClientLayout>
  );
}

export default ClientNew;
