import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { clientsApi } from "../services/api";

/**
 * Client List page — displays all clients in a searchable, filterable table.
 * All fields are selectable/copyable as per UI requirements.
 */
function ClientList() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClients();
  }, [search, fileTypeFilter]);

  async function loadClients() {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (fileTypeFilter) params.file_type = fileTypeFilter;

      const response = await clientsApi.list(params);
      setClients(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load clients. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Get the primary display name for a client.
   */
  function getDisplayName(client) {
    if (!client.names || client.names.length === 0) return "—";
    const primary = client.names.find((n) => n.is_primary) || client.names[0];
    return primary.name_value;
  }

  const fileTypeOptions = ["New", "Active", "Third Party", "Archived"];

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">
            Manage your client information database
          </p>
        </div>
        <Link
          to="/clients/new"
          className="px-4 py-2 bg-baby-300 text-baby-900 font-medium rounded-lg hover:bg-baby-400 transition-colors"
        >
          + New Client
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by code or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-300 focus:border-baby-300"
        />
        <select
          value={fileTypeFilter}
          onChange={(e) => setFileTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-300 focus:border-baby-300"
        >
          <option value="">All Statuses</option>
          {fileTypeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && !error && (
        <div className="text-center py-12 text-gray-500">Loading clients...</div>
      )}

      {/* Empty state */}
      {!loading && !error && clients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No clients found.</p>
          <Link
            to="/clients/new"
            className="px-4 py-2 bg-baby-300 text-baby-900 font-medium rounded-lg hover:bg-baby-400 transition-colors"
          >
            Add your first client
          </Link>
        </div>
      )}

      {/* Client table */}
      {!loading && clients.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-baby-50 border-b border-baby-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-baby-800">
                  Code
                </th>
                <th className="text-left px-4 py-3 font-medium text-baby-800">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-medium text-baby-800">
                  Entity Type
                </th>
                <th className="text-left px-4 py-3 font-medium text-baby-800">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-baby-800">
                  ID Number
                </th>
                <th className="text-right px-4 py-3 font-medium text-baby-800">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-baby-50 transition-colors"
                >
                  <td className="px-4 py-3" data-copyable>
                    <span className="font-mono text-baby-700">
                      {client.client_code}
                    </span>
                  </td>
                  <td className="px-4 py-3" data-copyable>
                    {getDisplayName(client)}
                  </td>
                  <td className="px-4 py-3 text-gray-600" data-copyable>
                    {client.entity_type}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        client.client_file_type === "Active"
                          ? "bg-accent-green text-green-900"
                          : client.client_file_type === "New"
                          ? "bg-accent-yellow text-yellow-900"
                          : client.client_file_type === "Archived"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-accent-peach text-orange-900"
                      }`}
                    >
                      {client.client_file_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600" data-copyable>
                    {client.client_id_number || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/clients/${client.id}`}
                      className="text-baby-600 hover:text-baby-800 font-medium"
                    >
                      View
                    </Link>
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

export default ClientList;
