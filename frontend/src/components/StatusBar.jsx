import { useState, useEffect, useCallback } from "react";

/**
 * Bottom horizontal status bar — full width, single continuous row.
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
 * All items flow in a single row with consistent spacing (no gaps, no spacers).
 * None of the items are clickable except the Notification Bell.
 * All items use the same text colour (baby-100) for readability.
 * Copyright and version are fetched from the business_details master file via API.
 * Trading name (item 1) is also fetched from business_details.trading_name.
 *
 * Online status (item 10) uses combined detection:
 * - navigator.onLine for instant network-loss detection
 * - Backend ping every 30 seconds for server availability
 * Shows "Offline" if either check fails.
 *
 * REMINDER: Link remaining items to real active details in a future session.
 * Last updated: 2026-06-29
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const PING_INTERVAL_MS = 30000; // Ping backend every 30 seconds

function StatusBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [businessDetails, setBusinessDetails] = useState(null);
  const isOnline = useOnlineStatus();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch business details from master file (once on mount)
  useEffect(() => {
    fetch(`${API_BASE}/business-details/`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setBusinessDetails(data);
      })
      .catch(() => {
        // Silently fall back to defaults if API unavailable
      });
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

  // Use business details from API if available, otherwise fall back to defaults
  const tradingName = businessDetails?.trading_name || "Childsplay Accounting";
  const appVersion = businessDetails?.current_version || "v0.1.0";
  const copyrightText =
    businessDetails?.copyright ||
    `© Comparative Shopping CC ${currentYear} All Rights Reserved`;

  return (
    <footer className="w-full bg-baby-800 border-t border-baby-700 select-none overflow-hidden">
      <div className="flex items-center justify-between h-6 px-2 text-[10px] whitespace-nowrap">
        {/* Left-aligned group: items 1–6 */}
        <div className="flex items-center gap-2">
          {/* 1. Always visible: Application name (from business details trading_name) */}
          <span className="text-baby-100">{tradingName}</span>

          {/* 2. Priority 2: Application version — hidden below lg */}
          <Separator className="hidden lg:inline" />
          <span className="hidden lg:inline text-baby-100">{appVersion}</span>

          {/* 3. Priority 9: Current module name — hidden below sm */}
          <Separator className="hidden sm:inline" />
          <span className="hidden sm:inline text-baby-100">Client Information</span>

          {/* 4. Priority 8: Current client code — hidden below md */}
          <Separator className="hidden md:inline" />
          <span className="hidden md:inline text-baby-100">Client Code</span>

          {/* 5. Priority 7: Logged-in user name — hidden below md */}
          <Separator className="hidden md:inline" />
          <span className="hidden md:inline text-baby-100">User</span>

          {/* 6. Priority 6: Current firm name — hidden below lg */}
          <Separator className="hidden lg:inline" />
          <span className="hidden lg:inline text-baby-100">Sun Jomar Accountants</span>
        </div>

        {/* Right-aligned group: items 7–12 */}
        <div className="flex items-center gap-2">
          {/* 7. Priority 4: Current date — hidden below lg */}
          <Separator className="hidden lg:inline" />
          <span className="hidden lg:inline text-baby-100">{formattedDate}</span>

          {/* 8. Priority 5: Current time — hidden below lg */}
          <Separator className="hidden lg:inline" />
          <span className="hidden lg:inline text-baby-100">{formattedTime}</span>

          {/* 9. Always visible: Copyright (from business details master file) */}
          <Separator />
          <span className="text-baby-100">
            {copyrightText}
          </span>

          {/* 10. Priority 3: Online connection status — hidden below lg */}
          <Separator className="hidden lg:inline" />
          <span className="hidden lg:inline">
            <ConnectionStatus online={isOnline} />
          </span>

          {/* 11. Priority 1: Screen reference code — hidden below xl */}
          <Separator className="hidden xl:inline" />
          <span className="hidden xl:inline text-baby-100">Screen reference code</span>

          {/* 12. Always visible: Notification bell */}
          <Separator />
          <NotificationBell count={0} />
        </div>
      </div>
    </footer>
  );
}

/**
 * Custom hook: Combined online status detection.
 * - Uses navigator.onLine for instant network-loss detection
 * - Pings the backend every 30 seconds for server availability
 * - Returns false (offline) if either check fails
 */
function useOnlineStatus() {
  const [browserOnline, setBrowserOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [backendReachable, setBackendReachable] = useState(true);

  // Listen to browser online/offline events
  useEffect(() => {
    function handleOnline() {
      setBrowserOnline(true);
    }
    function handleOffline() {
      setBrowserOnline(false);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Ping backend periodically
  const pingBackend = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/business-details/`, {
        method: "HEAD",
        cache: "no-store",
      });
      setBackendReachable(response.ok);
    } catch {
      setBackendReachable(false);
    }
  }, []);

  useEffect(() => {
    // Initial ping
    pingBackend();
    // Ping every 30 seconds
    const interval = setInterval(pingBackend, PING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [pingBackend]);

  return browserOnline && backendReachable;
}

/**
 * Visual separator between status bar items.
 * Accepts className for responsive visibility control.
 */
function Separator({ className = "" }) {
  return <span className={`text-baby-100 ${className}`}>|</span>;
}

/**
 * Online connection status indicator (non-clickable).
 * Green (#22c55e) for Online, Red (#ef4444) for Offline.
 */
function ConnectionStatus({ online }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          online ? "bg-green-500" : "bg-red-500"
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
