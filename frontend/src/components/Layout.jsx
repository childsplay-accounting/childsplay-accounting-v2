import { Outlet, Link, useLocation } from "react-router-dom";

/**
 * Main layout wrapper with navigation sidebar and content area.
 * Uses baby blue colour scheme throughout.
 */
function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/clients", label: "Clients" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-baby-800 text-white flex flex-col">
        {/* Logo / App name */}
        <div className="p-6 border-b border-baby-700">
          <h1 className="text-xl font-bold text-baby-100">Childsplay</h1>
          <p className="text-sm text-baby-300">Accounting</p>
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
                    ? "bg-baby-300 text-baby-900"
                    : "text-baby-200 hover:bg-baby-700 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-baby-700">
          <p className="text-xs text-baby-400">Module: Client Database</p>
          <p className="text-xs text-baby-500">v0.1.0</p>
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
