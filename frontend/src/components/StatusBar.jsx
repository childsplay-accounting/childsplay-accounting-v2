import { useState, useEffect } from "react";

/**
 * Bottom horizontal status bar — full width.
 *
 * Items (left to right):
 * 1. "Childsplay Accounting" (application name)
 * 2. Application version
 * 3. Current module name
 * 4. Current client code
 * 5. Logged-in user name
 * 6. Current firm name
 * 7. Current date
 * 8. Current time
 * 9. Copyright
 * 10. Online connection status
 * 11. Screen reference code
 * 12. Popup notifications (bell icon with counter)
 *
 * All items currently display static placeholder values.
 * REMINDER: Link these to real active details in a future session.
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

  return (
    <footer className="w-full bg-baby-800 border-t border-baby-700 select-none">
      <div className="flex items-center justify-between h-7 px-3 text-xs">
        {/* Left group */}
        <div className="flex items-center gap-4">
          <span className="text-baby-100 font-medium">
            Childsplay Accounting
          </span>
          <Separator />
          <span className="text-baby-300">v0.1.0</span>
          <Separator />
          <span className="text-baby-300">Client Information</span>
          <Separator />
          <span className="text-baby-300">—</span>
          <Separator />
          <span className="text-baby-300">User</span>
          <Separator />
          <span className="text-baby-300">Childsplay Accounting</span>
        </div>

        {/* Right group */}
        <div className="flex items-center gap-4">
          <span className="text-baby-300">{formattedDate}</span>
          <Separator />
          <span className="text-baby-300">{formattedTime}</span>
          <Separator />
          <span className="text-baby-400 text-[10px]">
            © Childsplay Accounting
          </span>
          <Separator />
          <ConnectionStatus online={true} />
          <Separator />
          <span className="text-baby-400">Screen reference code</span>
          <Separator />
          <NotificationBell count={0} />
        </div>
      </div>
    </footer>
  );
}

/**
 * Visual separator between status bar items.
 */
function Separator() {
  return <span className="text-baby-600">|</span>;
}

/**
 * Online connection status indicator.
 */
function ConnectionStatus({ online }) {
  return (
    <div className="flex items-center gap-1">
      <span
        className={`w-2 h-2 rounded-full ${
          online ? "bg-accent-green" : "bg-red-400"
        }`}
      />
      <span className={`text-baby-300`}>
        {online ? "Online" : "Offline"}
      </span>
    </div>
  );
}

/**
 * Notification bell icon with counter badge.
 */
function NotificationBell({ count }) {
  return (
    <div className="relative flex items-center">
      {/* Bell icon (SVG) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 text-baby-300"
      >
        <path
          fillRule="evenodd"
          d="M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076 32.91 32.91 0 0 0 3.256.508 3.5 3.5 0 0 0 6.972 0 32.903 32.903 0 0 0 3.256-.508.75.75 0 0 0 .515-1.076A11.448 11.448 0 0 1 16 8a6 6 0 0 0-6-6ZM8.05 14.943a33.54 33.54 0 0 0 3.9 0 2 2 0 0 1-3.9 0Z"
          clipRule="evenodd"
        />
      </svg>
      {/* Counter badge */}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </div>
  );
}

export default StatusBar;
