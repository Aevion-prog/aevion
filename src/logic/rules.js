// All the "if this, then that" rules live here. Change the numbers to tune the app.
export const BASELINE = { sleep: 7.1, hr: 58 };
export const DEFAULTS = { sleep: 5.8, hr: 62, spo2: 97, steps: 4200 };
export const LABEL = { ok: "Normal", warn: "Caution", alert: "Alert", emergency: "Emergency" };
export const BADGE = { ok: "Green · Ready", warn: "Yellow · Caution", alert: "Red · Risk" };
export const DISCLAIMER = "Demo guidance for the hackathon. Not an official medical protocol.";

// What each body dot says, per level.
export const SAY = {
  sleep: { ok: "Sleep matches your baseline", warn: "Sleep below your baseline", alert: "Very little sleep" },
  hr: { ok: "Within your range", warn: "Higher than your baseline", alert: "Heart rate is out of range", emergency: "Dangerous heart rate" },
  spo2: { ok: "Breathing normal", warn: "Oxygen a little low", alert: "Oxygen low", emergency: "Dangerously low oxygen" },
  steps: { ok: "Moving enough today", warn: "Low movement today", alert: "Almost no movement today" },
};

const ORDER = ["ok", "warn", "alert", "emergency"];
const worst = (list) => list.reduce((a, b) => (ORDER.indexOf(b) > ORDER.indexOf(a) ? b : a), "ok");
const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

// Empty or invalid inputs fall back to the defaults.
export const parse = (x) =>
  Object.fromEntries(
    Object.keys(DEFAULTS).map((k) => [k, x[k] === "" || Number.isNaN(Number(x[k])) ? DEFAULTS[k] : Number(x[k])])
  );

export function evaluate({ sleep, hr, spo2, steps }) {
  const level = {
    sleep: sleep < 4 ? "alert" : sleep < 6 ? "warn" : "ok",
    hr: hr >= 130 || hr < 40 ? "emergency" : hr > 100 ? "alert" : hr > BASELINE.hr + 10 ? "warn" : "ok",
    spo2: spo2 < 90 ? "emergency" : spo2 < 92 ? "alert" : spo2 < 95 ? "warn" : "ok",
    steps: steps < 1000 ? "alert" : steps < 3000 ? "warn" : "ok",
  };

  // Points taken off 100 by each reading. The breakdown window shows these.
  const breakdown = [
    { label: "Sleep", points: Math.round(clamp((BASELINE.sleep - sleep) / BASELINE.sleep, 0, 1) * 100) },
    { label: "Resting heart rate", points: Math.round(clamp((hr - BASELINE.hr) / 42, 0, 1) * 60) },
    { label: "Blood oxygen", points: Math.round(clamp((97 - spo2) / 10, 0, 1) * 100) },
    { label: "Steps", points: Math.round(clamp((5000 - steps) / 5000, 0, 1) * 25) },
  ];
  let score = clamp(100 - breakdown.reduce((sum, p) => sum + p.points, 0), 0, 100);
  const raw = score;

  const worstLevel = worst(Object.values(level));
  if (worstLevel === "emergency") score = Math.min(score, 30);
  const capped = score < raw;
  const byScore = score >= 80 ? "ok" : score >= 55 ? "warn" : "alert";
  const overall = worst([byScore, worstLevel === "emergency" ? "alert" : worstLevel]);
  const emergencyKey = ["hr", "spo2"].find((k) => level[k] === "emergency") || null;
  const emergencyType = { hr: "heart", spo2: "oxygen" }[emergencyKey] || null;

  const parts = [];
  if (level.sleep !== "ok") parts.push(`sleep is ${(BASELINE.sleep - sleep).toFixed(1)} h below your baseline`);
  if (level.hr !== "ok") parts.push(`resting heart rate is ${hr} bpm (baseline ${BASELINE.hr})`);
  if (level.spo2 !== "ok") parts.push(`blood oxygen is ${spo2}%`);
  if (level.steps !== "ok") parts.push(`only ${steps.toLocaleString()} steps today`);
  const why = parts.length ? `Why: ${parts.join("; ")}.` : "Why: all readings are within your baseline.";

  const advice = emergencyKey
    ? "Do: follow the Emergency steps now."
    : { ok: "Do: keep today's plan.", warn: "Do: go lighter on cardio and do the strength session earlier.", alert: "Do: stop hard training and contact the ground doctor." }[overall];

  return { level, score, breakdown, capped, overall, emergencyKey, emergencyType, why, advice };
}

// Contact with Earth: is an item waiting in the queue, already sent, or not sent yet?
export const sendState = (c, key) => (c.queue.includes(key) ? "queued" : c.sentLog.includes(key) ? "sent" : "idle");