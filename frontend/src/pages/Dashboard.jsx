import WorkpageArea from "../components/WorkpageArea";

/**
 * Dashboard — the default workpage content (blank canvas).
 *
 * This is what the user sees when they first land on the workpage
 * (after sign-in, in future). Currently a blank canvas.
 *
 * Future plans (NOT YET IMPLEMENTED):
 * - Dashboard window with summaries of certain information (closeable)
 * - Welcome message window with important announcements (closeable)
 * - Both open by default; user can close them
 */
function Dashboard() {
  return <WorkpageArea>{/* Blank canvas — future content goes here */}</WorkpageArea>;
}

export default Dashboard;
