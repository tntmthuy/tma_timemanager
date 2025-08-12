import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { fetchSubscriptions } from "../adminSubscriptionSlice";
import dayjs from "dayjs";

const getPlanAmount = (planType: "WEEKLY" | "MONTHLY" | "YEARLY"): number => {
  switch (planType) {
    case "WEEKLY":
      return 1.0;
    case "MONTHLY":
      return 3.0;
    case "YEARLY":
      return 25.0;
    default:
      return 0;
  }
};

const PaymentsLite = () => {
  const dispatch = useAppDispatch();
  const { list: subscriptions, loading } = useAppSelector(
    (state) => state.adminSubscription,
  );

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  const paidSubs = subscriptions
    .filter((s) => s.status === "ACTIVE")
    .map((s) => ({
      ...s,
      amount: getPlanAmount(s.planType),
    }));

  const filteredSubs = [...paidSubs]
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    )
    .filter((item) => {
      const itemDate = new Date(item.startDate);
      const from = startDate ? new Date(startDate) : null;
      const to = endDate ? new Date(endDate) : null;
      return (!from || itemDate >= from) && (!to || itemDate <= to);
    });

  return (
    <div className="min-h-screen bg-yellow-50 p-8 text-yellow-900">
      {/* 🔰 Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <p className="mt-2 text-sm text-yellow-700">
          A snapshot of all active payment subscriptions.
        </p>
        <div className="mt-2 flex gap-2">
          {[...Array(3)].map((_, idx) => (
            <span key={idx} className="h-2 w-2 rounded-full bg-yellow-400" />
          ))}
        </div>
        <p className="mt-6 rounded-md bg-amber-200 p-3 font-semibold">
          A total of <strong>{filteredSubs?.length ?? 0}</strong> active payment
          transactions match your filter.
        </p>
      </header>

      {/* 🗓️ Filter by Start Date */}
      <div className="mb-6 rounded-md bg-amber-200 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 overflow-x-auto">
          <span className="text-sm font-semibold whitespace-nowrap text-gray-700">
            Start Date:
          </span>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-[150px] rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="dd/mm/yyyy"
          />

          <span className="text-gray-500">→</span>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-[150px] rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="dd/mm/yyyy"
          />

          {/* View All Button */}
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            className="rounded bg-amber-300 px-4 py-2 text-sm font-semibold text-yellow-800 shadow hover:bg-yellow-200"
          >
            View All
          </button>
        </div>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto rounded-md bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-yellow-200 font-semibold text-yellow-900">
            <tr>
              <th className="px-4 py-2 text-left">Payment ID</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Start Date</th>
              <th className="px-4 py-2 text-left">End Date</th>
              <th className="px-4 py-2 text-left">Plan Type</th>
              <th className="px-4 py-2 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-yellow-600 italic"
                >
                  Loading subscriptions...
                </td>
              </tr>
            ) : filteredSubs.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-4 text-center text-gray-500 italic"
                >
                  No paid transactions found.
                </td>
              </tr>
            ) : (
              filteredSubs.map((item) => (
                <tr
                  key={item.paymentId}
                  className="border-b transition hover:bg-yellow-50"
                >
                  <td className="px-4 py-2 font-mono text-xs">
                    {item.paymentId}
                  </td>
                  <td className="flex items-center gap-2 px-4 py-2">
                    <span title={item.fullName}>
                      <img
                        src={item.avatarUrl}
                        alt="avatar"
                        className="h-6 w-6 rounded-full"
                      />
                    </span>
                    <span className="text-sm" title={item.fullName}>
                      {item.userName}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {dayjs(item.startDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-2">
                    {dayjs(item.endDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-2">{item.planType}</td>
                  <td className="px-4 py-2">{item.amount.toFixed(2)}$</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsLite;
