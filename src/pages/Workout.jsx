
import { useEffect, useState } from "react";
import { astronaut as a } from "../data/mockData";
import workoutImage from "../assets/workout.png";

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function Workout() {
  const w = a.workout;
  const [idx, setIdx] = useState(0);
  const [secs, setSecs] = useState(w.sessions[0].startAt);
  const [running, setRunning] = useState(true);
  const [rating, setRating] = useState(null);
  const [saved, setSaved] = useState(false);
  const s = w.sessions[idx];
  const total = s.minutes * 60;
  const pct = Math.round((w.steps.done / w.steps.goal) * 100);
  const progress = Math.min(100, (secs / total) * 100);

  useEffect(() => {
    if (!running || secs >= total) return;
    const t = setInterval(() => setSecs(x => Math.min(x + 1, total)), 1000);
    return () => clearInterval(t);
  }, [running, total, secs]);

  const change = (d) => {
    const n = (idx + d + w.sessions.length) % w.sessions.length;
    setIdx(n);
    setSecs(w.sessions[n].startAt);
    setRating(null);
    setSaved(false);
    setRunning(true);
  };

  return (
    <main className="pagegrid g3">
      <section className="col">
        <article className="card">
          <h2>Daily walking</h2>
          <div className="bigrow"><strong className="bignum">{pct}%</strong><span className="muted">of {w.steps.goal.toLocaleString()} steps</span></div>
          <div className="bar"><div style={{ width: `${pct}%` }} /></div>
        </article>
        <article className="card">
          <h2>Coach's note</h2>
          <p className="small">Today's plan is moderate because your sleep is below your baseline. The app adds fun (routes, goals, challenges) without changing the medical prescription.</p>
        </article>
        <article className="card grow">
          <h2>Key numbers</h2>
          <dl className="dl">{w.numbers.map(n => <div key={n.label}><dt>{n.label}</dt><dd>{n.value}</dd></div>)}</dl>
        </article>
      </section>

      <section className="col">
        <article className="card grow session">
          <h2>{s.name}</h2>
          <div className="workout-image"><img src={workoutImage} alt="Astronaut workout" /></div>
          <div className="timer">{fmt(secs)}</div>
          <span className="small muted">of {fmt(total)}</span>
          <div className="bar"><div style={{ width: `${progress}%` }} /></div>
          <div className="statrow"><span>Heart rate</span><span>128 (simulated) <b className="ok">In zone</b></span></div>
          <div className="actions">
            <button className="btn" onClick={() => setRunning(x => !x)} disabled={secs >= total}>{running ? "Pause" : "Resume"}</button>
            <button className="btn-outline" onClick={() => change(-1)}>Previous workout</button>
            <button className="btn-outline" onClick={() => change(1)}>Next workout</button>
          </div>
        </article>
      </section>

      <section className="col">
        <article className="card">
          <h2>Today's schedule</h2>
          <ul className="sched">
            {w.schedule.map(x => <li key={x.when}><span className="muted">{x.when}</span><span>{x.what}</span><b className={x.state === "Done" ? "ok" : x.state === "In progress" ? "acc" : "muted"}>{x.state}</b></li>)}
          </ul>
          <p className="small muted">Strength and cardio are separated so the body can recover, especially the bones.</p>
        </article>
        <article className="card">
          <h2>Weekly effort</h2>
          <div className="bars" role="img" aria-label="Weekly workout effort">
            {w.week.map((h, i) => <div key={i} style={{ height: `${h}%` }} />)}
          </div>
        </article>
        <article className="card grow">
          <h2>How hard was the session?</h2>
          <div className="scale">
            {[1,2,3,4,5,6,7,8,9,10].map(n => <button key={n} className={rating === n ? "on" : ""} onClick={() => { setRating(n); setSaved(false); }} aria-pressed={rating === n}>{n}</button>)}
          </div>
          <span className="small muted">1 = very easy · 10 = very hard. It takes 10 seconds and feeds the readiness score.</span>
          <div className="actions">
            <button className="btn" disabled={!rating} onClick={() => setSaved(true)}>Save rating</button>
            <button className="btn-outline" onClick={() => { setRating(null); setSaved(false); }}>Skip</button>
          </div>
          {saved && <span className="small ok" role="status">Saved: {rating}/10</span>}
        </article>
      </section>
    </main>
  );
}
