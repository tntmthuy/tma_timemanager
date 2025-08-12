// src/components/FocusCalendar.tsx
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import type { FocusSessionResponse } from "../focusSlice";
import { useState } from "react";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Props = {
  sessions: FocusSessionResponse[];
};

export const FocusCalendar = ({ sessions }: Props) => {
  const [baseMonth, setBaseMonth] = useState(new Date());

  const focusedDates = sessions
    .filter((s) => s.status !== "CANCELLED" && s.startedAt)
    .map((s) => new Date(s.startedAt));

  const isFocusedDate = (date: Date) =>
    focusedDates.some((d) => isSameDay(d, date));

  const renderMonth = (
    monthDate: Date,
    showLeftArrow?: boolean,
    showRightArrow?: boolean,
  ) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startOffset = (getDay(monthStart) + 6) % 7;

    return (
      <div className="flex flex-col items-center rounded-lg bg-white/30 p-4 shadow-sm backdrop-blur-[1px]">
        {" "}
        {/* Header tháng */}
        <div className="mb-4 flex w-full items-center justify-between">
          {showLeftArrow ? (
            <button
              onClick={() => setBaseMonth(subMonths(baseMonth, 1))}
              className="text-2xl text-yellow-700 hover:text-yellow-900"
            >
              ←
            </button>
          ) : (
            <div className="w-6" />
          )}

          <h3 className="text-lg font-bold text-yellow-900">
            {format(monthDate, "MMMM")}
          </h3>

          {showRightArrow ? (
            <button
              onClick={() => setBaseMonth(addMonths(baseMonth, 1))}
              className="text-2xl text-yellow-700 hover:text-yellow-900"
            >
              →
            </button>
          ) : (
            <div className="w-6" />
          )}
        </div>
        {/* Tiêu đề thứ trong tuần */}
        <div className="mb-2 grid grid-cols-7 gap-2">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="flex h-8 w-8 items-center justify-center text-xs font-bold text-yellow-800"
            >
              {day}
            </div>
          ))}
        </div>
        {/* Các ngày */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startOffset }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="flex h-8 w-8 items-center justify-center"
            />
          ))}

          {daysInMonth.map((day) => {
            const dayLabel = format(day, "d");
            const focused = isFocusedDate(day);
            const todayMark = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium transition ${
                  focused
                    ? "border-yellow-600 bg-orange-500 text-white"
                    : "border-gray-200 text-yellow-900"
                } ${todayMark ? "ring-2 ring-orange-800" : ""} hover:bg-orange-400 hover:text-white`}
                title={focused ? "Focused on this day" : ""}
              >
                {dayLabel}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className="mt-6 rounded-lg border border-yellow-200 p-6 shadow-md"
      style={{
        backgroundImage: "url('/images/calendar.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center bottom",
        backgroundColor: "rgba(255, 247, 209, 0.95)",
      }}
    >
      {" "}
      <h2 className="mb-6 text-center text-2xl font-bold text-yellow-900">
        {format(baseMonth, "yyyy")}
      </h2>
      {/* 📅 Hiển thị 3 tháng */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {renderMonth(baseMonth, true, false)}
        {renderMonth(addMonths(baseMonth, 1))}
        {renderMonth(addMonths(baseMonth, 2), false, true)}
      </div>
    </div>
  );
};
