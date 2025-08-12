import { useState } from "react";
import type { FocusSessionResponse } from "../focusSlice";
import { FocusSessionSidebar } from "./FocusSessionSidebar";

type Props = {
  sessions: FocusSessionResponse[];
  loading?: boolean;
  onDelete?: (id: number) => void; // thêm callback xóa
};

const formatMinutes = (total: number): string => {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  const hrLabel = hours === 1 ? "hr" : "hrs";
  const minLabel = minutes === 1 ? "min" : "mins";

  const hrsText = hours > 0 ? `${hours} ${hrLabel}` : "";
  const minText = minutes > 0 ? `${minutes} ${minLabel}` : "";

  return [hrsText, minText].filter(Boolean).join(" ");
};

export const FocusHistoryCard = ({
  sessions,
  loading = false,
  onDelete,
}: Props) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex h-full flex-col rounded-lg bg-yellow-500 p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Focus History</h2>
        <button onClick={() => setShowSidebar(true)} title="View all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="ml-2 h-6 w-6 text-white mr-4 cursor-pointer hover:text-gray-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
        </button>
      </div>
      {showSidebar && (
        <FocusSessionSidebar
          sessions={sessions}
          onClose={() => setShowSidebar(false)}
          onDelete={onDelete} 
        />
      )}
      <div className="mb-4 h-px w-full bg-yellow-200" />

      <div className="flex h-[300px] flex-col gap-3 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-sm text-white">⏳ Đang tải phiên...</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-white">
            No focus sessions recorded yet. Start your first session!
          </p>
        ) : (
          sessions
            .filter((session) => session.status !== "CANCELLED")
            .map((session) => {
              const isCancelled = session.status === "CANCELLED";
              const date = session.startedAt
                ? new Date(session.startedAt)
                : null;

              const timestamp = date
                ? `${date.toLocaleDateString("en-GB")} • ${date.toLocaleTimeString(
                    "en-GB",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}`
                : "Chưa rõ thời gian";

              return (
                <div
                  key={session.id}
                  className={`relative rounded-md border p-4 shadow-sm transition ${
                    isCancelled
                      ? "border-red-400 bg-red-100 hover:bg-red-200"
                      : "border-amber-300 bg-amber-100 hover:bg-amber-200"
                  }`}
                >
                  {/* Nút X */}
                  <button
                    onClick={() => onDelete?.(session.id)}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-sm text-gray-600 hover:text-red-800"
                    title="Delete session"
                  >
                    ✕
                  </button>

                  <div className="mb-2 text-xs text-amber-800">{timestamp}</div>

                  {session.description && (
                    <div
                      className={`mb-2 text-sm ${
                        isCancelled ? "text-red-700" : "text-slate-800"
                      }`}
                    >
                      {isCancelled ? "⚠️ Interrupted:" : ""}{" "}
                      {session.description}
                    </div>
                  )}

                  <div
                    className={`text-lg font-bold ${
                      isCancelled ? "text-red-700" : "text-amber-900"
                    }`}
                  >
                    {formatMinutes(session.actualMinutes)}
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};
