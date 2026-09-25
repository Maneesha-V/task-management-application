import { useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loadStats } from "../../features/stats/statsSlice";


const STATUS_COLORS: Record<string, string> = {
  "To do": "#94A3B8",
  "In progress": "#F59E0B",
  "Done": "#10B981",
};

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex-1 rounded-lg border border-slate-700 bg-surface p-4">
    <p className="text-xs text-slate-400">{label}</p>
    <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
  </div>
);

const StatsChart = () => {
  const dispatch = useAppDispatch();
  const { data, status } = useAppSelector((state) => state.stats);

  useEffect(() => {
    dispatch(loadStats());
  }, [dispatch]);

  if (status === "loading" || !data) {
    return <p className="mb-8 text-sm text-slate-400">Loading stats...</p>;
  }
  console.log({status, data});
  
  const pieData = [
    { name: "To do", value: data.byStatus.todo },
    { name: "In progress", value: data.byStatus["in-progress"] },
    { name: "Done", value: data.byStatus.done },
  ].filter((d) => d.value > 0);
console.log(pieData);

  return (
    <div className="mb-10 flex flex-col gap-4">
      <div className="flex gap-3">
        <StatCard label="Total tasks" value={data.total} />
        <StatCard label="Overdue" value={data.overdue} />
        <StatCard label="Completion rate" value={`${data.completionRate}%`} />
      </div>

      {pieData.length > 0 ? (
        <div className="rounded-lg border border-slate-700 bg-surface p-4">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#111318",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-slate-700 p-6 text-center text-sm text-slate-500">
          No tasks yet — add some to see stats here.
        </p>
      )}
    </div>
  );
};

export default StatsChart;
