import { useAppSelector } from "../../../state/hooks";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useState } from "react";

dayjs.extend(isoWeek); // 🧠 để tuần bắt đầu từ Thứ Hai

export const TeamCalendar = () => {
  const calendarDays = useAppSelector((state) => state.team.calendar);
  const [monthOffset, setMonthOffset] = useState(0);

  const baseDate = dayjs().add(monthOffset, "month");
  const startOfMonth = baseDate.startOf("month").startOf("isoWeek");
  const endOfMonth = baseDate.endOf("month").endOf("isoWeek");

  const totalDays = endOfMonth.diff(startOfMonth, "day") + 1;
  const monthDates = Array.from({ length: totalDays }, (_, i) =>
    startOfMonth.add(i, "day"),
  );

  const currentMonth = baseDate.month();
  const today = dayjs();
  const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <div className="flex flex-col gap-4">
      {/* 📆 Header */}
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold text-slate-800">
          {baseDate.format("MMMM")}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMonthOffset(monthOffset - 1)}
            className="rounded-md border px-2 py-1 hover:bg-slate-100"
          >
            «
          </button>
          <button
            onClick={() => setMonthOffset(0)}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Today • {today.format("D MMM YYYY")}
          </button>
          <button
            onClick={() => setMonthOffset(monthOffset + 1)}
            className="rounded-md border px-2 py-1 hover:bg-slate-100"
          >
            »
          </button>
        </div>
      </div>

      {/* 🗓️ Tuần */}
      <div className="grid grid-cols-7 border-b pb-2 gap-2 text-left text-xs font-medium text-slate-500 uppercase">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* 📦 Lưới ngày */}
      <div className="grid grid-cols-7 gap-2">
        {monthDates.map((date) => {
          const iso = date.format("YYYY-MM-DD");
          const isCurrentMonth = date.month() === currentMonth;
          if (!isCurrentMonth) return <div key={iso} />; // ❌ Ẩn ô ngoài tháng

          const matched = calendarDays.find((d) => d.date === iso);
          const taskCount = matched?.taskCount ?? 0;
          const isToday = date.isSame(today, "day");

          return (
            <div
              key={iso}
              className={`h-24 rounded-lg border p-2 text-sm shadow-sm transition ${
                isToday
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-slate-200 bg-white hover:shadow-md"
              }`}
            >
              <div className="font-semibold text-slate-700">
                {date.format("D")}
              </div>
              <div className="mt-1 text-xs text-yellow-700">
                {taskCount > 0 &&
                  `• ${taskCount} Task${taskCount > 1 ? "s" : ""}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
