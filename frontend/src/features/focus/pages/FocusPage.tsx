// src/pages/FocusPage.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FocusSessionForm } from "../components/FocusSessionForm";
import { FocusHistoryCard } from "../components/FocusHistoryCard";
import { FocusTimerModal } from "../components/FocusTimerModal";
import {
  fetchCompletedSessionsThunk,
  fetchWeeklyMinutesThunk,
  startSessionThunk,
  endSessionThunk,
  deleteSessionThunk,
} from "../focusSlice";
import type { RootState } from "../../../state/store";
import { useAppDispatch } from "../../../state/hooks";
import { ConfirmModal } from "../../team/components/ConfirmModal";
import { FocusCalendar } from "../components/FocusCalendar";
import { Link } from "react-router-dom";

const formatMinutes = (total: number): string => {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours > 0 && minutes > 0)
    return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes > 1 ? "s" : ""}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${minutes} minute${minutes > 1 ? "s" : ""}`;
};

export const FocusPage = () => {
  const [focusTime, setFocusTime] = useState("25");
  const [breakTime, setBreakTime] = useState("5");
  const [description, setDescription] = useState("");
  const [showTimer, setShowTimer] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null,
  );
  const isPremium = useSelector(
    (state: RootState) => state.auth.user?.isPremium,
  );

  const dispatch = useAppDispatch();
  const { sessions, loading, weeklyMinutes } = useSelector(
    (state: RootState) => state.focus,
  );

  useEffect(() => {
    dispatch(fetchCompletedSessionsThunk());
    dispatch(fetchWeeklyMinutesThunk());
  }, [dispatch]);

  const handleStartFocus = async () => {
    try {
      const target = parseInt(focusTime);
      const res = await dispatch(
        startSessionThunk({ targetMinutes: target, description }),
      ).unwrap();
      setActiveSessionId(res.id);
      setShowTimer(true);
      setDescription("");
    } catch {
      // để sau
    }
  };

  const handleEndSession = async () => {
    if (!activeSessionId) return;
    try {
      await dispatch(
        endSessionThunk({
          sessionId: activeSessionId,
          // actualMinutes: parseInt(focusTime),
          actualMinutes: 101,
        }),
      ).unwrap();

      dispatch(fetchCompletedSessionsThunk());
      dispatch(fetchWeeklyMinutesThunk());
      setShowTimer(false);
      setActiveSessionId(null);
    } catch {
      // để sau
    }
  };

  //xóa phiên
  const handleDelete = (id: number) => {
    setSelectedSessionId(id); // mở modal
  };

  const handleConfirmDelete = () => {
    if (selectedSessionId !== null) {
      dispatch(deleteSessionThunk(selectedSessionId));
      setSelectedSessionId(null); // đóng modal
    }
  };

  const handleCancelDelete = () => {
    setSelectedSessionId(null); // đóng modal
  };

  return (
    <div className="relative min-h-screen bg-yellow-50 px-12 py-16">
      {/* 🔝 Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-yellow-900">Focus Mode</h2>
        <p className="mt-2 text-sm text-yellow-700">
          Set up a session & review your flow
        </p>
        <div className="mt-2 flex gap-2">
          {[...Array(3)].map((_, idx) => (
            <span key={idx} className="h-2 w-2 rounded-full bg-yellow-400" />
          ))}
        </div>
        <p className="mt-6 rounded-md bg-amber-200 p-3 text-sm font-semibold text-yellow-900">
          You've stayed focused for{" "}
          <strong>{formatMinutes(weeklyMinutes)}</strong> this week.
        </p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
        <div className="flex h-full flex-col gap-4">
          <FocusSessionForm
            focusTime={focusTime}
            breakTime={breakTime}
            description={description}
            onChangeFocus={setFocusTime}
            onChangeBreak={setBreakTime}
            onChangeDescription={setDescription}
            onStart={handleStartFocus}
          />
          {showTimer && activeSessionId && (
            <FocusTimerModal
              sessionId={activeSessionId}
              targetLabel={`Focus (${focusTime})`}
              // targetMinutes={parseInt(focusTime)}
              targetMinutes={parseFloat(focusTime)}
              breakMinutes={Number(breakTime)}
              onEnd={handleEndSession}
              onClose={() => setShowTimer(false)}
            />
          )}
        </div>

        <FocusHistoryCard
          sessions={sessions}
          loading={loading}
          onDelete={handleDelete}
        />
        {selectedSessionId !== null && (
          <ConfirmModal
            title="Delete this session?"
            message="Deleted sessions will no longer be counted in your stats."
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </div>
      <h2 className="relative mt-10 flex items-center gap-3 rounded pl-5 text-[15px] font-semibold tracking-widest text-slate-800 uppercase">
        <span className="absolute top-0 left-0 h-full w-1 bg-yellow-400" />
        <span className="relative z-10">Your Focus Journey</span>
      </h2>
      {isPremium ? (
        <FocusCalendar sessions={sessions} />
      ) : (
        <div className="mt-6 rounded-md bg-yellow-100 p-4 text-sm text-yellow-800 shadow-sm">
          Focus Calendar is available for Premium users. Upgrade to unlock your
          journey view!
          <div className="mt-3">
            <Link
              to="/mainpage/upgrade"
              className="text-[12px] text-yellow-700 italic underline hover:text-yellow-900"
            >
              Explore upgrade options →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
