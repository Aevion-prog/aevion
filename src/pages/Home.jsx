import { useState } from "react";
import { Dumbbell, Pipette } from "lucide-react";
import { astronaut as a } from "../data/mockData";
import { BASELINE, BADGE, LABEL, SAY } from "../logic/rules";
import BodyViewer from "../components/BodyViewer";
import ScoreBreakdown from "../components/ScoreBreakdown";
import { HeartDonut, ReadinessLine } from "../components/Charts";

const taskIcon = { ared: Dumbbell, blood: Pipette };
const cls = (l) => (l === "emergency" ? "alert" : l);

export default function Home({ v, r, go }) {
  const [showWhy, setShowWhy] = useState(false);
  const hotspots = a.hotspots.map((h) => {
    if (h.id === "brain")
      return { ...h, status: r.level.sleep, summary: SAY.sleep[r.level.sleep],
        metrics: [{ label: "Sleep", value: `${v.sleep} h (baseline ${BASELINE.sleep} h)` }, h.metrics[1]] };
    if (h.id === "heart")
      return { ...h, status: r.level.hr, summary: SAY.hr[r.level.hr],
        metrics: [{ label: "Resting heart rate", value: `${v.hr} bpm` },
          { label: "Vs baseline", value: `${v.hr >= BASELINE.hr ? "+" : ""}${v.hr - BASELINE.hr} bpm` }] };
    if (h.id === "lungs")
      return { ...h, status: r.level.spo2, summary: SAY.spo2[r.level.spo2],
        metrics: [{ label: "Blood oxygen", value: `${v.spo2}%` }, h.metrics[1]] };
    if (h.id === "legs")
      return { ...h, status: r.level.steps, summary: SAY.steps[r.level.steps],
        metrics: [{ label: "Steps today", value: v.steps.toLocaleString() }, h.metrics[1]] };
    return h;
  });

  const cards = [
    { label: "Sleep", value: `${v.sleep} h`, level: r.level.sleep },
    { label: "Activity & movement", value: `${v.steps.toLocaleString()} steps`, level: r.level.steps },
    { label: "Light exposure", value: "Low in the evening", level: "ok" },
  ];
  const week = [...a.weeklyReadiness.slice(0, -1), { day: "Today", score: r.score }];

  return (
    <main className="layout">
      <section className="content">
        <div className="row4">
          <article className={`card readiness s-${cls(r.overall)}`}>
            <div className="readiness-top">
              <span className="small">Readiness</span>
              <span className={`badge ${cls(r.overall)}`}>{BADGE[r.overall]}</span>
            </div>
            <div className="scorerow">
              <button className="score linklike" onClick={() => setShowWhy(true)} aria-label={`Readiness ${r.score} out of 100. Why this score?`}>{r.score}/100</button>
              <span className="small">Tap for details</span>
            </div>
            <p className="why">{r.why} {r.advice}</p>
          </article>
          {cards.map((c) => (
            <article className={`card s-${cls(c.level)}`} key={c.label}>
              <h2>{c.label}</h2>
              <div className="big">{c.value}</div>
              <div className="chiprow">
                <span className={`chip ${cls(c.level)}`}>{LABEL[c.level]}</span>
                <span className="small muted">From the wristband</span>
              </div>
            </article>
          ))}
        </div>

        <div className="row2">
          <article className={`card s-${cls(r.level.hr)}`}>
            <h2>Average heart rate</h2>
            <HeartDonut value={v.hr} baseline={BASELINE.hr} />
          </article>
          <article className="card">
            <h2>Today's tasks</h2>
            <ul className="tasks">
              {a.tasks.map((t) => {
                const Icon = taskIcon[t.id];
                return (
                  <li key={t.id}>
                    <Icon size={28} aria-hidden="true" />
                    <span className="muted">{t.type}</span>
                    <span className="task-name">{t.name}</span>
                    <button className="btn" onClick={() => go(t.goes)}>{t.action}</button>
                  </li>
                );
              })}
            </ul>
          </article>
        </div>

        <div className="row2b">
          <article className="card">
            <h2>Readiness this week</h2>
            <ReadinessLine data={week} />
          </article>
          <article className="card">
            <h2>Periodic lab results</h2>
            <ul className="labs">
              {a.labs.slice(0, 3).map((l) => (
                <li key={l.id}>
                  <button className="row-btn" onClick={() => go("lab", l.id)}>
                    <span>{l.name}</span>
                    <span className="muted">{l.trend}</span>
                    <strong className={l.status === "out" ? "warn" : "ok"}>{l.status === "out" ? "Out of range" : "In range"}</strong>
                  </button>
                </li>
              ))}
            </ul>
            <button className="linkbtn" onClick={() => go("labs")}>All {a.labs.length} results →</button>
          </article>
        </div>
      </section>

      <aside className="side">
        <BodyViewer hotspots={hotspots} />
      </aside>
      {showWhy && <ScoreBreakdown r={r} onClose={() => setShowWhy(false)} />}
    </main>
  );
}