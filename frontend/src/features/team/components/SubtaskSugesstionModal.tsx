// src/features/team/components/SubtaskSuggestionModal.tsx
import type { FC } from "react";
import { useAppSelector } from "../../../state/hooks";

type SuggestedSubtask = {
  id: string;
  title: string;
  isSelected: boolean;
};

type Props = {
  isOpen: boolean;
  suggestions: SuggestedSubtask[];
  onToggleSelect: (id: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  taskId: string;
  overrideTitle?: string;
  taskDescription?: string;

  onRetry: () => void;
};

export const SubtaskSuggestionModal: FC<Props> = ({
  isOpen,
  suggestions,
  onToggleSelect,
  onConfirm,
  onCancel,
  isLoading = false,
  taskId,
  overrideTitle,
  onRetry,
}) => {
  const task = useAppSelector((state) =>
    state.kanban.tasks.find((t) => t.id === taskId),
  );

  const currentTitle =
    overrideTitle ?? task?.taskTitle ?? "Nhiệm vụ chưa xác định";

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-[360px] max-w-sm rounded-xl bg-yellow-50 px-5 py-5 text-left shadow-xl">
        {/* ❌ Nút Close */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-yellow-400 transition hover:text-yellow-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* ✨ Tiêu đề + mô tả */}

        <h2 className="mb-2 text-sm font-semibold text-yellow-900">
          Sub-task suggestions from AI
        </h2>
        <p className="mb-3 text-[10px] text-gray-400">
          Select the tasks below that you'd like to add.
        </p>
        <div className="mb-4 flex gap-2">
          {[...Array(3)].map((_, idx) => (
            <span key={idx} className="h-2 w-2 rounded-full bg-yellow-400" />
          ))}
        </div>
        <div className="mb-2 flex items-center justify-between text-xs text-yellow-800">
          <span>
            <span className="font-medium text-yellow-700">Task:</span>{" "}
            {currentTitle}
          </span>

          <button
            onClick={onRetry}
            disabled={isLoading}
            className="ml-2 flex h-5 w-5 items-center justify-center rounded-full border border-red-400 bg-red-100 text-red-500 transition hover:bg-red-200 disabled:opacity-40"
          >
            {/* 🔄 Icon xoay xoay */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v6h6M20 20v-6h-6M4 10a9 9 0 0116 0M20 14a9 9 0 01-16 0"
              />
            </svg>
          </button>
        </div>

        {/* 📦 Danh sách gợi ý */}
        {isLoading ? (
          <div className="text-sm text-yellow-700">Loading suggestions...</div>
        ) : suggestions.length === 0 ? (
          <div className="text-sm text-yellow-600">
            No suggestions available
          </div>
        ) : (
          <ul className="mb-4 max-h-56 space-y-2 overflow-auto pr-1">
            {suggestions.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2 rounded px-2 py-1"
              >
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={item.isSelected}
                    onChange={() => onToggleSelect(item.id)}
                    className="h-[16px] w-[16px] flex-shrink-0 accent-yellow-500"
                  />
                </div>
                <span className="text-sm leading-snug font-medium text-yellow-900">
                  {item.title}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* ✅ Hai nút xác nhận */}
        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={onConfirm}
            disabled={!suggestions.some((s) => s.isSelected)}
            className="w-28 rounded-3xl border border-b-4 border-yellow-500 bg-yellow-100 px-4 py-1.5 text-sm font-bold text-yellow-800 transition hover:bg-yellow-300 disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
