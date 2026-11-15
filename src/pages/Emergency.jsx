
import { useEffect, useState } from "react";
import { astronaut as a } from "../data/mockData";
import { LABEL, DISCLAIMER } from "../logic/rules";

const mmss = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function Emergency({
  em,
  setEm,
  v,
  r,
  onExit,
  contact,
  onAlertCrew,
  crewAlerts = [],
}) {
  if (em.stage === "who")
    return <Who em={em} setEm={setEm} v={v} onExit={onExit} />;

  if (em.stage === "type")
    return <Type em={em} setEm={setEm} onExit={onExit} />;

  return (
    <Active
      em={em}
      v={v}
      r={r}
      onExit={onExit}
      contact={contact}
      onAlertCrew={onAlertCrew}
      crewAlerts={crewAlerts}
    />
  );
}

function Who({ em, setEm, v, onExit }) {
  const toggle = (id) =>
    setEm({
      ...em,
      who: em.who.includes(id)
        ? em.who.filter((x) => x !== id)
        : [...em.who, id],
    });

  return (
    <main className="pagegrid em">
      <p className="lead">
        Choose yourself or a crewmate, then pick the type of emergency.
      </p>

      <div className="cards4">
        {a.crew.map((c, i) => {
          const on = em.who.includes(c.id);

          return (
            <button
              key={c.id}
              className={`card pick ${on ? "on" : ""}`}
              onClick={() => toggle(c.id)}
              aria-pressed={on}
            >
              <span className="circle">{i === 0 ? "Me" : i + 1}</span>
              <strong>{c.name}</strong>
              <span className="small muted">
                <i className={`dot ${c.dot || "ok"}`} />
                {c.id === "me"
                  ? `Wristband: connected · Pulse ${v.hr}`
                  : c.note}
              </span>
              {on && <span className="chip alert">Selected</span>}
            </button>
          );
        })}
      </div>

      <p className="note">
        You see a crewmate's vital data only in an emergency and after you
        choose them. It works without contact with Earth.
      </p>

      <div className="actions">
        <button className="btn-outline" onClick={onExit}>
          Cancel
        </button>

        <button
          className="btn-red"
          disabled={!em.who.length}
          onClick={() => setEm({ ...em, stage: "type" })}
        >
          Next: choose the type
        </button>
      </div>
    </main>
  );
}

function Type({ em, setEm, onExit }) {
  return (
    <main className="pagegrid em">
      <p className="lead">
        Pick the closest one. Saved steps appear and work without contact with Earth.
      </p>

      <div className="cards3">
        {a.emergencyTypes
          .filter((t) => t.id !== "manual")
          .map((t) => (
            <button
              key={t.id}
              className="card pick"
              onClick={() =>
                setEm({ ...em, type: t.id, stage: "active" })
              }
            >
              <strong>{t.title}</strong>
              <span className="small muted">{t.hint}</span>
            </button>
          ))}
      </div>

      <div className="actions">
        <button className="btn-outline" onClick={onExit}>
          Cancel
        </button>

        <button
          className="btn-red"
          onClick={() =>
            setEm({
              ...em,
              type: "manual",
              stage: "active",
            })
          }
        >
          Alert the crew now without choosing a type
        </button>
      </div>
    </main>
  );
}

function Active({
  em,
  v,
  r,
  onExit,
  contact,
  onAlertCrew,
  crewAlerts,
}) {
  const t =
    a.emergencyTypes.find((x) => x.id === em.type) ||
    a.emergencyTypes.find((x) => x.id === "manual");

  const [secs, setSecs] = useState(0);
  const [done, setDone] = useState(0);
  const [crewAt, setCrewAt] = useState(
    em.crewAlerted ? 0 : null
  );

  const crewAlerted = crewAt !== null;

  useEffect(() => {
    const id = setInterval(() => setSecs((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Send the emergency report to Earth or save it offline.
  useEffect(() => {
    contact.send(`Emergency report: ${t.title}`);
  }, []);

  // Automatic crew alert in the demo scenario.
  useEffect(() => {
    if (em.auto && crewAt === null && secs >= 5) {
      setCrewAt(5);

      onAlertCrew?.({
        type: t.title,
        readings: { pulse: v.hr, oxygen: v.spo2 },
      });
    }
  }, [secs, em.auto, crewAt]);

  // Manual crew alert button.
  const handleAlertCrew = () => {
    if (crewAlerted) return;

    setCrewAt(secs);

    onAlertCrew?.({
      type: t.title,
      readings: {
        pulse: v.hr,
        oxygen: v.spo2,
      },
    });
  };

  const n = t.steps.length;
  const finished = done >= n;

  const sentReport = contact.sentLog.includes(
    `Emergency report: ${t.title}`
  );

  const timeline = [
    {
      dot: crewAlerted ? "ok" : "pending",
      title: crewAlerted ? "Crew alerted" : "Crew not alerted yet",
      sub: crewAlerted
        ? `Alert sent at ${mmss(crewAt)}`
        : "Press Alert crew",
    },
    {
      dot: secs >= 8 ? "ok" : "pending",
      title: "Your data is saved on your device",
      sub: secs >= 8 ? mmss(8) : "Saving…",
    },
    contact.online
      ? {
          dot: "ok",
          title: "Contact with Earth restored",
          sub: "Data is being sent",
        }
      : {
          dot: "warn",
          title: "Contact with Earth is lost",
          sub: "Resends automatically when it returns",
        },
    sentReport
      ? {
          dot: "ok",
          title: "Report sent to the doctor",
          sub: "Sent ✓",
        }
      : {
          dot: "pending",
          title: "Report to the doctor",
          sub: "Waiting for connection",
        },
  ];

  return (
    <main className="pagegrid em-active">
      {contact.online ? (
        <div className="banner ok">
          <div>
            <strong>Contact with Earth restored</strong>
            <br />
            <span className="small">
              Your data and the steps you followed were sent. Keep following the steps.
            </span>
          </div>
        </div>
      ) : (
        <div className="banner warn">
          <div>
            <strong>No contact with Earth</strong>
            <br />
            <span className="small">
              The steps below are saved on your device and work offline.
              Your data is sent automatically when contact returns.
            </span>
          </div>
        </div>
      )}

      <section className="col">
        <article className="card">
          <h2>Your status now</h2>

          <dl className="dl">
            <div>
              <dt>Pulse</dt>
              <dd className={r.level.hr === "ok" ? "ok" : "bad"}>
                {v.hr} · {LABEL[r.level.hr]}
              </dd>
            </div>

            <div>
              <dt>Blood oxygen</dt>
              <dd className={r.level.spo2 === "ok" ? "ok" : "bad"}>
                {v.spo2}% · {LABEL[r.level.spo2]}
              </dd>
            </div>
          </dl>

          <span className="small muted">
            Wristband readings are processed locally without contact (simulated).
          </span>
        </article>

        <article className="card grow">
          <h2>Saved guidance pack</h2>
          <strong className="bignum2">{t.title}</strong>

          <span className="small ok">
            Saved on your device · works offline
          </span>

          <span className="small muted">
            Updates automatically when contact with Earth returns.
          </span>

          <button className="btn-outline" onClick={onExit}>
            I'm fine, cancel the emergency
          </button>
        </article>
      </section>

      <article className="card steps-card">
        <div className="stepshead">
          <span>Follow the steps. You do not need Earth.</span>
          <b>
            Step {Math.min(done + 1, n)} of {n}
          </b>
        </div>

        <div className="bar red">
          <div style={{ width: `${(done / n) * 100}%` }} />
        </div>

        <ol className="steps">
          {t.steps.map((s, i) => (
            <li
              key={s}
              className={i < done ? "done" : i === done ? "now" : ""}
            >
              <i className="radio" aria-hidden="true">
                {i < done ? "✓" : ""}
              </i>
              {s}
            </li>
          ))}
        </ol>

        {finished && (
          <p className="small ok" role="status">
            All steps done. Stay near your crewmate until you feel well.
          </p>
        )}

        {crewAlerted && (
          <p className="crew-success" role="status">
            ✓ Crew alert sent successfully. Your crewmates have been notified in this demo.
          </p>
        )}

        <p className="small muted">{DISCLAIMER}</p>

        <div className="actions">
          <button
            className={`btn-outline dark ${crewAlerted ? "crew-alerted" : ""}`}
            onClick={handleAlertCrew}
            disabled={crewAlerted}
          >
            {crewAlerted ? "✓ Crew alerted" : "Alert crew"}
          </button>

          <button
            className="btn-red"
            disabled={finished}
            onClick={() => setDone((x) => x + 1)}
          >
            Done, next
          </button>
        </div>
      </article>

      <article className="card">
        <h2>Alert and contact status</h2>

        <ul className="timeline">
          {timeline.map((x) => (
            <li key={x.title}>
              <i className={`dot ${x.dot}`} />
              <div>
                <strong>{x.title}</strong>
                <br />
                <span className="small muted">{x.sub}</span>
              </div>
            </li>
          ))}
        </ul>

        <p className="small muted">
          When contact returns, it sends your vital data, the time of the event and the steps you followed.
        </p>

        {crewAlerts.length > 0 && (
          <p className="small ok">
            Crew alert events recorded: {crewAlerts.length}
          </p>
        )}
      </article>
    </main>
  );
}
