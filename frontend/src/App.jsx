import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";

/**
 * App root — defines routing structure.
 *
 * The Layout component provides the three-area workpage structure
 * (menu bar, workpage area, status bar). All routes render within
 * the workpage area via the Outlet in Layout.
 *
 * Currently only the Dashboard (blank workpage) is routed.
 * Future: Client pages, Tax Register, Timesheets, etc. will be
 * added as menu items are linked to modules.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
