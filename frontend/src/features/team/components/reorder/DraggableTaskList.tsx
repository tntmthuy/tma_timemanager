
// src/features/team/components/reorder/DraggableTaskList.tsx
import { ReorderableList } from "./ReorderableList";
import { TaskCard } from "../TaskCard";
import type { TaskDto } from "../../task";

type Props = {
  columnId: string;
  tasks: TaskDto[];
};

export function DraggableTaskList({ columnId, tasks }: Props) {
  return (
    <ReorderableList<TaskDto>
      items={tasks}
      getId={(task) => String(task.id)}
      strategy="vertical"
      renderItem={(task) => (
        <TaskCard
          task={task}
          dragData={{ type: "Task", columnId }} // ✅ Gắn đúng dữ liệu drag
        />
      )}
      columnId={columnId}
      className="space-y-3"
    />
  );
}