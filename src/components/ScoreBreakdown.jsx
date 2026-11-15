import { useEffect } from "react";

export default function ScoreBreakdown({ r, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="sb-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="sb-title">Why {r.score} out of 100?</h2>
        <p className="small muted">We start from 100 and subtract points for every reading that moves away from your own baseline.</p>
        <ul className="breakdown">
          <li><span>Start</span><span /><b>100</b></li>
          {r.breakdown.map((p) => (
            <li key={p.label}>
              <span>{p.label}</span>
              <span className="pbar"><i style={{ width: `${Math.min(p.points, 100)}%` }} /></span>
              <b className={p.points ? "warn" : "ok"}>{p.points ? `−${p.points}` : "0"}</b>
            </li>
          ))}
          {r.capped && <li><span>Emergency reading: score capped at 30</span><span /><b className="bad">cap</b></li>}
          <li className="total"><span>Your score</span><span /><b>{r.score}</b></li>
        </ul>
        <p className="small muted">Simple rules, no black box. Green is 80 or more, yellow 55 to 79, red below 55.</p>
        <button className="btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}