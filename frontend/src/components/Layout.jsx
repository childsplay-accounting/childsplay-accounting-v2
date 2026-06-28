import { Outlet } from "react-router-dom";
import MenuBar from "./MenuBar";
import StatusBar from "./StatusBar";

/**
 * Main layout wrapper — three-area workpage layout:
 * 1. Top: Horizontal drop-down menu bar (full width)
 * 2. Middle: Open workpage area (fills remaining vertical space)
 * 3. Bottom: Horizontal status bar (full width)
 */
function Layout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top: Drop-down menu bar */}
      <MenuBar />

      {/* Middle: Open workpage area */}
      <main className="flex-1 overflow-y-auto bg-white">
        <Outlet />
      </main>

      {/* Bottom: Status bar */}
      <StatusBar />
    </div>
  );
}

export default Layout;
