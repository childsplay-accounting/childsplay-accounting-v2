import { Outlet, Link, useLocation } from "react-router-dom";

/**
 * Main layout wrapper with navigation sidebar and content area.
 * Light theme with baby blue accents.
 */
function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/clients", label: "Clients" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar — light theme */}
      <aside className="w-64 bg-white border-r border-baby-200 flex flex-col">
        {/* Logo / App name */}
        <div className="p-6 border-b border-baby-100">
          <h1 className="text-xl font-bold text-baby-700">Childsplay</h1>
          <p className="text-sm text-baby-500">Accounting</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-baby-100 text-baby-800 border border-baby-200"
                    : "text-gray-600 hover:bg-baby-50 hover:text-baby-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-baby-100">
          <p className="text-xs text-gray-500">Module: Client Database</p>
          <p className="text-xs text-gray-400">v0.1.0</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
