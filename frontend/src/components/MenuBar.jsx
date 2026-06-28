import { useState, useRef, useEffect } from "react";

/**
 * Top horizontal drop-down menu bar — full width.
 *
 * Menu items (left to right):
 * 1. Clients — Block 1: Add New Client, Edit Existing Client, Remove Terminated Client
 * 2. Processes — greyed out / non-clickable (not yet implemented)
 * 3. Support — greyed out / non-clickable (not yet implemented)
 * 4. Users — Block 1: Add New User, Edit Existing User, Remove Terminated User
 *                Block 2: Logout
 *
 * Blocks within a dropdown are separated by a visible divider line.
 * None of the menu items are currently linked to any module.
 * Future: items shown/hidden/greyed based on user access rights.
 */

const menuConfig = [
  {
    label: "Clients",
    enabled: true,
    blocks: [
      {
        items: [
          { label: "Add New Client", action: null },
          { label: "Edit Existing Client", action: null },
          { label: "Remove Terminated Client", action: null },
        ],
      },
    ],
  },
  {
    label: "Processes",
    enabled: false,
    blocks: [],
  },
  {
    label: "Support",
    enabled: false,
    blocks: [],
  },
  {
    label: "Users",
    enabled: true,
    blocks: [
      {
        items: [
          { label: "Add New User", action: null },
          { label: "Edit Existing User", action: null },
          { label: "Remove Terminated User", action: null },
        ],
      },
      {
        items: [{ label: "Logout", action: null }],
      },
    ],
  },
];

function MenuBar() {
  const [openMenu, setOpenMenu] = useState(null);
  const menuBarRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuBarRef.current && !menuBarRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleMenuClick(index, enabled) {
    if (!enabled) return;
    setOpenMenu(openMenu === index ? null : index);
  }

  function handleItemClick(action) {
    // Future: execute the action (navigate, open modal, etc.)
    setOpenMenu(null);
  }

  return (
    <nav
      ref={menuBarRef}
      className="relative w-full bg-baby-800 border-b border-baby-700 select-none"
    >
      <div className="flex items-center h-9">
        {menuConfig.map((menu, index) => (
          <div key={menu.label} className="relative">
            {/* Menu item button */}
            <button
              onClick={() => handleMenuClick(index, menu.enabled)}
              disabled={!menu.enabled}
              className={`px-4 h-9 text-sm font-medium transition-colors ${
                menu.enabled
                  ? openMenu === index
                    ? "bg-baby-700 text-white"
                    : "text-baby-100 hover:bg-baby-700 hover:text-white"
                  : "text-baby-500 cursor-not-allowed"
              }`}
            >
              {menu.label}
            </button>

            {/* Dropdown */}
            {menu.enabled && openMenu === index && menu.blocks.length > 0 && (
              <div className="absolute top-full left-0 z-50 min-w-[220px] bg-white border border-gray-200 rounded-b-lg shadow-lg py-1">
                {menu.blocks.map((block, blockIndex) => (
                  <div key={blockIndex}>
                    {/* Divider between blocks */}
                    {blockIndex > 0 && (
                      <div className="border-t border-gray-200 my-1" />
                    )}
                    {/* Block items */}
                    {block.items.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleItemClick(item.action)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-baby-50 hover:text-baby-800 transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}

export default MenuBar;
