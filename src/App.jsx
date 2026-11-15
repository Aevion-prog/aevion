
import { useEffect, useState } from "react";
import { astronaut as a } from "./data/mockData";
import { evaluate, parse, DEFAULTS } from "./logic/rules";
import Header from "./components/Header";
import ReadingsPanel from "./components/ReadingsPanel";
import Home from "./pages/Home";
import Workout from "./pages/Workout";
import Labs from "./pages/Labs";
import LabDetail from "./pages/LabDetail";
import Emergency from "./pages/Emergency";
import "./App.css";
import "./pages.css";

export default function App() {
  const [page, setPage] = useState("home");
  const [labId, setLabId] = useState("calcium");
  const [vals, setVals] = useState(DEFAULTS);
  const [showReadings, setShowReadings] = useState(false);
  const [online, setOnline] = useState(false);
  const [queue, setQueue] = useState([]);
  const [sentLog, setSentLog] = useState([]);
  const [synced, setSynced] = useState(null);
  const [lastSafe, setLastSafe] = useState(DEFAULTS);
  const [em, setEm] = useState(null);

  // Local crew alert history
  const [crewAlerts, setCrewAlerts] = useState([]);

  const v = parse(vals);
  const r = evaluate(v);

  // Save an alert to the local crew notification log.
  const alertCrew = (details) => {
    const event = {
      id: Date.now(),
      type: details.type,
      readings: details.readings,
      time: new Date().toLocaleTimeString(),
      message: "Emergency alert sent to the crew.",
    };

    setCrewAlerts((previous) => [...previous, event]);
  };

  // Send reports to Earth or save them until contact returns.
  const send = (item) =>
    online
      ? setSentLog((s) => s.includes(item) ? s : [...s, item])
      : setQueue((q) => q.includes(item) ? q : [...q, item]);

  const toggleContact = () => {
    if (!online && queue.length) {
      setSentLog((s) => [
        ...s,
        ...queue.filter((x) => !s.includes(x)),
      ]);
      setSynced(queue.length);
      setQueue([]);
    } else {
      setSynced(null);
    }

    setOnline(!online);
  };

  const contact = { online, queue, sentLog, send };

  const go = (p, id) => {
    if (id) setLabId(id);
    setPage(p);
  };

  const startEmergency = () => {
    setEm({
      stage: "who",
      who: ["me"],
      type: null,
      crewAlerted: false,
    });
    setPage("emergency");
  };

  const endEmergency = () => {
    if (r.emergencyKey) setVals(lastSafe);
    setEm(null);
    setPage("home");
  };

  useEffect(() => {
    if (!r.emergencyKey) setLastSafe(vals);
  }, [vals, r.emergencyKey]);

  // Automatically open emergency when a dangerous reading is detected.
  useEffect(() => {
    if (r.emergencyType) {
      setEm({
        stage: "active",
        who: ["me"],
        type: r.emergencyType,
        auto: true,
        crewAlerted: false,
      });
      setPage("emergency");
    }
  }, [r.emergencyType]);

  const badLab = a.labs.find((l) => l.status === "out");

  let banner = null;

  if (page !== "emergency") {
    if (r.overall === "alert") {
      banner = {
        tone: "alert",
        text: `${r.why} ${r.advice}`,
        label: "Open Emergency",
        act: startEmergency,
      };
    } else if (badLab && page !== "labs" && page !== "lab") {
      banner = {
        tone: "warn",
        text: `${badLab.name} is out of range.`,
        label: "View result",
        act: () => go("lab", badLab.id),
      };
    }
  }

  return (
    <div className="page">
      <Header
        page={page}
        go={go}
        subtitle={`Mission day ${a.missionDay} · Simulated data`}
        onReadings={() => setShowReadings(true)}
        onEmergency={em ? () => setPage("emergency") : startEmergency}
        emergencyOn={!!r.emergencyType || !!em}
        contact={contact}
        synced={synced}
        onToggleContact={toggleContact}
      />

      {banner && (
        <div className={`banner ${banner.tone}`} role="alert">
          <span>{banner.text}</span>
          <button className="btn-small" onClick={banner.act}>
            {banner.label}
          </button>
        </div>
      )}

      {page === "home" && <Home v={v} r={r} go={go} />}
      {page === "workout" && <Workout />}
      {page === "labs" && <Labs go={go} contact={contact} />}
      {page === "lab" && (
        <LabDetail id={labId} go={go} contact={contact} />
      )}

      {page === "emergency" && em && (
        <Emergency
          em={em}
          setEm={setEm}
          v={v}
          r={r}
          onExit={endEmergency}
          contact={contact}
          onAlertCrew={alertCrew}
          crewAlerts={crewAlerts}
        />
      )}

      {showReadings && (
        <ReadingsPanel
          vals={vals}
          setVals={setVals}
          onClose={() => setShowReadings(false)}
        />
      )}
    </div>
  );
}
