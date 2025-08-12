import { useRef, useEffect, useState } from "react";
import { ConfirmModal } from "../../team/components/ConfirmModal";
import { deleteSessionThunk } from "../focusSlice";
import { useAppDispatch } from "../../../state/hooks";

type Props = {
  sessionId: number;
  targetLabel: string;
  targetMinutes: number;
  breakMinutes: number;
  onClose: () => void;
  onEnd: () => void;
};

export const FocusTimerModal = ({
  sessionId,
  targetMinutes,
  breakMinutes,
  onClose,
  onEnd,
}: Props) => {
  const motivationalQuotes = [
    "Keep breathing. You're doing great.",
    "Focus is a form of self-respect.",
    "Every minute counts.",
    "Stay steady. You're building momentum.",
    "Small progress is still progress.",
    "Distraction is a choice. So is discipline.",
    "You're stronger than your excuses.",
    "Let the silence fuel your flow.",
    "Keep your promise to yourself.",
  ];

  const dispatch = useAppDispatch();
  const [showConfirm, setShowConfirm] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [elapsed, setElapsed] = useState(0);
  const [breakElapsed, setBreakElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(
    Math.floor(Math.random() * motivationalQuotes.length),
  );
  const [soundPlayed, setSoundPlayed] = useState(false);

  const focusSoundRef = useRef<HTMLAudioElement | null>(null);

  const currentQuote = motivationalQuotes[quoteIndex];
  const showDevEndButton = targetMinutes === 1 && elapsed >= 3;
  const isDevTestMode = targetMinutes === 1;
  const hasReachedTarget = elapsed >= (isDevTestMode ? 3 : targetMinutes * 60);
  const currentBreakCountdown = Math.max(0, breakMinutes * 60 - breakElapsed);

  //focus
  const targetSeconds = isDevTestMode ? 3 : targetMinutes * 60;
  const remainingSeconds = Math.max(0, targetSeconds - elapsed);

  //break
  const breakSoundRef = useRef<HTMLAudioElement | null>(null);
  const [breakSoundPlayed, setBreakSoundPlayed] = useState(false);
  const isBreakTestMode = breakMinutes === 0.05;
  const hasReachedBreak =
    breakElapsed >= (isBreakTestMode ? 3 : breakMinutes * 60);

  // Load âm thanh 1 lần
  useEffect(() => {
    const preload = setTimeout(() => {
      focusSoundRef.current = new Audio("/sounds/microwave-timer.mp3");
      focusSoundRef.current.load();

      breakSoundRef.current = new Audio("/sounds/din-ding.mp3");
      breakSoundRef.current.load();

      console.log("🔊 Sound preloaded");
    }, 100);
    return () => clearTimeout(preload);
  }, []);

  //break sound
  useEffect(() => {
    if (mode === "break" && hasReachedBreak && !breakSoundPlayed) {
      console.log("🔔 Break completed — playing break sound...");
      breakSoundRef.current
        ?.play()
        .then(() => {
          console.log("✅ Break sound played successfully");
        })
        .catch((e) => {
          console.warn("⚠️ Break sound play blocked:", e);
        });
      setBreakSoundPlayed(true);
    }
  }, [mode, hasReachedBreak, breakSoundPlayed]);

  // ⏱Focus timer
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next % 300 === 0) {
          setQuoteIndex(Math.floor(Math.random() * motivationalQuotes.length));
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [motivationalQuotes.length, paused]);

  // ⏱️ Break timer
  useEffect(() => {
    if (paused || mode !== "break") return;
    const interval = setInterval(() => {
      setBreakElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [paused, mode]);

  // 🔔 Phát âm thanh khi hết thời gian focus
  useEffect(() => {
    if (mode === "focus" && hasReachedTarget && !soundPlayed) {
      console.log("🔔 Focus completed — playing sound...");
      focusSoundRef.current
        ?.play()
        .then(() => {
          console.log("✅ Sound played successfully");
        })
        .catch((e) => {
          console.warn("⚠️ Sound play blocked:", e);
        });
      setSoundPlayed(true);
    }
  }, [mode, hasReachedTarget, soundPlayed]);

  const format = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;

    if (targetMinutes >= 60) {
      return `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    }

    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
      <div
        className="relative flex h-[460px] w-[360px] flex-col justify-between rounded-xl border border-yellow-200 p-8 text-center shadow-lg"
        style={{
          backgroundImage:
            mode === "break"
              ? "url('/images/break.jpg')"
              : "url('/images/focus5.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom center",
          backgroundColor:
            mode === "break"
              ? "rgba(220, 240, 255, 0.95)" // màu nhẹ cho break
              : "rgba(255, 247, 209, 0.95)", // màu vàng cho focus
        }}
      >
        {" "}
        {/* Nút Close */}
        <button
          onClick={() => {
            if (mode === "focus" && !hasReachedTarget) {
              setShowConfirm(true); // 👉 mở modal xác nhận
            } else {
              onEnd();
            }
          }}
          className="absolute top-3 right-3 text-lg text-slate-600 hover:text-slate-800"
        >
          ✕
        </button>
        {showConfirm && (
          <ConfirmModal
            title="End Focus Early?"
            message={`You're ending the session early.
It won't be recorded as a completed focus — are you sure you want to exit?`}
            onConfirm={async () => {
              setShowConfirm(false);
              if (sessionId) {
                await dispatch(deleteSessionThunk(sessionId)); // ✅ gọi API xóa trong redux
              }
              onClose(); // 👈 xác nhận xong thì đóng
            }}
            onCancel={() => {
              setShowConfirm(false); // 👈 hủy thì giữ lại modal focus
            }}
          />
        )}
        {/* 🕐 Title */}
        {mode === "focus" && (
          <h2 className="text-xl font-semibold text-yellow-800">
            {elapsed < targetSeconds
              ? `Focus (${format(targetSeconds)})`
              : `Focus (${format(elapsed)})`}
          </h2>
        )}
        {mode === "break" && (
          <span className="mt-1 inline-flex items-center justify-center rounded-full bg-black px-1.5 py-1 text-xs font-medium text-gray-100">
            Break Mode
          </span>
        )}
        {/* ⏱️ Main timer & quote */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="text-4xl font-bold text-slate-700">
            {mode === "focus"
              ? format(remainingSeconds)
              : format(currentBreakCountdown)}
          </div>
          <p className="mt-3 max-w-[80%] text-sm text-amber-700 italic">
            “{currentQuote}”
          </p>
        </div>
        {/* 🎯 Controls */}
        <div className="flex justify-center">
          {mode === "break" ? (
            <button
              onClick={onEnd}
              className="rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Done
            </button>
          ) : showDevEndButton || hasReachedTarget ? (
            <button
              onClick={() => {
                setMode("break");
                setPaused(false);
                setBreakSoundPlayed(false);
              }}
              className="rounded-md bg-amber-900 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600"
            >
              End Session
            </button>
          ) : (
            <button
              onClick={() => setPaused((p) => !p)}
              className="rounded-full bg-amber-900 p-5 transition duration-200 hover:bg-amber-600"
            >
              {paused ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-10 w-10 text-white"
                  style={{ transform: "translateX(3px)" }}
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-10 w-10 text-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
