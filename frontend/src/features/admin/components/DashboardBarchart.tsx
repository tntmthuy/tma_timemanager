import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchChartData } from "../dashboardSlice";
import type { AppDispatch, RootState } from "../../../state/store";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const getWeekRangeFromDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const format = (d: Date) => d.toISOString().slice(0, 10);
  return { fromDate: format(monday), toDate: format(sunday) };
};

const DashboardBarChart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { chartData, loadingChart, error } = useSelector((state: RootState) => state.dashboard);

  const [range, setRange] = useState<"day" | "week" | "month">("week");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    if (range === "day" && selectedDate) {
      dispatch(fetchChartData({ range: "day", fromDate: selectedDate, toDate: selectedDate }));
    } else if (range === "week" && selectedDate) {
      const { fromDate, toDate } = getWeekRangeFromDate(selectedDate);
      dispatch(fetchChartData({ range: "week", fromDate, toDate }));
    } else if (range === "month") {
      dispatch(fetchChartData({ range: "month", month: selectedMonth, year: selectedYear }));
    }
  }, [dispatch, range, selectedDate, selectedMonth, selectedYear]);

  const labels = chartData.map((point) => {
    const d = new Date(point.date);
    return d.getDate().toString().padStart(2, "0");
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Users",
        data: chartData.map((p) => p.totalUsers),
        backgroundColor: "#f87171",
      },
      {
        label: "Teams",
        data: chartData.map((p) => p.totalTeams),
        backgroundColor: "#60a5fa",
      },
      {
        label: "Focus Sessions",
        data: chartData.map((p) => p.totalFocusSessions),
        backgroundColor: "#facc15",
      },
    ],
  };

  const rangeLabelMap: Record<"day" | "week" | "month", string> = {
    day: "Day View",
    week: "Weekly Overview",
    month: "Monthly Summary",
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: `Usage Summary · ${rangeLabelMap[range]}`,
      },
    },
  };

  return (
    <div className="mt-10 rounded-lg bg-yellow-100 p-6 shadow-md">
      <h2 className="mb-2 text-xl font-bold text-yellow-800">System Usage Overview</h2>
      <p className="mb-6 text-sm text-yellow-700">
        Aggregated statistics showing user engagement, team creation, and focus sessions over time.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-6">
        {/* Statistic mode selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700">Statistics by:</label>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as "day" | "week" | "month")}
            className="rounded border bg-white px-3 py-1 text-sm text-gray-700"
          >
            <option value="day">Day</option>
            <option value="week">Week (by day)</option>
            <option value="month">Month</option>
          </select>
        </div>

        {(range === "day" || range === "week") && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">
              {range === "day" ? "Select date:" : "Pick any date within the week:"}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded border bg-white px-3 py-1 text-sm text-gray-700"
            />
          </div>
        )}

        {range === "month" && (
          <>
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-700">Month:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="rounded border bg-white px-3 py-1 text-sm text-gray-700"
              >
                {[
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"
                ].map((monthName, index) => (
                  <option key={monthName} value={index + 1}>
                    {monthName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-700">Year:</label>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-[80px] rounded border bg-white px-2 py-1 text-sm text-gray-700"
              />
            </div>
          </>
        )}
      </div>

      {/* Chart rendering */}
      {loadingChart ? (
        <p className="text-yellow-600">Loading chart...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : chartData.length === 0 ? (
        <p>No chart data available.</p>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
};

export default DashboardBarChart;