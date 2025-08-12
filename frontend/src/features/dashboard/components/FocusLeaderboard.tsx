import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { fetchWeeklyStatsAllUsersThunk } from "../../focus/focusSlice";

export const FocusLeaderboard = () => {
  const dispatch = useAppDispatch();
  const userStats = useAppSelector((state) => state.focus.userStats);
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchWeeklyStatsAllUsersThunk());
  }, [dispatch]);

  const sortedStats = [...userStats].sort((a, b) =>
    b.totalMinutes !== a.totalMinutes
      ? b.totalMinutes - a.totalMinutes
      : a.name.localeCompare(b.name),
  );
  const currentUserRank = sortedStats.findIndex(
    (user) => user.userId === currentUser?.id,
  );
  const toHourMinute = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    return (
      <>
        {h > 0 && (
          <>
            <span className="font-semibold text-yellow-600">{h}</span>
            <span className="font-semibold text-yellow-600">
              {h === 1 ? "h" : "h "}
            </span>
          </>
        )}
        <span className="font-semibold text-yellow-600">{m}</span>
        <span className="font-semibold text-yellow-600">m</span>
      </>
    );
  };

  const getInitialAvatar = (name: string) => {
    const firstChar = name?.trim()?.charAt(0)?.toUpperCase() ?? "?";
    const bgColors = [
      "bg-yellow-400",
      "bg-orange-400",
      "bg-pink-400",
      "bg-green-400",
    ];
    const color = bgColors[firstChar.charCodeAt(0) % bgColors.length];

    return (
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${color}`}
      >
        {firstChar}
      </div>
    );
  };

  return (
    <section className="w-full px-2 pt-2">
      <div className="rounded-lg border border-yellow-300 bg-white shadow-sm">
        <table className="min-w-full text-xs">
          <thead className="bg-yellow-300 text-[11px] font-medium text-yellow-900 uppercase">
            <tr>
              <th className="px-3 py-2 text-left">Rank</th>
              <th className="px-3 py-2 text-left">User</th>
              <th className="px-3 py-2 text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((user, idx) => {
              const rowStyle =
                idx === 0
                  ? "bg-yellow-100 font-bold"
                  : idx === 1
                    ? "bg-yellow-50"
                    : "";

              return (
                <tr
                  key={idx}
                  className={`border-t border-slate-200 ${rowStyle}`}
                >
                  <td className="px-3 py-2">#{idx + 1}</td>
                  <td className="flex items-center gap-2 px-3 py-2">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      getInitialAvatar(user.name)
                    )}
                    <span className="text-[13px]">{user.name}</span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {toHourMinute(user.totalMinutes)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {currentUserRank >= 0 && (
        <div className="mt-6">
          <div className="mx-auto flex w-full max-w-md items-center justify-between rounded-xl border border-yellow-300 bg-yellow-100 px-5 py-4 shadow-md">
            <span className="text-sm font-medium text-yellow-700">
              Your rank
            </span>
            <span className="text-2xl font-bold text-yellow-800">
              #{currentUserRank + 1}
            </span>
            <span className="text-sm text-yellow-600">this week</span>
          </div>
        </div>
      )}
    </section>
  );
};
