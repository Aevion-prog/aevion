import { useEffect, useState } from "react";

export default function ScenarioBar({ i, steps, onGo, onClose }) {
  const [play, setPlay] = useState(false);
  const s = steps[i];

  useEffect(() => {
    if (!play) return;
    if (i >= steps.length - 1) { setPlay(false); return; }
    const t = setTimeout(() => onGo(i + 1), 9000);
    return () => clearTimeout(t);
  }, [play, i]); // eslint-disable-line

  return (
    <div className="scn" role="region" aria-label="Demo scenario">
      <div className="scn-text">
        <span className="small muted">Demo · step {i + 1} of {steps.length}</span>
        <strong>{s.title}</strong>
        <span className="small">{s.say}</span>
      </div>
      <div className="scn-btns">
        <button className="btn-small" disabled={i === 0} onClick={() => onGo(i - 1)}>Back</button>
        <button className="btn" disabled={i === steps.length - 1} onClick={() => onGo(i + 1)}>Next</button>
        <button className="btn-small" onClick={() => setPlay(!play)}>{play ? "Pause" : "Auto-play"}</button>
        <button className="btn-small" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}