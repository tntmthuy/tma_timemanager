import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { fetchDashboardSummary } from "../dashboardSlice";
import DashboardBarChart from "./DashboardBarchart";
import PaymentBarChart from "./PaymentBarChart";

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { totalUsers, totalTeams, totalFocusSessions, loadingSummary, error } =
    useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-yellow-50 p-8 text-yellow-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-yellow-700">
          A quick snapshot of system usage and statistics.
        </p>

        <div className="mt-2 flex gap-2">
          {[...Array(3)].map((_, idx) => (
            <span key={idx} className="h-2 w-2 rounded-full bg-yellow-400" />
          ))}
        </div>

        <p className="mt-6 rounded-md bg-amber-200 p-3 font-semibold">
          Summary reflects <strong>total usage</strong> across all time.
        </p>
      </div>

      {loadingSummary ? (
        <p className="text-yellow-600">Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-600">Lỗi: {error}</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          <StatBox title="Total Users" value={totalUsers.toLocaleString()} />
          <StatBox
            title="Total Teams Created"
            value={totalTeams.toLocaleString()}
          />
          <StatBox
            title="Total Focus Sessions"
            value={totalFocusSessions.toLocaleString()}
          />
        </div>
      )}

      {!loadingSummary && !error && (
        <>
          <div className="mt-8">
            <DashboardBarChart />
          </div>
          <div className="mt-12">
            <PaymentBarChart /> {/* 👈 Biểu đồ giao dịch hiển thị ở đây */}
          </div>
        </>
      )}
    </div>
  );
};

const StatBox = ({ title, value }: { title: string; value: string }) => (
  <div className="rounded-md border border-yellow-200 bg-yellow-100 px-6 py-5 shadow-sm transition hover:bg-yellow-200">
    <h2 className="text-sm font-semibold text-yellow-800">{title}</h2>
    <p className="mt-2 text-2xl font-bold text-yellow-900">{value}</p>
  </div>
);
