import { useState, useEffect } from "react";
import { FocusLeaderboard } from "./FocusLeaderboard";

export const FloatingFocusLeaderboard = () => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (closing) {
      const timeout = setTimeout(() => {
        setOpen(false);
        setClosing(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [closing]);

  return (
    <>
      {/* 🏆 Nút mở sidebar nhỏ bên phải */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-20 right-0 z-50 flex items-center gap-2 rounded-l-full bg-yellow-400 px-4 py-2 text-[13px] font-semibold text-white shadow-md transition hover:bg-yellow-600"
        >
          <span className="text-lg">🏆</span>
        </button>
      )}

      {/* 🪟 Sidebar nội dung */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          style={{
            backgroundColor: "rgba(0,0,0,0.1)",
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            className={`flex h-full w-[400px] flex-col bg-white shadow-lg ${
              closing ? "animate-slideout" : "animate-slidein"
            }`}
          >
            {/* 🏆 Nút đóng mép sidebar */}
            <button
              onClick={() => setClosing(true)}
              className="absolute top-28 right-full z-10 flex items-center gap-2 rounded-l-full bg-yellow-500 px-4 py-2 text-[13px] font-semibold text-white shadow-md transition hover:bg-yellow-600"
            >
              <span className="text-lg">🏆</span>
            </button>

            {/* 📌 Header tiêu đề + nút close */}
            <div className="flex items-start justify-between px-6 py-6 shadow-sm">
              <div>
                <h2 className="mb-1 text-xs font-semibold tracking-wide text-yellow-900 uppercase">
                  Focus Leaderboard
                </h2>
                <p className="text-[11px] text-gray-500">
                  Check out who’s leading this week with the most focused
                  minutes. Let’s stay sharp!
                </p>
              </div>
              <button
                onClick={() => setClosing(true)}
                className="text-sm text-yellow-700 transition hover:scale-[1.05] hover:text-red-500"
              >
                ✕
              </button>
            </div>

            {/* 📈 Nội dung leaderboard */}
            <div className="flex-1 overflow-y-auto px-4 pt-3 pb-5">
              <FocusLeaderboard />
            </div>
          </div>

          {/* 🎞️ Animation */}
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
      )}
    </>
  );
};
