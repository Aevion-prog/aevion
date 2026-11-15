import { astronaut as a } from "../data/mockData";
import { sendState } from "../logic/rules";
import { LabChart } from "../components/Charts";

export default function LabDetail({ id, go, contact }) {
  const lab = a.labs.find((l) => l.id === id) || a.labs[0];
  const out = lab.status === "out";
  const state = sendState(contact, `${lab.name} result`);
  const rows = [
    ["Latest result", `${lab.latest} ${lab.unit}`],
    ["Previous result", lab.previous],
    ["Trend", lab.trend],
  ];

  return (
    <main className="pagegrid g2b">
      <section className="col">
        <article className="card">
          <h2>{lab.name}: summary</h2>
          <dl className="dl">
            {rows.map(([k, val]) => (<div key={k}><dt>{k}</dt><dd>{val}</dd></div>))}
            <div><dt>Status</dt><dd className={out ? "warn" : "ok"}>{out ? "Out of range" : "In range"}</dd></div>
          </dl>
        </article>
        <article className="card grow">
          <h2>Note for the doctor</h2>
          <p className="small">{lab.note}</p>
          <button className="btn" onClick={() => contact.send(`${lab.name} result`)} disabled={state !== "idle"}>
            {state === "sent" ? "Sent to Earth ✓" : state === "queued" ? "Saved · sends when connected" : "Send to doctor"}
          </button>
          <button className="btn-outline" onClick={() => go("labs")}>Back to labs</button>
        </article>
      </section>

      <article className="card grow">
        <h2>Last 8 weeks</h2>
        <LabChart lab={lab} />
        <p className="small muted">Numbers under the chart are week numbers. Values and units are experimental.</p>
      </article>
    </main>
  );
}