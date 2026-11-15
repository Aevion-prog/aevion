import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer,
} from "recharts";

export function HeartDonut({ value, baseline }) {
  const data = [{ v: value }, { v: 100 - value }];
  return (
    <div className="donutwrap">
    <div className="donut">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="v" innerRadius="68%" outerRadius="92%" startAngle={90} endAngle={-270} stroke="none">
            <Cell fill="#7DD3FC" />
            <Cell fill="#1E4A78" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="donut-label">
        <strong>{value}</strong>
        <span>bpm</span>
      </div>
    </div>
    <span className="small muted">Your baseline: {baseline} bpm</span>
    </div>
  );
}

export function ReadinessLine({ data }) {
  return (
    <div className="chart">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid stroke="#1E4A78" vertical={false} />
        <XAxis dataKey="day" stroke="#A9BED3" tickLine={false} />
        <YAxis domain={[50, 90]} ticks={[55, 70, 85]} stroke="#A9BED3" tickLine={false} width={32} />
        <Line type="monotone" dataKey="score" stroke="#7DD3FC" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
    </div>
  );
}

export function LabChart({ lab }) {
  const data = lab.history.map((value, i) => ({ week: i + 1, value }));
  const all = [...lab.history, lab.baseline, lab.limit];
  const pad = (Math.max(...all) - Math.min(...all)) * 0.15 || 5;
  const domain = [Math.floor(Math.min(...all) - pad), Math.ceil(Math.max(...all) + pad)];
  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 24, left: 0, bottom: 8 }}>
          <CartesianGrid stroke="#1E4A78" vertical={false} />
          <XAxis dataKey="week" stroke="#A9BED3" tickLine={false} />
          <YAxis stroke="#A9BED3" tickLine={false} width={44} domain={domain} />
          <ReferenceLine y={lab.baseline} stroke="#7DD3FC" strokeDasharray="6 4"
            label={{ value: "Your baseline", fill: "#7DD3FC", fontSize: 12, position: "insideTopLeft" }} />
          <ReferenceLine y={lab.limit} stroke="#FBBF24" strokeDasharray="6 4"
            label={{ value: lab.limitLabel, fill: "#FBBF24", fontSize: 12, position: "insideBottomLeft" }} />
          <Line type="linear" dataKey="value" stroke="#E8F1FA" strokeWidth={2} dot={{ r: 4, fill: "#E8F1FA" }}
            label={{ position: "top", fill: "#E8F1FA", fontSize: 12 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}