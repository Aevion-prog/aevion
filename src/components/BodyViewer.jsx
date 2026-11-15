import { useEffect, useRef, useState } from "react";
import "@google/model-viewer";

// How far in front of the body's centre the dots sit (share of body height).
// If dots float in front of or hide inside the body, change this number.
const DEPTH = 0.06;

const LABEL = { ok: "Normal", warn: "Caution", alert: "Alert", emergency: "Emergency" };

export default function BodyViewer({ hotspots }) {
  const viewer = useRef(null);
  const [positions, setPositions] = useState({});
  const hotspotsRef = useRef(hotspots);
  const spots = hotspots.map((h) => ({ ...h, ...positions[h.id] }));
  const [selectedId, setSelectedId] = useState(null);
  const [calibrating, setCalibrating] = useState(false);
  const [target, setTarget] = useState(hotspots[0].id);
  const selected = spots.find((s) => s.id === selectedId);

  // Place every dot on the body using the model's own size, once it has loaded.
  useEffect(() => {
    const v = viewer.current;
    if (!v) return;
    const place = () => {
      if (typeof v.getDimensions !== "function") return;
      const d = v.getDimensions();
      const c = v.getBoundingBoxCenter();
      if (!d.y) return; // model not ready yet
      const bottom = c.y - d.y / 2;
      const placed = hotspotsRef.current.map((s) => ({
        ...s,
        position: `${(c.x + s.at.x * d.y).toFixed(3)}m ${(bottom + s.at.y * d.y).toFixed(3)}m ${(c.z + DEPTH * d.y).toFixed(3)}m`,
        normal: "0m 0m 1m",
      }));
      // Tell model-viewer to move each dot (it stays glued to that point while you rotate).
      placed.forEach((s) =>
        v.updateHotspot({ name: `hotspot-${s.id}`, position: s.position, normal: s.normal })
      );
      setPositions(Object.fromEntries(placed.map((s) => [s.id, { position: s.position, normal: s.normal }])));
    };
    place();
    v.addEventListener("load", place);
    v.addEventListener("model-visibility", place);
    return () => {
      v.removeEventListener("load", place);
      v.removeEventListener("model-visibility", place);
    };
  }, []);

  // Calibrate mode: click the model to move the chosen dot to that exact spot.
  const handleModelClick = (e) => {
    if (!calibrating) return;
    const hit = viewer.current?.positionAndNormalFromPoint(e.clientX, e.clientY);
    if (!hit) return;
    setPositions((p) => ({ ...p, [target]: { position: hit.position.toString(), normal: hit.normal.toString() } }));
  };

  const positionsText = spots
    .map((s) => `${s.id}: position "${s.position}", normal "${s.normal}"`)
    .join("\n");

  return (
    <div className="body">
      <model-viewer
        ref={viewer}
        src="/models/body.glb"
        alt="3D human body"
        camera-controls
        interaction-prompt="none"
        shadow-intensity="0"
        onClick={handleModelClick}
      >
        {spots.map((s) => (
          <button
            key={s.id}
            slot={`hotspot-${s.id}`}
            className={`hotspot ${s.status}`}
            data-position={s.position}
            data-normal={s.normal}
            aria-label={`${s.title}: ${LABEL[s.status]}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedId(s.id);
            }}
          />
        ))}
      </model-viewer>

      {selected && (
        <div className={`panel ${selected.status}`} role="dialog" aria-label={selected.title}>
          <button className="panel-close" onClick={() => setSelectedId(null)} aria-label="Close">×</button>
          <h3>{selected.title}</h3>
          <span className="panel-status">{LABEL[selected.status]} · {selected.summary}</span>
          <dl>
            {selected.metrics.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="tools">
        <button className="btn-small" onClick={() => setCalibrating((v) => !v)}>
          {calibrating ? "Done" : "Calibrate dots"}
        </button>
        {calibrating && (
          <>
            <label>
              Move dot:{" "}
              <select value={target} onChange={(e) => setTarget(e.target.value)}>
                {spots.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </label>
            <span className="small muted">Then click the right spot on the body.</span>
            <textarea readOnly value={positionsText} rows={5} />
          </>
        )}
      </div>
    </div>
  );
}