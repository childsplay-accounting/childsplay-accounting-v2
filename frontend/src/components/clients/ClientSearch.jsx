import { useState, useEffect } from "react";
import { clientsApi } from "../../services/api";

/**
 * Client Search/Selection interface.
 * Used by Edit Existing Client and Remove Terminated Client pages.
 *
 * Props:
 * - title: Page heading
 * - subtitle: Description text
 * - onSelect: Callback with selected client ID
 * - excludeArchived: If true, filters out archived clients from results
 */
function ClientSearch({ title, subtitle, onSelect, excludeArchived = false }) {
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by client code or name..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-300 focus:border-baby-300 select-text"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-baby-300 text-baby-900 font-medium rounded-lg hover:bg-baby-400 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8 text-gray-500">Loading clients...</div>
      )}

      {/* Results */}
      {!loading && clients.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No clients found. Try a different search term.
        </div>
      )}

      {!loading && clients.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-baby-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-baby-800">
                  Client Code
                </th>
                <th className="text-left px-4 py-3 font-medium text-baby-800">
                  Entity Type
                </th>
                <th className="text-left px-4 py-3 font-medium text-baby-800">
                  File Type
                </th>
                <th className="text-left px-4 py-3 font-medium text-baby-800">
                  ID Number
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-t border-gray-100 hover:bg-baby-50/50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono select-text">
                    {client.client_code}
                  </td>
                  <td className="px-4 py-3 select-text">
                    {client.entity_type}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium
                        ${client.client_file_type === "Active" ? "bg-green-100 text-green-700" : ""}
                        ${client.client_file_type === "New" ? "bg-yellow-100 text-yellow-700" : ""}
                        ${client.client_file_type === "Third Party" ? "bg-purple-100 text-purple-700" : ""}
                        ${client.client_file_type === "Archived" ? "bg-gray-100 text-gray-500" : ""}
                      `}
                    >
                      {client.client_file_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 select-text">
                    {client.client_id_number || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onSelect(client.id)}
                      className="text-sm px-3 py-1 text-baby-700 border border-baby-300 rounded-lg hover:bg-baby-100 transition-colors"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ClientSearch;
