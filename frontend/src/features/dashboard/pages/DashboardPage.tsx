import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { useEffect } from "react";
import { fetchAllUserFocusStatsThunk } from "../../focus/focusSlice";
import { fetchAssignedTasksThunk } from "../../team/kanbanSlice";
import { fetchUserSubscriptionThunk } from "../../subscription/subscriptionSlice";
import { UserStatusCard } from "../components/UserStatusCard";
import { AssignedTaskList } from "../components/AssignedTaskList";
import { FloatingFocusLeaderboard } from "../components/FloatingFocusLeaderboard";
import { FocusDonutChart } from "../components/FocusDonutChart";
import { WeeklyBarChart } from "../components/WeeklyBarChart";

export const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchAllUserFocusStatsThunk());
    dispatch(fetchAssignedTasksThunk());
    dispatch(fetchUserSubscriptionThunk());
  }, [dispatch]);

  if (!user) return null;

  return (
    <div className="relative min-h-screen bg-yellow-50 px-6 py-12 md:px-12 md:py-16">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-yellow-900">
          Have a nice day, {user.firstname}
        </h1>
        <p className="mt-2 text-sm text-yellow-700">
          Here's your personal productivity dashboard
        </p>
        <div className="mt-2 flex gap-2">
          {[...Array(3)].map((_, idx) => (
            <span key={idx} className="h-2 w-2 rounded-full bg-yellow-400" />
          ))}
        </div>
        <div className="mt-4">
          <UserStatusCard user={user} />
        </div>
      </header>

      {/* Task list */}
      <section className="mt-10">
        <AssignedTaskList />
      </section>

      {/* Biểu đồ tập trung */}
      <section className="mt-12">
        <h2 className="relative mb-5 flex items-center gap-3 rounded py-2 pl-5 text-[15px] font-semibold tracking-widest text-slate-800 uppercase">
          <span className="absolute top-0 left-0 h-full w-1 bg-yellow-400" />
          <span className="relative z-10">Mind On Time</span>
        </h2>
        <FocusDonutChart />
      </section>

      {/* Biểu đồ tuần - cột */}
      <section className="mt-12">
        {/* <h2 className="relative mb-5 flex items-center gap-3 rounded py-2 pl-5 text-[15px] font-semibold tracking-widest text-slate-800 uppercase">
          <span className="absolute top-0 left-0 h-full w-1 bg-yellow-400" />
          <span className="relative z-10">Weekly Focus Overview</span>
        </h2> */}
        <WeeklyBarChart />
      </section>

      {/* Nút mở sidebar leaderboard */}
      <FloatingFocusLeaderboard />
    </div>
  );
};
