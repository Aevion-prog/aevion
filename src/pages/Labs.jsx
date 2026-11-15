import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { astronaut as a } from "../data/mockData";
import { sendState } from "../logic/rules";

export default function Labs({ go, contact }) {
  const KEY = "Lab results";
  const state = sendState(contact, KEY);
  const [logged, setLogged] = useState(null);

  return (
    <main className="pagegrid g2">
      <article className="card grow">
        <h2>Latest results compared with the previous ones</h2>
        <table className="table">
          <thead>
            <tr><th>Test</th><th>Latest</th><th>Previous</th><th>Trend</th><th>Status</th><th><span className="sr">Open</span></th></tr>
          </thead>
          <tbody>
            {a.labs.map((l) => (
              <tr key={l.id} tabIndex={0} onClick={() => go("lab", l.id)} onKeyDown={(e) => e.key === "Enter" && go("lab", l.id)}>
                <td>{l.name}</td>
                <td>{l.latest} <span className="small muted">{l.unit}</span></td>
                <td>{l.previous}</td>
                <td>{l.trend}</td>
                <td className={l.status === "out" ? "warn" : "ok"}><b>{l.status === "out" ? "Out of range" : "In range"}</b></td>
                <td><ChevronRight size={18} aria-hidden="true" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="small muted">Units and ranges are experimental for the demo. The doctor sets the real reference values. Tap any row to see its history.</p>
      </article>

      <section className="col">
        <article className="card">
          <h2>Send to Earth</h2>
          <strong className="bignum2">{a.labs.length} results ready to send</strong>
          <span className="small muted">Last sent: 3 days ago</span>
          <span className={`chip ${state === "sent" ? "ok" : "warn"}`}>
            {state === "sent" ? "Sent to Earth ✓" : state === "queued" ? "Saved · sends when connected" : contact.online ? "Ready to send" : "Pending · no connection"}
          </span>
          <button className="btn" onClick={() => contact.send(KEY)} disabled={state !== "idle"}>
            {state === "sent" ? "Sent to the doctor" : state === "queued" ? "Queued for the doctor" : "Send to doctor"}
          </button>
        </article>
        <article className="card grow">
          <h2>Log a new sample</h2>
          <button className="btn-outline" onClick={() => { setLogged("blood"); contact.send("Blood sample log"); }}>Log blood sample</button>
          <button className="btn-outline" onClick={() => { setLogged("urine"); contact.send("Urine sample log"); }}>Log urine sample</button>
          {logged && <span className="small ok" role="status">{logged === "blood" ? "Blood" : "Urine"} sample logged on this device.</span>}
          <p className="small muted">Follow the task table and keep the result on your device first.</p>
        </article>
      </section>
    </main>
  );
}