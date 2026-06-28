import { useState, useEffect } from "react";

/**
 * Bottom horizontal status bar — full width.
 *
 * Items (left to right):
 * 1. "Childsplay Accounting" (application name) — ALWAYS VISIBLE
 * 2. Application version — priority 2 (hidden on narrow screens)
 * 3. Current module name — priority 9 (last to hide)
 * 4. Current client code — priority 8
 * 5. Logged-in user name — priority 7
 * 6. Current firm name — priority 6
 * 7. Current date — priority 4
 * 8. Current time — priority 5
 * 9. Copyright — ALWAYS VISIBLE
 * 10. Online connection status — priority 3
 * 11. Screen reference code — priority 1 (first to hide)
 * 12. Popup notifications (bell icon with counter) — ALWAYS VISIBLE
 *
 * Responsive priority (first to hide → last to hide):
 * 1. Screen reference code
 * 2. Application version
 * 3. Online connection status
 * 4. Current date
 * 5. Current time
 * 6. Current firm name
 * 7. Logged-in user name
 * 8. Current client code
 * 9. Current module name
 *
 * Always visible: "Childsplay Accounting", Copyright, Popup notifications
 *
 * None of the items are clickable except the Notification Bell.
 * All items use the same text colour (baby-100) for readability.
 * Copyright year is derived dynamically from the current date.
 *
 * REMINDER: Link these to real active details in a future session.
 * Last updated: 2026-06-28
 */

function StatusBar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const currentYear = currentTime.getFullYear();

  return (
    <footer className="w-full bg-baby-800 border-t border-baby-700 select-none">
      <div className="flex items-center h-6 px-2 text-[10px] gap-2">
        {/* 1. Always visible: Application name */}
        <span className="text-baby-100 whitespace-nowrap">
          Childsplay Accounting
        </span>

        {/* 2. Priority 2: Application version — hidden below lg */}
        <Separator className="hidden lg:inline" />
        <span className="hidden lg:inline text-baby-100 whitespace-nowrap">
          v0.1.0
        </span>

        {/* 3. Priority 9: Current module name — hidden below sm */}
        <Separator className="hidden sm:inline" />
        <span className="hidden sm:inline text-baby-100 whitespace-nowrap">
          Client Information
        </span>

        {/* 4. Priority 8: Current client code — hidden below md */}
        <Separator className="hidden md:inline" />
        <span className="hidden md:inline text-baby-100 whitespace-nowrap">
          Client Code
        </span>

        {/* 5. Priority 7: Logged-in user name — hidden below md */}
        <Separator className="hidden md:inline" />
        <span className="hidden md:inline text-baby-100 whitespace-nowrap">
          User
        </span>

        {/* 6. Priority 6: Current firm name — hidden below lg */}
        <Separator className="hidden lg:inline" />
        <span className="hidden lg:inline text-baby-100 whitespace-nowrap">
          Sun Jomar Accountants
        </span>

        {/* 7. Priority 4: Current date — hidden below lg */}
        <Separator className="hidden lg:inline" />
        <span className="hidden lg:inline text-baby-100 whitespace-nowrap">
          {formattedDate}
        </span>

        {/* 8. Priority 5: Current time — hidden below lg */}
        <Separator className="hidden lg:inline" />
        <span className="hidden lg:inline text-baby-100 whitespace-nowrap">
          {formattedTime}
        </span>

        {/* Spacer to push remaining items to the right */}
        <span className="flex-1" />

        {/* 9. Always visible: Copyright (year derived from current date) */}
        <Separator />
        <span className="text-baby-100 whitespace-nowrap">
          © Comparative Shopping CC {currentYear} All Rights Reserved
        </span>

        {/* 10. Priority 3: Online connection status — hidden below lg */}
        <Separator className="hidden lg:inline" />
        <span className="hidden lg:inline">
          <ConnectionStatus online={true} />
        </span>

        {/* 11. Priority 1: Screen reference code — hidden below xl */}
        <Separator className="hidden xl:inline" />
        <span className="hidden xl:inline text-baby-100 whitespace-nowrap">
          Screen reference code
        </span>

        {/* 12. Always visible: Notification bell */}
        <Separator />
        <NotificationBell count={0} />
      </div>
    </footer>
  );
}

/**
 * Visual separator between status bar items.
 * Accepts className for responsive visibility control.
 */
function Separator({ className = "" }) {
  return <span className={`text-baby-500 ${className}`}>|</span>;
}

/**
 * Online connection status indicator (non-clickable).
 */
function ConnectionStatus({ online }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          online ? "bg-accent-green" : "bg-red-400"
        }`}
      />
      <span className="text-baby-100">
        {online ? "Online" : "Offline"}
      </span>
    </span>
  );
}

/**
 * Notification bell icon with counter badge (clickable).
 */
function NotificationBell({ count }) {
  return (
    <button
      className="relative flex items-center hover:opacity-80 transition-opacity"
      title="Notifications"
    >
      {/* Bell icon (SVG) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-3.5 h-3.5 text-baby-100"
      >
        <path
          fillRule="evenodd"
          d="M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076 32.91 32.91 0 0 0 3.256.508 3.5 3.5 0 0 0 6.972 0 32.903 32.903 0 0 0 3.256-.508.75.75 0 0 0 .515-1.076A11.448 11.448 0 0 1 16 8a6 6 0 0 0-6-6ZM8.05 14.943a33.54 33.54 0 0 0 3.9 0 2 2 0 0 1-3.9 0Z"
          clipRule="evenodd"
        />
      </svg>
      {/* Counter badge */}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold rounded-full w-3 h-3 flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}

export default StatusBar;
