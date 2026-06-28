import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ClientNew from "./pages/ClientNew";
import ClientEdit from "./pages/ClientEdit";
import ClientRemove from "./pages/ClientRemove";

/**
 * App root — defines routing structure.
 *
 * The Layout component provides the three-area workpage structure
 * (menu bar, workpage area, status bar). All routes render within
 * the workpage area via the Outlet in Layout.
 *
 * Routes:
 * - / — Dashboard (blank workpage)
 * - /clients/new — Add New Client (5-page wizard form)
 * - /clients/edit — Edit Existing Client (search/select → form)
 * - /clients/:id/edit — Edit specific client (pre-populated form)
 * - /clients/remove — Remove Terminated Client (search → archive)
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="clients/new" element={<ClientNew />} />
        <Route path="clients/edit" element={<ClientEdit />} />
        <Route path="clients/:id/edit" element={<ClientEdit />} />
        <Route path="clients/remove" element={<ClientRemove />} />
      </Route>
    </Routes>
  );
}

export default App;
