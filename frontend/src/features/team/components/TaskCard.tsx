// src/features/team/components/TaskCard.tsx

import { useSortable } from "@dnd-kit/sortable";
import type { TaskDto, Priority } from "../task";

type TaskCardProps = {
  task: TaskDto;
  onClick?: (task: TaskDto) => void;
  dragData?: {
    type: string;
    columnId: string;
  };
};

const getPriorityColorClass = (priority: Priority) => {
  switch (priority) {
    case "HIGH":
      return "bg-red-100 text-red-600";
    case "MEDIUM":
      return "bg-blue-100 text-blue-600";
    case "LOW":
      return "bg-green-100 text-green-600";
    default:
      return "bg-gray-300 text-gray-600";
  }
};

const getColorClass = (priority: Priority) => {
  switch (priority) {
    case "HIGH":
      return "bg-red-400";
    case "MEDIUM":
      return "bg-blue-400";
    case "LOW":
      return "bg-green-400";
    default:
      return "bg-gray-400";
  }
};

export const TaskCard = ({ task, onClick, dragData }: TaskCardProps) => {
  function getProgressPercent(task: TaskDto): string {
    const done = task.subTasks?.filter((s) => s.isComplete).length ?? 0;
    const total = task.subTasks?.length ?? 0;
    if (total === 0) return "0%";
    return `${Math.round((done / total) * 100)}%`;
  }

  const { setNodeRef, attributes, listeners } = useSortable({
    id: task.id,
    data: dragData,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onDoubleClick={() => onClick?.(task)}
      className="relative w-full rounded-lg border border-gray-100 bg-white p-4 text-sm shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
    >
      {/* Màu bên trái theo priority */}
      <div
        className={`absolute top-0 left-0 h-full w-1 rounded-s ${getColorClass(task.priority)}`}
      />

      {/* Tag priority */}
      <div className="mb-1 flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getPriorityColorClass(task.priority)}`}
        >
          {task.priority ?? ""}
        </span>

        {/* !!! warning nếu quá hạn */}
        {task.dateDue && new Date(task.dateDue).getTime() < Date.now() && (
          <div className="absolute top-2 right-2 animate-pulse text-[13px] font-bold text-red-500">
            !!!
          </div>
        )}
      </div>

      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">{task.taskTitle}</h3>
      </div>

      {/* Progress */}
      <div className="mt-2 flex items-center gap-2 text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4 text-gray-600"
        >
          <path
            fillRule="evenodd"
            d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z"
            clipRule="evenodd"
          />
        </svg>
        <span>Progress</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative h-2 w-full rounded bg-gray-200">
          <div
            className={`absolute top-0 left-0 h-2 rounded ${getColorClass(task.priority)}`}
            style={{ width: `${task.progress * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-600">
          {getProgressPercent(task)}
        </span>
      </div>

      {/* Deadline */}
      <div className="mt-2 flex items-center gap-2 text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4 text-gray-600"
        >
          <path
            fillRule="evenodd"
            d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
            clipRule="evenodd"
          />
        </svg>
        <span>
          {task.dateDue && task.dateDue !== "1970-01-01"
            ? new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(new Date(task.dateDue))
            : "No deadline"}
        </span>
      </div>

      {/* Assignee */}
      <div className="mt-2 flex items-center gap-2 text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-4 w-4 text-gray-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
        {/* <span>{task.assignees?.[0]?.fullName || "Unassigned"}</span> */}
        {task.assignees && task.assignees.length > 0 ? (
          <div className="flex items-center gap-1">
            {task.assignees.slice(0, 3).map((person) => (
              <img
                key={person.userId}
                src={person.avatarUrl ?? "/images/avatar-default.png"}
                alt={person.fullName}
                title={person.fullName}
                className="h-6 w-6 rounded-full border-2 border-white object-cover"
              />
            ))}

            {task.assignees.length > 3 && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gray-300 text-[10px] font-semibold text-white">
                +{task.assignees.length - 3}
              </div>
            )}
          </div>
        ) : (
          <span>Unassigned</span>
        )}
      </div>
    </div>
  );
};
