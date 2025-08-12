import { useAppSelector } from "../../../state/hooks";
import { Link } from "react-router-dom";

const formatDueLabel = (date?: string) => {
  if (!date) return null;

  const due = new Date(date);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  if (diffHours <= 0) return "Overdue";
  if (diffHours < 4) return `In ${Math.floor(diffHours)}h`;
  if (diffHours < 24) return "Due in a few hours";
  if (diffDays < 2) return "Due in 1 day";
  return due.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const AssignedTaskList = () => {
  const tasks = useAppSelector((state) => state.kanban.assignedTasks);

  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="relative mb-5 flex items-center gap-3 rounded py-2 pl-5 text-[15px] font-semibold tracking-widest text-slate-800 uppercase">
        <span className="absolute top-0 left-0 h-full w-1 bg-yellow-400" />
        <span className="relative z-10">Your Assigned Tasks</span>
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => {
          const due = task.dateDue ? new Date(task.dateDue) : null;
          const now = new Date();
          const isOverdue = due && due.getTime() < now.getTime();
          const isDueSoon =
            due &&
            due.getTime() >= now.getTime() &&
            (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 1.5;

          return (
            <div
              key={task.taskId}
              className={`relative flex flex-col justify-between rounded p-4 transition duration-300 ${
                isOverdue
                  ? "bg-slate-100 text-slate-400"
                  : isDueSoon
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-200 text-slate-800"
              } ${isDueSoon || isOverdue ? "" : "hover:shadow-md"}`}
            >
              {/* ⏰ Due Date – Top right */}
              {task.dateDue && (
                <div
                  className={`absolute top-3 right-4 text-xs font-medium ${
                    isOverdue
                      ? "text-slate-400"
                      : isDueSoon
                        ? "text-red-600"
                        : "text-slate-500"
                  }`}
                >
                  {formatDueLabel(task.dateDue)}
                </div>
              )}

              {/* 📄 Nội dung task */}
              <div className="mb-2">
                <p
                  className={`font-medium ${
                    isOverdue ? "text-slate-400" : "text-slate-800"
                  }`}
                >
                  {task.title}
                </p>
                <p
                  className={`text-sm ${
                    isOverdue ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  Team: {task.teamName}
                </p>
              </div>

              <Link
                to={`/${task.teamUrl}`}
                className={`mt-auto text-sm ${
                  isOverdue
                    ? "text-slate-400"
                    : "text-yellow-700 hover:underline"
                }`}
              >
                View Team →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
