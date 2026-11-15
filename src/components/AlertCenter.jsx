import { useEffect } from "react";

const CHIP = { info: "info", warning: "warn", emergency: "alert" };
const NAME = { info: "Info", warning: "Warning", emergency: "Emergency" };

export default function AlertCenter({ alerts, onClose, onOpenEmergency }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="al-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="al-title">Alerts</h2>
        <p className="small muted">Three levels, so the astronaut is not flooded: Info, Warning, Emergency. Every alert has a reason and an action.</p>
        {alerts.length === 0 && <p className="ok">No alerts. All readings are within your baseline.</p>}
        <ul className="alerts">
          {alerts.map((a) => (
            <li key={a.title}>
              <span className={`chip ${CHIP[a.tier]}`}>{NAME[a.tier]}</span>
              <div><strong>{a.title}</strong><br /><span className="small muted">{a.text}</span></div>
            </li>
          ))}
        </ul>
        <div className="actions">
          {alerts.some((a) => a.tier === "emergency") && <button className="btn-red" onClick={onOpenEmergency}>Open Emergency</button>}
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}