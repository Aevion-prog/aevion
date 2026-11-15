import { useEffect, useState } from "react";

const FIELDS = [
  { k: "sleep", label: "Sleep (hours)", min: 0, max: 12, step: 0.1 },
  { k: "hr", label: "Resting heart rate (bpm)", min: 20, max: 220, step: 1 },
  { k: "spo2", label: "Blood oxygen (%)", min: 50, max: 100, step: 1 },
  { k: "steps", label: "Steps today", min: 0, max: 30000, step: 100 },
];
const PRESETS = [
  ["Normal day", { sleep: 7.1, hr: 58, spo2: 98, steps: 6000 }],
  ["Low sleep", { sleep: 3.5, hr: 72, spo2: 97, steps: 2500 }],
  ["Emergency: high heart rate", { sleep: 5.8, hr: 138, spo2: 97, steps: 4200 }],
  ["Emergency: low oxygen", { sleep: 5.8, hr: 62, spo2: 88, steps: 4200 }],
];

export default function ReadingsPanel({ vals, setVals, onClose }) {
  const [draft, setDraft] = useState(vals); // nothing changes until you press Apply
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="rd-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="rd-title">Enter readings</h2>
        <p className="small muted">Change a value and press Apply. The whole dashboard reacts: colors, readiness score and alerts.</p>
        <div className="form">
          {FIELDS.map((f) => (
            <label key={f.k}>
              {f.label}
              <input type="number" min={f.min} max={f.max} step={f.step} value={draft[f.k]}
                onChange={(e) => setDraft({ ...draft, [f.k]: e.target.value })} />
            </label>
          ))}
        </div>
        <div className="presets">
          {PRESETS.map(([name, p]) => (
            <button key={name} className="btn-small" onClick={() => { setVals(p); onClose(); }}>{name}</button>
          ))}
        </div>
        <button className="btn" onClick={() => { setVals(draft); onClose(); }}>Apply</button>
      </div>
    </div>
  );
}