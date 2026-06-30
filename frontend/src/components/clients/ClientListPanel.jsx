import { useState, useEffect } from "react";
import { clientsApi } from "../../services/api";
import { getCombinedName } from "../../utils/combinedFields";

/**
 * Client List Panel — left panel in the 3-panel Client Information layout.
 *
 * Displays a searchable list of all existing clients with two columns:
 * - Client Code
 * - Combined Client Name (computed)
 *
 * The search bar filters the list (replaces the old separate ClientSearch page).
 * Clicking a client row selects it for editing or archiving.
 *
 * Props:
 * - onSelect: Callback with selected client ID
 * - selectedClientId: Currently selected client ID (for highlighting)
 * - excludeArchived: If true, filters out archived clients
 * - mode: "edit" | "remove" | "new" — affects which actions are available
 */
function ClientListPanel({ onSelect, selectedClientId, excludeArchived = false, mode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      setLoading(true);
      const response = await clientsApi.list({
        search: searchTerm || undefined,
      });
      let results = response.data || [];
      if (excludeArchived) {
        results = results.filter((c) => c.client_file_type !== "Archived");
      }
      setClients(results);
    } catch (err) {
      setError("Failed to load clients.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    loadClients();
  }

  function getClientCombinedName(client) {
    if (!client.names || client.names.length === 0) {
      return client.client_code;
    }
    return getCombinedName({
      entityType: client.entity_type,
      names: client.names,
    }) || client.client_code;
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-baby-800 mb-2">Clients</h3>
        <form onSubmit={handleSearch} className="flex gap-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-baby-300 focus:border-baby-300 select-text"
          />
          <button
            type="submit"
            className="px-2 py-1 text-xs bg-baby-200 text-baby-800 rounded hover:bg-baby-300 transition-colors"
          >
            Go
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="p-2 text-xs text-red-600 bg-red-50">{error}</div>
      )}

      {/* Client list */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-4 text-center text-xs text-gray-400">Loading...</div>
        )}

        {!loading && clients.length === 0 && (
          <div className="p-4 text-center text-xs text-gray-400">
            No clients found.
          </div>
        )}

        {!loading && clients.length > 0 && (
          <table className="w-full text-xs">
            <thead className="bg-baby-50 sticky top-0">
              <tr>
                <th className="text-left px-2 py-2 font-medium text-baby-700">
                  Code
                </th>
                <th className="text-left px-2 py-2 font-medium text-baby-700">
                  Name
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => onSelect(client.id)}
                  className={`border-t border-gray-50 cursor-pointer transition-colors
                    ${client.id === selectedClientId
                      ? "bg-baby-100 text-baby-900"
                      : "hover:bg-baby-50/50"
                    }
                  `}
                >
                  <td className="px-2 py-1.5 font-mono select-text whitespace-nowrap">
                    {client.client_code}
                  </td>
                  <td className="px-2 py-1.5 select-text truncate max-w-[120px]">
                    {getClientCombinedName(client)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ClientListPanel;
