import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { clientsApi } from "../services/api";
import { ENUMS } from "../constants/enums";

/**
 * Client Form — used for both creating and editing clients.
 * All fields are copy-paste accessible.
 */
function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    client_code: "",
    entity_type: "",
    client_file_type: "New",
    client_id_type: "",
    client_id_number: "",
    preferred_language: "English",
    preferred_communication_method: "Email",
    temporary_marker: false,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      loadClient();
    }
  }, [id]);

  async function loadClient() {
    try {
      setLoading(true);
      const response = await clientsApi.get(id);
      const client = response.data;
      setFormData({
        client_code: client.client_code || "",
        entity_type: client.entity_type || "",
        client_file_type: client.client_file_type || "New",
        client_id_type: client.client_id_type || "",
        client_id_number: client.client_id_number || "",
        preferred_language: client.preferred_language || "English",
        preferred_communication_method:
          client.preferred_communication_method || "Email",
        temporary_marker: client.temporary_marker || false,
      });
    } catch (err) {
      setError("Failed to load client.");
    } finally {
      setLoading(false);
    }
  }


  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (isEditing) {
        await clientsApi.update(id, formData);
        navigate(`/clients/${id}`);
      } else {
        const response = await clientsApi.create(formData);
        navigate(`/clients/${response.data.id}`);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError("A client with this code already exists.");
      } else {
        setError("Failed to save client. Please check your input.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }


  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to={isEditing ? `/clients/${id}` : "/clients"}
          className="text-sm text-baby-600 hover:text-baby-800 mb-2 inline-block"
        >
          &larr; {isEditing ? "Back to Client" : "Back to Clients"}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Edit Client" : "New Client"}
        </h1>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-baby-800 mb-4">
            Core Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Client Code"
              name="client_code"
              value={formData.client_code}
              onChange={handleChange}
              required
            />
            <FormSelect
              label="Entity Type"
              name="entity_type"
              value={formData.entity_type}
              onChange={handleChange}
              options={ENUMS.entityType}
              required
            />
            <FormSelect
              label="File Status"
              name="client_file_type"
              value={formData.client_file_type}
              onChange={handleChange}
              options={ENUMS.clientFileType}
              required
            />
            <FormSelect
              label="ID Type"
              name="client_id_type"
              value={formData.client_id_type}
              onChange={handleChange}
              options={ENUMS.clientIdType}
            />

            <FormField
              label="ID Number"
              name="client_id_number"
              value={formData.client_id_number}
              onChange={handleChange}
            />
            <FormSelect
              label="Language"
              name="preferred_language"
              value={formData.preferred_language}
              onChange={handleChange}
              options={ENUMS.preferredLanguage}
            />
            <FormSelect
              label="Communication Method"
              name="preferred_communication_method"
              value={formData.preferred_communication_method}
              onChange={handleChange}
              options={ENUMS.preferredCommunicationMethod}
            />
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="temporary_marker"
                name="temporary_marker"
                checked={formData.temporary_marker}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-baby-600 focus:ring-baby-300"
              />
              <label
                htmlFor="temporary_marker"
                className="text-sm text-gray-700"
              >
                Temporary Marker
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-baby-300 text-baby-900 font-medium rounded-lg hover:bg-baby-400 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : isEditing ? "Update Client" : "Create Client"}
          </button>
          <Link
            to={isEditing ? `/clients/${id}` : "/clients"}
            className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}


/**
 * Reusable text input field.
 */
function FormField({ label, name, value, onChange, required = false }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-300 focus:border-baby-300 select-text"
      />
    </div>
  );
}

/**
 * Reusable select dropdown field.
 */
function FormSelect({ label, name, value, onChange, options, required = false }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-300 focus:border-baby-300"
      >
        <option value="">— Select —</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ClientForm;
