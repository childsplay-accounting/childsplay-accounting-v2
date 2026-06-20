import { Link } from "react-router-dom";

/**
 * Dashboard — landing page with quick stats and navigation.
 */
function Dashboard() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome to Childsplay Accounting — Client Information Database
        </p>
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/clients"
          className="block p-6 bg-white border border-baby-200 rounded-xl shadow-sm hover:shadow-md hover:border-baby-300 transition-all"
        >
          <h3 className="text-lg font-semibold text-baby-800">Client List</h3>
          <p className="text-sm text-gray-600 mt-2">
            View and search all client profiles
          </p>
        </Link>

        <Link
          to="/clients/new"
          className="block p-6 bg-white border border-baby-200 rounded-xl shadow-sm hover:shadow-md hover:border-baby-300 transition-all"
        >
          <h3 className="text-lg font-semibold text-baby-800">New Client</h3>
          <p className="text-sm text-gray-600 mt-2">
            Add a new client profile to the database
          </p>
        </Link>

        <div className="block p-6 bg-white border border-gray-200 rounded-xl shadow-sm opacity-50">
          <h3 className="text-lg font-semibold text-gray-400">
            Tax Register
          </h3>
          <p className="text-sm text-gray-400 mt-2">Coming soon</p>
        </div>
      </div>

      {/* Info panel */}
      <div className="bg-baby-50 border border-baby-200 rounded-xl p-6">
        <h3 className="font-semibold text-baby-800 mb-2">
          About This Module
        </h3>
        <p className="text-sm text-gray-700">
          The Client Information Database is the first module of Childsplay
          Accounting. It manages permanent client information for communication,
          tax administration, corporate secretarial work, and invoicing. Future
          modules (Tax Register, Timesheets, Communications) will integrate with
          this client data.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
