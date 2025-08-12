import { ReorderableList } from "./ReorderableList";
import { KanbanColumn } from "../KanbanColumn";
import type { KanbanColumnDto } from "../../kanban";
import type { TaskDto } from "../../task";

type Props = {
  columns: KanbanColumnDto[];
  onClickTask: (task: TaskDto) => void;
  isDragging: boolean;
};

export function DraggableColumnList({ columns, onClickTask, isDragging }: Props) {
  return (
    <ReorderableList<KanbanColumnDto>
      items={columns}
      getId={(col) => col.id}
      strategy="horizontal"
      renderItem={(col) => (
        <KanbanColumn
          column={col}
          isDragging={isDragging}
          onClickTask={onClickTask}
        />
      )}
      columnId="board" // tuỳ ID board
      isDragging={isDragging}
    />
  );
}