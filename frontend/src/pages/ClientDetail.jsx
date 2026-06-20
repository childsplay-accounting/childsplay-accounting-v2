import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { clientsApi } from "../services/api";

/**
 * Client Detail page — shows all information for a single client.
 * All fields are displayed as selectable text for easy copy-paste.
 */
function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClient();
  }, [id]);

  async function loadClient() {
    try {
      setLoading(true);
      const response = await clientsApi.get(id);
      setClient(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load client.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      await clientsApi.delete(id);
      navigate("/clients");
    } catch (err) {
      setError("Failed to delete client.");
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  if (error || !client) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error || "Client not found."}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            to="/clients"
            className="text-sm text-baby-600 hover:text-baby-800 mb-2 inline-block"
          >
            &larr; Back to Clients
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {client.client_code}
          </h1>
          <p className="text-gray-600 mt-1">{client.entity_type}</p>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/clients/${id}/edit`}
            className="px-4 py-2 bg-baby-300 text-baby-900 font-medium rounded-lg hover:bg-baby-400 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Client info sections */}
      <div className="space-y-6">
        {/* Core Information */}
        <Section title="Core Information">
          <Field label="Client Code" value={client.client_code} />
          <Field label="Entity Type" value={client.entity_type} />
          <Field label="File Status" value={client.client_file_type} />
          <Field label="ID Type" value={client.client_id_type} />
          <Field label="ID Number" value={client.client_id_number} />
          <Field label="Language" value={client.preferred_language} />
          <Field
            label="Communication Method"
            value={client.preferred_communication_method}
          />
          <Field
            label="Temporary"
            value={client.temporary_marker ? "Yes" : "No"}
          />
        </Section>

        {/* Names */}
        {client.names && client.names.length > 0 && (
          <Section title="Names">
            {client.names.map((name) => (
              <div
                key={name.id}
                className="flex gap-4 py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-xs font-medium text-baby-600 w-32">
                  {name.name_type}
                </span>
                <span data-copyable className="text-gray-900">
                  {name.individual_title && `${name.individual_title} `}
                  {name.name_value}
                  {name.is_primary && (
                    <span className="ml-2 text-xs bg-baby-100 text-baby-700 px-2 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                </span>
              </div>
            ))}
          </Section>
        )}

        {/* Addresses */}
        {client.addresses && client.addresses.length > 0 && (
          <Section title="Addresses">
            {client.addresses.map((addr) => (
              <div
                key={addr.id}
                className="py-3 border-b border-gray-100 last:border-0"
              >
                <span className="text-xs font-medium text-baby-600">
                  {addr.address_type}
                  {addr.is_primary && " (Primary)"}
                </span>
                <p data-copyable className="text-gray-900 mt-1">
                  {[
                    addr.complex_unit_number && `Unit ${addr.complex_unit_number}`,
                    addr.complex_name,
                    `${addr.street_number || ""} ${addr.street_name || ""}`.trim(),
                    addr.suburb,
                    addr.city,
                    addr.province,
                    addr.postal_code,
                    addr.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            ))}
          </Section>
        )}

        {/* Phones */}
        {client.phones && client.phones.length > 0 && (
          <Section title="Phone Numbers">
            {client.phones.map((phone) => (
              <Field
                key={phone.id}
                label={phone.phone_type}
                value={phone.phone_number}
              />
            ))}
          </Section>
        )}

        {/* Emails */}
        {client.emails && client.emails.length > 0 && (
          <Section title="Email Addresses">
            {client.emails.map((email) => (
              <Field
                key={email.id}
                label={email.is_primary ? "Primary" : "Other"}
                value={email.email_address}
              />
            ))}
          </Section>
        )}

        {/* Tax Registrations */}
        {client.tax_registrations && client.tax_registrations.length > 0 && (
          <Section title="Tax Registrations">
            {client.tax_registrations.map((tax) => (
              <div
                key={tax.id}
                className="py-3 border-b border-gray-100 last:border-0"
              >
                <span className="text-xs font-medium text-baby-600">
                  {tax.tax_type}
                </span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Field label="Number" value={tax.tax_number} small />
                  <Field label="Status" value={tax.tax_status} small />
                  {tax.vat_registration && (
                    <Field label="VAT Reg" value={tax.vat_registration} small />
                  )}
                  {tax.vat_period && (
                    <Field label="VAT Period" value={tax.vat_period} small />
                  )}
                  {tax.efiling_client_code && (
                    <Field
                      label="eFiling Code"
                      value={tax.efiling_client_code}
                      small
                    />
                  )}
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Income Sources */}
        {client.income_sources && client.income_sources.length > 0 && (
          <Section title="Income Sources">
            {client.income_sources.map((source) => (
              <div
                key={source.id}
                className="py-2 border-b border-gray-100 last:border-0"
              >
                <Field label="Trading Name" value={source.trading_name} />
                {source.business_description && (
                  <Field
                    label="Business"
                    value={source.business_description}
                  />
                )}
                {source.occupation_description && (
                  <Field
                    label="Occupation"
                    value={source.occupation_description}
                  />
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Dates */}
        {client.dates && client.dates.length > 0 && (
          <Section title="Official Dates">
            {client.dates.map((d) => (
              <Field key={d.id} label={d.date_type} value={d.date_value} />
            ))}
          </Section>
        )}

        {/* Personal Details */}
        {client.personal_details && (
          <Section title="Personal Details">
            <Field
              label="Marital Status"
              value={client.personal_details.marital_status}
            />
            {client.personal_details.domain && (
              <Field label="Domain" value={client.personal_details.domain} />
            )}
          </Section>
        )}

        {/* Connected Persons */}
        {client.connected_persons && client.connected_persons.length > 0 && (
          <Section title="Connected Persons">
            {client.connected_persons.map((conn) => (
              <Field
                key={conn.id}
                label={conn.relationship}
                value={
                  conn.connected_client_id
                    ? `Client: ${conn.connected_client_id}`
                    : `Contact: ${conn.contact_person_id}`
                }
              />
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

/**
 * Reusable section wrapper with title.
 */
function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-baby-800 mb-4 border-b border-baby-100 pb-2">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

/**
 * Reusable field display — label + copyable value.
 */
function Field({ label, value, small = false }) {
  if (!value) return null;
  return (
    <div className={`flex gap-4 ${small ? "text-sm" : ""}`}>
      <span
        className={`font-medium text-gray-500 ${small ? "w-24" : "w-40"} shrink-0`}
      >
        {label}
      </span>
      <span data-copyable className="text-gray-900 select-text">
        {value}
      </span>
    </div>
  );
}

export default ClientDetail;
