import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClientLayout from "../components/clients/ClientLayout";
import ClientFormWizard from "../components/clients/ClientFormWizard";

/**
 * Edit Existing Client page.
 * 3-panel layout:
 * - Left: Client list with search (select a client to load into center form)
 * - Center: 6-page wizard form pre-populated with selected client data
 * - Right: Related (future)
 *
 * If accessed via /clients/:id/edit — directly loads that client.
 * If accessed via /clients/edit — prompts selection from left panel.
 */
function ClientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedClientId, setSelectedClientId] = useState(id || null);

  function handleSelectClient(clientId) {
    setSelectedClientId(clientId);
    // Update URL to reflect selected client
    navigate(`/clients/${clientId}/edit`, { replace: true });
  }

  return (
    <ClientLayout
      onSelectClient={handleSelectClient}
      selectedClientId={selectedClientId}
      excludeArchived={true}
      mode="edit"
    >
      {selectedClientId ? (
        <ClientFormWizard mode="edit" clientId={selectedClientId} />
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-400 text-sm italic">
            Select a client from the list to edit.
          </p>
        </div>
      )}
    </ClientLayout>
  );
}

export default ClientEdit;
