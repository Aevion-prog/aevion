// The demo story, step by step. Edit the texts and numbers to change the story.
// Each step describes the WHOLE state of the app, so Back and Next always work.
const REPORT = "Emergency report: Heart & pulse";
const NORMAL = { sleep: 5.8, hr: 62, spo2: 97, steps: 4200 };
const base = { page: "home", vals: NORMAL, em: null, online: false, queue: [], sentLog: [], synced: null, eventToday: false };
const heart = (done, extra = {}) => ({ stage: "active", who: ["me"], type: "heart", auto: true, done, ...extra });

export const SCENARIO = [
  {
    title: "08:00 · A normal morning on Mars, day 142",
    say: "Readiness is 72 (yellow) because sleep is below the astronaut's own baseline. Tap the score to see exactly why.",
    state: { ...base },
  },
  {
    title: "14:20 · Warning: the pulse is climbing",
    say: "The wristband sees a resting pulse of 108, far above this astronaut's baseline of 58. Everything turns red with a reason and an action. No contact with Earth is needed.",
    state: { ...base, vals: { ...NORMAL, hr: 108 } },
  },
  {
    title: "14:32 · Emergency: irregular pulse of 138",
    say: "The reading crosses the emergency line, so the Emergency screen opens by itself with steps saved on the device. Alerts go Info, then Warning, then Emergency.",
    state: { ...base, vals: { ...NORMAL, hr: 138 }, page: "emergency", em: heart(0) },
  },
  {
    title: "The crew is alerted and the first step is done",
    say: "One tap alerts the crew. A crewmate is on the way while the astronaut keeps following the steps. Everything is saved offline.",
    state: { ...base, vals: { ...NORMAL, hr: 138 }, page: "emergency", em: heart(1, { crewAlerted: true }) },
  },
  {
    title: "One minute later: the pulse is re-checked",
    say: "The pulse is down to 112. The dashboard follows the readings live. The report waits in the queue for Earth.",
    state: { ...base, vals: { ...NORMAL, hr: 112 }, page: "emergency", em: heart(2, { crewAlerted: true }) },
  },
  {
    title: "All steps done: the pulse is near normal",
    say: "The pulse is 92 and every step is done. The astronaut can end the emergency.",
    state: { ...base, vals: { ...NORMAL, hr: 92 }, page: "emergency", em: heart(5, { crewAlerted: true }) },
  },
  {
    title: "Emergency ended: a recovery day",
    say: "The red is gone, but the app remembers the event. The score drops 20 points and the advice becomes a rest day. The workout is blocked.",
    state: { ...base, vals: { ...NORMAL, hr: 74 }, queue: [REPORT], eventToday: true },
  },
  {
    title: "Contact with Earth returns",
    say: "Everything waiting is sent automatically: the vital data, the time of the event and the steps followed. The doctor on Earth gets organized data.",
    state: { ...base, vals: { ...NORMAL, hr: 74 }, online: true, sentLog: [REPORT], synced: 1, eventToday: true },
  },
];