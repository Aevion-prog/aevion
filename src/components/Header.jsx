import { ChevronLeft } from "lucide-react";

const TITLES = {
  home: "Astronaut Health Dashboard",
  workout: "Daily Workout",
  labs: "Periodic Labs",
  lab: "Lab Result",
  emergency: "Emergency",
};
const TABS = [["home", "Dashboard"], ["workout", "Workout"], ["labs", "Labs"]];

export default function Header({ page, go, subtitle, onReadings, onEmergency, emergencyOn, contact, synced, onToggleContact }) {
  return (
    <header className="header">
      <div className="titles">
        {page === "lab" && (
          <button className="icon-btn" onClick={() => go("labs")} aria-label="Back to labs">
            <ChevronLeft />
          </button>
        )}
        <div>
          <h1>{TITLES[page]}</h1>
          <p className="muted">{subtitle}</p>
        </div>
      </div>

      <nav className="tabs" aria-label="Pages">
        {TABS.map(([id, label]) => {
          const on = page === id || (id === "labs" && page === "lab");
          return (
            <button key={id} className={`tab ${on ? "on" : ""}`} aria-current={on ? "page" : undefined} onClick={() => go(id)}>
              {label}
            </button>
          );
        })}
      </nav>

      <div className="header-right">
        <span className={`chip ${contact.online ? "ok" : "warn"}`} role="status">
          {contact.online
            ? synced ? `Synced ✓ ${synced} sent` : "Connected to Earth"
            : `No contact with Earth · ${contact.queue.length} waiting`}
        </span>
        <button className="btn-small" onClick={onToggleContact}>
          {contact.online ? "Simulate: lose contact" : "Simulate: contact returns"}
        </button>
        <button className="btn-small" onClick={onReadings}>Enter readings</button>
        <button className={`btn-emergency ${emergencyOn ? "pulse" : ""}`} onClick={onEmergency}>Emergency</button>
      </div>
    </header>
  );
}