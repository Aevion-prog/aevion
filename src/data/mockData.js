// Fake data for the demo. Everything here is simulated.
export const astronaut = {
  missionDay: 142,
  weeklyReadiness: [
    { day: "Mon", score: 58 }, { day: "Tue", score: 66 }, { day: "Wed", score: 62 },
    { day: "Thu", score: 70 }, { day: "Fri", score: 68 }, { day: "Sat", score: 74 },
    { day: "Sun", score: 72 },
  ],

  // "at" = where the dot sits on the body, as a share of the body height:
  // y: 0 = feet, 1 = top of head. x: left/right of the middle (+ = viewer's right).
  hotspots: [
    { id: "brain", title: "Brain & sleep", status: "warn", summary: "Sleep below your baseline",
      metrics: [{ label: "Sleep", value: "5.8 h (baseline 7.1 h)" }, { label: "Cognitive test", value: "Not taken today" }],
      at: { x: 0, y: 0.94 }, normal: "0m 0m 1m" },
    { id: "lungs", title: "Lungs", status: "ok", summary: "Breathing normal",
      metrics: [{ label: "Blood oxygen", value: "97%" }, { label: "Cabin CO2", value: "Normal" }],
      at: { x: -0.035, y: 0.72 }, normal: "0m 0m 1m" },
    { id: "heart", title: "Heart", status: "ok", summary: "Within your range",
      metrics: [{ label: "Resting heart rate", value: "62 bpm" }, { label: "Vs baseline", value: "+4 bpm" }],
      at: { x: 0.03, y: 0.7 }, normal: "0m 0m 1m" },
    { id: "bones", title: "Bones", status: "alert", summary: "Weight-bearing exercise is behind",
      metrics: [{ label: "ARED sessions this week", value: "3 of 6" }, { label: "Next session", value: "Today" }],
      at: { x: 0, y: 0.52 }, normal: "0m 0m 1m" },
    { id: "legs", title: "Legs", status: "warn", summary: "Low movement today",
      metrics: [{ label: "Steps today", value: "4,200" }, { label: "Surface goal", value: "68%" }],
      at: { x: 0.05, y: 0.28 }, normal: "0m 0m 1m" },
  ],

  tasks: [
    { id: "ared", type: "Exercise", name: "ARED strength session", action: "Start", goes: "workout" },
    { id: "blood", type: "Lab", name: "Weekly blood sample", action: "Log sample", goes: "labs" },
  ],
  heartAvg: { baseline: 58 },

  // status: "out" = out of range, "in" = in range. Units and ranges are experimental.
  labs: [
    { id: "calcium", name: "Urine calcium", unit: "mg/24h", latest: 280, previous: 240, trend: "Rising", status: "out",
      history: [220, 225, 230, 240, 245, 265, 240, 280], baseline: 240, limit: 260, limitLabel: "Alert limit",
      note: "Gradual rise over 3 weeks. It may relate to bone loss in space. The doctor interprets the result." },
    { id: "vitd", name: "Vitamin D (blood)", unit: "ng/mL", latest: 24, previous: 27, trend: "Declining", status: "in",
      history: [34, 33, 31, 30, 29, 28, 27, 24], baseline: 30, limit: 20, limitLabel: "Low limit",
      note: "Slowly falling but still in range. The doctor decides if supplements are needed." },
    { id: "iron", name: "Iron (blood)", unit: "µg/dL", latest: 95, previous: 96, trend: "Stable", status: "in",
      history: [98, 97, 99, 96, 97, 98, 96, 95], baseline: 97, limit: 60, limitLabel: "Low limit",
      note: "Stable across the last 8 weeks." },
    { id: "glucose", name: "Blood sugar", unit: "mg/dL", latest: 92, previous: 90, trend: "Stable", status: "in",
      history: [88, 90, 89, 91, 90, 92, 90, 92], baseline: 90, limit: 100, limitLabel: "High limit",
      note: "Stable across the last 8 weeks." },
    { id: "sodium", name: "Sodium (blood)", unit: "mmol/L", latest: 139, previous: 140, trend: "Stable", status: "in",
      history: [140, 141, 140, 139, 140, 141, 140, 139], baseline: 140, limit: 135, limitLabel: "Low limit",
      note: "Stable across the last 8 weeks." },
  ],

  workout: {
    sessions: [
      { name: "Virtual run: Martian valley", minutes: 45, startAt: 28 * 60 + 14 },
      { name: "ARED strength", minutes: 60, startAt: 0 },
      { name: "Interval cardio", minutes: 30, startAt: 0 },
    ],
    schedule: [
      { when: "Morning", what: "Interval cardio · 30 min", state: "Done" },
      { when: "Now", what: "Virtual run: Martian valley · 45 min", state: "In progress" },
      { when: "Evening", what: "ARED strength · 60 min", state: "Later" },
    ],
    week: [60, 85, 55, 95, 75, 100, 60],
    steps: { done: 6800, goal: 10000 },
    numbers: [
      { label: "Duration", value: "45:00 min" },
      { label: "Average heart rate", value: "126 (simulated)" },
      { label: "Highest heart rate", value: "158 (simulated)" },
      { label: "Time in target zone", value: "32 min" },
      { label: "Heart rate recovery", value: "Good" },
    ],
  },

  crew: [
    { id: "me", name: "Me" },
    { id: "a2", name: "Astronaut 2", note: "Wristband connected · last reading normal", dot: "ok" },
    { id: "a3", name: "Astronaut 3", note: "Wristband connected · last reading normal", dot: "ok" },
    { id: "a4", name: "Astronaut 4", note: "Wristband not connected", dot: "warn" },
  ],

  // Demo guidance only. Not an official medical protocol.
  emergencyTypes: [
    { id: "heart", title: "Heart & pulse", hint: "Irregular pulse, chest pain", steps: [
      "Steady your body, relax and breathe slowly.",
      "Re-check your pulse after one minute.",
      "Stay near your crewmate. Do not stay alone.",
      "If you do not improve, press “Alert crew”.",
      "Log your symptoms to send to the doctor later." ] },
    { id: "oxygen", title: "Breathing & oxygen", hint: "Short of breath, low oxygen", steps: [
      "Stop activity, sit upright and breathe slowly.",
      "Check the sensor fit and measure again after one minute.",
      "Check cabin oxygen, CO₂ and pressure readings.",
      "Stay near your crewmate. If confused or lips look blue, press “Alert crew”.",
      "Log your symptoms to send to the doctor later." ] },
    { id: "cabin", title: "Cabin environment", hint: "CO₂, pressure or smoke", steps: [
      "Stop work and alert the crew.",
      "Check CO₂, pressure, temperature and smoke readings.",
      "Move to the area marked safe and use emergency equipment as trained.",
      "Follow the cabin emergency checklist.",
      "Log what you saw to send to Earth later." ] },
    { id: "radiation", title: "Radiation", hint: "Solar storm, high dose", steps: [
      "Move to the shielded storm shelter area.",
      "Tell the crew and stay together.",
      "Watch the dose readings and stay until the all-clear.",
      "Log the time and dose to send later.",
      "Follow ground instructions when contact returns." ] },
    { id: "injury", title: "Injury or fall", hint: "Cut, bruise, bump", steps: [
      "Stop and stay still. Do not move if you have neck or back pain.",
      "Press firmly on any bleeding with clean gauze.",
      "Call the crew to help.",
      "Get the medical kit and follow its checklist.",
      "Log what happened to send to the doctor later." ] },
    { id: "unresponsive", title: "Crewmate not responding", hint: "Unconscious, not moving", steps: [
      "Check if they respond and are breathing.",
      "Call the crew immediately.",
      "Get the medical kit.",
      "If not breathing, start CPR as you were trained.",
      "Log the time to send to the doctor later." ] },
    { id: "manual", title: "Emergency", hint: "", steps: [
      "Stay calm and tell the nearest crewmate.",
      "Stop what you are doing and get into a safe position.",
      "Stay near your crewmate.",
      "Follow the onboard medical checklist.",
      "Log what happened to send to the doctor later." ] },
  ],
};