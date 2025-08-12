import { useEffect, useState } from "react";
import type { FocusSessionResponse } from "../focusSlice";

type Props = {
  sessions: FocusSessionResponse[];
  onClose: () => void;
  onDelete?: (id: number) => void;
};

export const FocusSessionSidebar = ({ sessions, onClose, onDelete }: Props) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose]);

  const formatMinutes = (total: number): string => {
    const hours = Math.floor(total / 60);
    const minutes = total % 60;

    const hrLabel = hours === 1 ? "hr" : "hrs";
    const minLabel = minutes === 1 ? "min" : "mins";

    const hrsText = hours > 0 ? `${hours} ${hrLabel}` : "";
    const minText = minutes > 0 ? `${minutes} ${minLabel}` : "";

    return [hrsText, minText].filter(Boolean).join(" ");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{
        backgroundColor: "rgba(0,0,0,0.1)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        className={`flex h-full w-[400px] flex-col shadow-lg ${
          isClosing ? "animate-slideout" : "animate-slidein"
        }`}
        style={{
          backgroundImage: "url('/images/focus1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "rgba(255,255,255,0.9)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-6 shadow-sm">
          <div>
            <h2 className="mb-1 text-xs font-semibold tracking-wide text-yellow-900 uppercase">
              All Focus Sessions
            </h2>
            <p className="text-[11px] text-gray-700">
              Here’s a complete log of your focus sessions. Reflect on your
              journey, celebrate your progress, and keep going strong!
            </p>
          </div>
          <button
            onClick={() => setIsClosing(true)}
            className="text-sm text-yellow-700 transition hover:scale-[1.05] hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {sessions.length === 0 ? (
            <p className="text-sm text-gray-600">No sessions recorded.</p>
          ) : (
            sessions.map((session) => {
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
                : "Unknown time";

              return (
                <div
                  key={session.id}
                  className="relative mb-4 rounded-md border border-yellow-300 bg-yellow-100 p-3 hover:bg-yellow-200"
                >
                  {/* Nút X để xóa */}
                  <button
                    onClick={() => onDelete?.(session.id)}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-sm text-gray-600 hover:text-red-800"
                    title="Delete session"
                  >
                    ✕
                  </button>

                  <div className="text-xs text-yellow-800">{timestamp}</div>
                  {session.description && (
                    <div className="text-sm text-yellow-900">
                      {session.description}
                    </div>
                  )}
                  <div className="mt-1 text-sm font-bold text-yellow-900">
                    {formatMinutes(session.actualMinutes)}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Animation styles */}
        <style>{`
          @keyframes slidein {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideout {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
          .animate-slidein {
            animation: slidein 0.3s ease-out forwards;
          }
          .animate-slideout {
            animation: slideout 0.3s ease-in forwards;
          }
        `}</style>
      </div>
    </div>
  );
};
