import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clientsApi } from "../../services/api";
import { PageTabs, PageButtons } from "./PageNavigation";
import PageStructural from "./pages/PageStructural";
import PageContacts from "./pages/PageContacts";
import PageTaxes from "./pages/PageTaxes";
import PageMarital from "./pages/PageMarital";
import PageConnected from "./pages/PageConnected";


/**
 * ClientFormWizard — the main 5-page wizard/tabbed form.
 * Used for both "Add New Client" and "Edit Existing Client".
 *
 * Props:
 * - mode: "create" or "edit"
 * - clientId: UUID (only for edit mode)
 */

const INITIAL_FORM_DATA = {
  // Page 1: Structural
  preferred_language: "",
  entity_type: "",
  client_code: "",
  client_group_id: "",
  firm_id: "",
  client_file_type: "New",
  preferred_communication_method: "Email",
  temporary_marker: false,
  client_id_type: "",
  client_id_number: "",

  // Page 2: ID & Contact Details
  names: [{ name_type: "", name_value: "", individual_title: "", non_capitalization_surname: "", is_primary: true }],
  addresses: [],
  phones: [],
  emails: [{ email_address: "", is_primary: true }],
  contact_persons: [],
  domain: "",

  // Page 3: Taxes & Income Sources
  tax_registrations: [],
  income_sources: [],

  // Page 4: Marital & Dates
  marital_status: "",
  spouse_contact_code: "",
  dates: [],

  // Page 5: Connected Persons
  connected_persons: [],
};


function ClientFormWizard({ mode, clientId }) {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isEditing = mode === "edit";
  const isGateComplete = formData.preferred_language !== "" && formData.entity_type !== "";


  // Load existing client data in edit mode
  useEffect(() => {
    if (isEditing && clientId) {
      loadClient();
    }
  }, [clientId]);

  async function loadClient() {
    try {
      setLoading(true);
      const response = await clientsApi.get(clientId);
      const client = response.data;
      setFormData({
        preferred_language: client.preferred_language || "",
        entity_type: client.entity_type || "",
        client_code: client.client_code || "",
        client_group_id: client.client_group_id || "",
        firm_id: client.firm_id || "",
        client_file_type: client.client_file_type || "New",
        preferred_communication_method: client.preferred_communication_method || "Email",
        temporary_marker: client.temporary_marker || false,
        client_id_type: client.client_id_type || "",
        client_id_number: client.client_id_number || "",

        names: client.names?.length > 0 ? client.names : INITIAL_FORM_DATA.names,
        addresses: client.addresses || [],
        phones: client.phones || [],
        emails: client.emails?.length > 0 ? client.emails : INITIAL_FORM_DATA.emails,
        contact_persons: client.contact_persons || [],
        domain: client.personal_details?.domain || "",
        tax_registrations: client.tax_registrations || [],
        income_sources: client.income_sources || [],
        marital_status: client.personal_details?.marital_status || "",
        spouse_contact_code: client.personal_details?.spouse_contact_code || "",
        dates: client.dates || [],
        connected_persons: client.connected_persons || [],
      });
    } catch (err) {
      setError("Failed to load client data.");
    } finally {
      setLoading(false);
    }
  }


  // Update a top-level field
  function handleFieldChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSaveSuccess(false);
  }

  // Update an array field item
  function handleArrayItemChange(arrayName, index, fieldName, value) {
    setFormData((prev) => {
      const updated = [...prev[arrayName]];
      updated[index] = { ...updated[index], [fieldName]: value };
      return { ...prev, [arrayName]: updated };
    });
    setSaveSuccess(false);
  }

  // Add a new item to an array field
  function handleArrayAdd(arrayName, template) {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], { ...template }],
    }));
  }

  // Remove an item from an array field
  function handleArrayRemove(arrayName, index) {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  }


  // Save the form
  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      setSaveSuccess(false);

      if (isEditing) {
        await clientsApi.update(clientId, formData);
      } else {
        const response = await clientsApi.create(formData);
        // After creating, navigate to edit mode for the new client
        navigate(`/clients/${response.data.id}/edit`, { replace: true });
      }
      setSaveSuccess(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("A client with this code already exists.");
      } else {
        setError("Failed to save. Please check your input and try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading client data...
      </div>
    );
  }


  // Render the active page content
  function renderPage() {
    const pageProps = {
      formData,
      onChange: handleFieldChange,
      onArrayItemChange: handleArrayItemChange,
      onArrayAdd: handleArrayAdd,
      onArrayRemove: handleArrayRemove,
      disabled: !isGateComplete,
      isEditing,
    };

    switch (activePage) {
      case 0:
        return <PageStructural {...pageProps} isGateComplete={isGateComplete} />;
      case 1:
        return <PageContacts {...pageProps} />;
      case 2:
        return <PageTaxes {...pageProps} />;
      case 3:
        return <PageMarital {...pageProps} />;
      case 4:
        return <PageConnected {...pageProps} />;
      default:
        return null;
    }
  }


  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Edit Client" : "Add New Client"}
        </h1>
        {!isGateComplete && (
          <p className="text-sm text-amber-600 mt-1">
            Please select Preferred Language and Entity Type to unlock all fields.
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Success */}
      {saveSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm mb-4">
          Client saved successfully.
        </div>
      )}

      {/* Form window */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        {/* Tab bar */}
        <div className="px-6 pt-4">
          <PageTabs
            activePage={activePage}
            onPageChange={setActivePage}
            disabled={!isGateComplete}
          />
        </div>

        {/* Page content */}
        <div className="px-6 py-4">{renderPage()}</div>

        {/* Bottom navigation + Save */}
        <div className="px-6 pb-4">
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">

            {/* Previous */}
            <button
              onClick={() => setActivePage((p) => p - 1)}
              disabled={activePage === 0}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
                ${activePage === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-baby-700 hover:bg-baby-50 border border-baby-300"}
              `}
            >
              &larr; Previous
            </button>

            {/* Page indicator + Save */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Page {activePage + 1} of 5
              </span>
              <button
                onClick={handleSave}
                disabled={saving || !isGateComplete}
                className="px-6 py-2 bg-baby-300 text-baby-900 font-medium rounded-lg hover:bg-baby-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>

            {/* Next */}
            <button
              onClick={() => setActivePage((p) => p + 1)}
              disabled={activePage === 4 || !isGateComplete}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
                ${activePage === 4 || !isGateComplete
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-baby-700 hover:bg-baby-50 border border-baby-300"}
              `}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Cancel link */}
      <div className="mt-4 text-center">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel and return to workpage
        </button>
      </div>
    </div>
  );
}

export default ClientFormWizard;
