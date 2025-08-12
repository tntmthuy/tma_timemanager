import { useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { fetchDayComparisonThunk } from "../../../features/focus/focusSlice";

const COLORS = {
  todayFocus: "#F472B6", // hồng
  yesterdayFocus: "#22D3EE", // xanh cyan
  remaining: "#CBD5E1", // xám
};

export const FocusDonutChart = () => {
  const dispatch = useAppDispatch();
  const dayComparison = useAppSelector((state) => state.focus.dayComparison);

  useEffect(() => {
    dispatch(fetchDayComparisonThunk());
  }, [dispatch]);

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const yesterdayMinutes = dayComparison?.yesterday.minutes ?? 0;
  const todayMinutes = dayComparison?.today.minutes ?? 0;

  const yesterdayData = [
    { value: yesterdayMinutes, color: COLORS.yesterdayFocus },
    { value: 480 - yesterdayMinutes, color: COLORS.remaining },
  ];

  const todayData = [
    { value: todayMinutes, color: COLORS.todayFocus },
    { value: 480 - todayMinutes, color: COLORS.remaining },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {/* Yesterday Card */}
      <div className="rounded-xl bg-cyan-100/70 p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-yellow-800 uppercase">
          Yesterday’s Focus
        </h3>
        <div className="relative">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={yesterdayData}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={5}
                dataKey="value"
              >
                {yesterdayData.map((entry, index) => (
                  <Cell key={`y-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center text-base font-semibold text-yellow-700">
            {formatTime(yesterdayMinutes)}
          </div>
        </div>
      </div>

      {/* Today Card */}
      <div className="rounded-xl bg-pink-100/70 p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-pink-800 uppercase">
          Today’s Focus
        </h3>
        <div className="relative">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={todayData}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={5}
                dataKey="value"
              >
                {todayData.map((entry, index) => (
                  <Cell key={`t-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center text-base font-semibold text-pink-700">
            {formatTime(todayMinutes)}
          </div>
        </div>
      </div>
    </div>
  );
};
