//src\features\team\components\KanbanColumn.tsx
import { useSortable } from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import { AddTaskInlineInput } from "./AddTaskInlineInput";
import { TaskCard } from "./TaskCard";
import { EditableText } from "./EditableText";
import type { TaskDto } from "../task";
import { useAppSelector } from "../../../state/hooks";
import axios from "axios";
import toast from "react-hot-toast";
import { ReorderableList } from "./reorder/ReorderableList";
import type { KanbanColumnDto } from "../kanban";
import { useAppDispatch } from "../../../state/hooks";
import { addTaskLocal } from "../kanbanSlice";

type KanbanColumnProps = {
  column: KanbanColumnDto;
  isDragging?: boolean;
  onClickTask?: (task: TaskDto) => void;
};

export const KanbanColumn = ({
  column,
  isDragging,
  onClickTask,
}: KanbanColumnProps) => {
  const token = useAppSelector((state) => state.auth.token);
  const [title, setTitle] = useState(column.title);
  const teamDetail = useAppSelector((state) => state.team.teamDetail);
  const {
    setNodeRef,
    attributes,
    listeners,
    isDragging: isColumnDragging,
  } = useSortable({
    id: column.id,
    data: { type: "Column" },
  });

  useEffect(() => {
    setTitle(column.title);
  }, [column.title]);

  const updateColumnTitle = async (newTitle: string) => {
    const cleanTitle = newTitle.trim();
    if (!cleanTitle) return toast.error("Please enter a column name.");
    if (cleanTitle === title.trim()) return;

    setTitle(cleanTitle);
    try {
      const res = await axios.patch(
        `/api/kanban/column/${column.id}`,
        { title: cleanTitle },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTitle(res.data.data?.title ?? cleanTitle);
      toast.dismiss();
      toast.success("Column updated.");
    } catch {
      toast.error("Failed to update.");
    }
  };

  const dispatch = useAppDispatch();

  const handleAddTask = (newTask: TaskDto) => {
    dispatch(addTaskLocal({ columnId: column.id, task: newTask }));
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`w-[230px] flex-shrink-0 rounded-xl bg-white p-4 shadow-lg transition ${
        isColumnDragging
          ? "border-yellow-400 ring-2 ring-yellow-400"
          : "border border-gray-200"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <EditableText
          text={title}
          as="h2"
          tagClassName="text-sm font-bold text-black"
          inputClassName="text-sm font-bold text-black"
          onSubmit={updateColumnTitle}
          placeholder="Column name"
        />
        <p className="text-xs font-semibold text-gray-700">
          {column.tasks.length}
        </p>
      </div>

      <div className="mb-2 pt-2 pb-2">
        {teamDetail && (
          <AddTaskInlineInput
            columnId={column.id}
            teamId={teamDetail.id}
            onAddTask={handleAddTask}
          />
        )}
      </div>

      <ReorderableList<TaskDto>
        items={column.tasks}
        getId={(task) => task.id}
        strategy="vertical"
        columnId={column.id}
        className="space-y-3"
        isDragging={isDragging}
        renderItem={(task) => (
          <TaskCard
            key={task.id}
            task={task}
            dragData={{ type: "Task", columnId: column.id }}
            onClick={onClickTask}
          />
        )}
      />
    </div>
  );
};
