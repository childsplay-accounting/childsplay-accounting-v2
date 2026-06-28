import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clientsApi } from "../../services/api";

/**
 * Client Archive Confirmation dialog.
 * Shows client summary, asks for confirmation, then sets file type to "Archived".
 *
 * Props:
 * - clientId: UUID of the client to archive
 * - onCancel: Callback to go back to search
 */
function ClientArchiveConfirm({ clientId, onCancel }) {
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [archiving, setArchiving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClient();
  }, [clientId]);

  async function loadClient() {
    try {
      setLoading(true);
      const response = await clientsApi.get(clientId);
      setClient(response.data);
    } catch (err) {
      setError("Failed to load client details.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmArchive() {
    try {
      setArchiving(true);
      setError(null);
      await clientsApi.update(clientId, { client_file_type: "Archived" });
      navigate("/");
    } catch (err) {
      setError("Failed to archive client. Please try again.");
    } finally {
      setArchiving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading client details...</div>
    );
  }

  if (error && !client) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          &larr; Back to search
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Confirm Client Archive
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        You are about to archive this client. The client file will be hidden from
        normal views but the data will be preserved.
      </p>

      {/* Client Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-baby-800 mb-4">
          Client Summary
        </h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-medium text-gray-500">Client Code</dt>
            <dd className="text-gray-900 font-mono select-text">
              {client.client_code}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Entity Type</dt>
            <dd className="text-gray-900 select-text">{client.entity_type}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Current File Type</dt>
            <dd className="text-gray-900 select-text">
              {client.client_file_type}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">ID Number</dt>
            <dd className="text-gray-900 select-text">
              {client.client_id_number || "—"}
            </dd>
          </div>
        </dl>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Warning:</strong> This action will change the client&apos;s file
          type to &ldquo;Archived&rdquo;. The client will no longer appear in normal
          searches. This action can be reversed by a supervisor.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleConfirmArchive}
          disabled={archiving}
          className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {archiving ? "Archiving..." : "Confirm Archive"}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ClientArchiveConfirm;
