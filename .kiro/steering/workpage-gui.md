# Workpage GUI Specification

## Overview
The workpage is the main landing page / opening screen of Childsplay Accounting. It is the primary interface users see after signing in. All modules (Client Information, Tax Register, Timesheets, Communications, etc.) are accessible from here via the top menu bar.

## Layout Structure
The workpage consists of three distinct areas (similar to header, body, footer):

```
┌─────────────────────────────────────────────────────┐
│  TOP DROP-DOWN MENU BAR (full width)                │
├─────────────────────────────────────────────────────┤
│                                                     │
│         OPEN WORKPAGE AREA                          │
│         (fills all remaining vertical space)        │
│                                                     │
├─────────────────────────────────────────────────────┤
│  BOTTOM STATUS BAR (full width)                     │
└─────────────────────────────────────────────────────┘
```

---

## Top Drop-Down Menu Bar

### Menu Items (left to right)
1. **Clients**
   - Block 1: Add New Client | Edit Existing Client | Remove Terminated Client
2. **Processes** — *not yet implemented, greyed out/non-clickable*
3. **Support** — *not yet implemented, greyed out/non-clickable*
4. **Users**
   - Block 1: Add New User | Edit Existing User | Remove Terminated User
   - Block 2: Logout

### Design Rules
- Blocks within a dropdown are separated by a visible divider line
- Menu items will (in future) be shown/hidden/greyed-out based on user access rights
- No menu items are currently linked to any module — they are visual structure only for now

---

## Bottom Status Bar

### Items (left to right)
1. "Childsplay Accounting" (application name)
2. Application version
3. Current module name
4. Current client code
5. Logged-in user name
6. Current firm name
7. Current date
8. Current time
9. Copyright
10. Online connection status
11. Screen reference code
12. Popup notifications (bell icon with counter)

### Notes
- All items currently display static placeholder values
- **REMINDER:** Link these status bar items to real active details in a future session

---

## Open Workpage Area

### Current State
- Blank canvas (placeholder)

### Future Plans (NOT YET IMPLEMENTED)
- Dashboard with summaries of certain information (closeable window)
- Welcome message with important announcements (closeable window)
- Both windows open by default; user can close them
- No quick-access buttons to modules

### Standard Module Layout Pattern
When a user selects a menu item, the workpage area will typically show:
- **Left panel:** List of items (e.g., client list)
- **Middle panel:** Details of the selected item (e.g., client details via relational database)
- **Right panel (optional):** Further related details (e.g., timesheets, invoices associated with the client)

This multi-panel layout should be consistent in structure, layout, and look-and-feel throughout the web app.

---

## User Access (Future)
- Users will access the workpage after signing in
- Menu items availability will be determined by user access rights
- Greyed-out or hidden items indicate insufficient permissions
