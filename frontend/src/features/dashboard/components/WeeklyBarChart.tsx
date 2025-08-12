import { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { fetchWeeklyFocusComparisonThunk } from "../../../features/focus/focusSlice";

export const WeeklyBarChart = () => {
  const dispatch = useAppDispatch();
  const weeklyComparison = useAppSelector(
    (state) => state.focus.weeklyComparison,
  );

  useEffect(() => {
    dispatch(fetchWeeklyFocusComparisonThunk());
  }, [dispatch]);

  const formatChartData = () => {
    const weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    return weekdays.map((day) => ({
      name: day.charAt(0).toUpperCase() + day.slice(1), // "Mon", "Tue"...
      thisWeek: weeklyComparison?.thisWeek?.[day] ?? 0,
      lastWeek: weeklyComparison?.lastWeek?.[day] ?? 0,
    }));
  };

  const data = formatChartData();
  const formatMinutes = (value: number) => {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };
  return (
    <div className="rounded-xl bg-amber-100 p-6 shadow-sm">
      <h2 className="mb-4 text-sm text-center font-semibold text-slate-800 uppercase">
        Weekly Focus Chart
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, bottom: 20, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number) => formatMinutes(value)} />
          <Legend />
          <Bar
            dataKey="lastWeek"
            fill="#22D3EE"
            name="Last Week"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="thisWeek"
            fill="#F472B6"
            name="This Week"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
