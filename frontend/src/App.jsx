import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ClientList from "./pages/ClientList";
import ClientDetail from "./pages/ClientDetail";
import ClientForm from "./pages/ClientForm";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="clients" element={<ClientList />} />
        <Route path="clients/new" element={<ClientForm />} />
        <Route path="clients/:id" element={<ClientDetail />} />
        <Route path="clients/:id/edit" element={<ClientForm />} />
      </Route>
    </Routes>
  );
}

export default App;
