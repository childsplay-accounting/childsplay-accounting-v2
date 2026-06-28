import ClientFormWizard from "../components/clients/ClientFormWizard";

/**
 * Add New Client page.
 * Opens a blank 5-page wizard/tabbed form in the workpage area.
 * Language and Entity Type must be selected first (gating fields).
 * Client File Type defaults to "New".
 */
function ClientNew() {
  return <ClientFormWizard mode="create" />;
}

export default ClientNew;
