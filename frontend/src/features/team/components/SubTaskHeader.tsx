import type { FC } from "react";

type Props = {
  isCollapsed: boolean;
  subTasks: { isComplete: boolean }[];
  onToggleCollapse: () => void;
  hideCompleted: boolean;
  onToggleHideCompleted: () => void;
  onAddSubtask?: () => void;
  onOpenSuggestionModal?: () => void;
  isPremiumUser?: boolean;
};

export const SubTaskHeader: FC<Props> = ({
  isCollapsed,
  subTasks,
  onToggleCollapse,
  hideCompleted,
  onToggleHideCompleted,
  onAddSubtask,
  onOpenSuggestionModal,
  isPremiumUser,
}) => {
  const shouldShowAddButton = subTasks.length === 0;

  return (
    <div className="flex items-center justify-between">
      {/* Left side: collapse & info */}
      <div
        className="flex flex-grow cursor-pointer items-center gap-1 select-none"
        onClick={onToggleCollapse}
      >
        {/* 🔽 Collapse Arrow */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isCollapsed ? "rotate-180" : "rotate-0"
          }`}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
          />
        </svg>

        {/* 📋 Title + progress + eye */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-semibold text-gray-700 uppercase">
            Sub-tasks
          </span>
          <span className="text-[10px] font-semibold text-gray-600">
            {`${subTasks.filter((s) => s.isComplete).length}/${subTasks.length}`}
          </span>

          {/* 👁️ Eye toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleHideCompleted();
            }}
            className="ml-1 cursor-pointer rounded p-1 transition hover:bg-gray-100"
            aria-label={
              hideCompleted
                ? "Hiện sub-task đã hoàn thành"
                : "Ẩn sub-task đã hoàn thành"
            }
          >
            {hideCompleted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 text-gray-500"
              >
                <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 text-gray-500"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isPremiumUser && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenSuggestionModal?.();
            }}
            className="flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 px-2 py-0.5 text-[11px] text-indigo-200 shadow-md transition hover:brightness-110"
          >
            AI suggestion
          </button>
        )}

        {shouldShowAddButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddSubtask?.();
            }}
            className="flex items-center gap-1 px-1 py-0.5 text-xs text-gray-500 transition hover:rounded hover:bg-yellow-50 hover:text-yellow-600"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
