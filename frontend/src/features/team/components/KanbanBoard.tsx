// src/features/team/components/KanbanBoard.tsx

import { useEffect, useState } from "react";
import { BtnAddColumn } from "./BtnAddColumn";
import { AddColumnCard } from "./AddColumnCard";
import { KanbanColumn } from "./KanbanColumn";
import {
  DragOverlay,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { TaskDetailModal } from "./TaskDetailModal";
import { useAppSelector, useAppDispatch } from "../../../state/hooks";
import {
  createColumnThunk,
  fetchBoardThunk,
  moveColumnLocal,
  moveTaskLocal,
} from "../kanbanSlice";
import { toast } from "react-hot-toast";
import { api } from "../../../api/axios";
import type { AxiosError } from "axios";
import type { TaskDto } from "../task";
import { TrashDropZone } from "./reorder/TrashDropZone";
import { fetchTeamCalendarThunk } from "../teamSlice";

type Props = {
  workspaceId: string;
  activeTab: "Board" | "Member" | "File";
};

type SortableData = {
  sortable: {
    containerId: string;
    index: number;
    items: string[];
  };
};

export const KanbanBoard = ({ workspaceId, activeTab }: Props) => {
  const dispatch = useAppDispatch();
  const [adding, setAdding] = useState(false);
  const [draggingTask, setDraggingTask] = useState<TaskDto | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);

  const token = useAppSelector((state) => state.auth.token);
  const columns = useAppSelector((state) => state.kanban.columns);

  useEffect(() => {
    if (!workspaceId || !token) return;
    dispatch(fetchBoardThunk(workspaceId));
  }, [workspaceId, token, dispatch]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    const taskId = String(event.active.id);
    const fromColumnId = (event.active.data?.current as { columnId?: string })
      ?.columnId;
    const col = columns.find((c) => c.id === fromColumnId);
    const task = col?.tasks.find((t) => t.id === taskId);
    setDraggingTask(task ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setIsDragging(false);

    const { active, over } = event;
    if (!active || !over) return;

    const activeType = (active.data?.current as { type?: string })?.type;
    console.log("🎯 Drag type:", activeType);
    console.log("🔎 Active ID:", active.id);

    //xóa cột
    if (activeType === "Column") {
      if (over.id === "trash") {
        try {
          await api.delete(`/api/kanban/column/${active.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.dismiss();
          toast.success("Column deleted!");
          dispatch(fetchBoardThunk(workspaceId)); // hoặc removeColumnLocal nếu có
        } catch {
          toast.dismiss();
          toast.error("Failed to delete column.");
        }
        return;
      }
    }

    //xóa task
    if (activeType === "Task" && over.id === "trash") {
      try {
        await api.delete(`/api/kanban/task/${active.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Optional: update local store hoặc fetch lại
        dispatch(fetchBoardThunk(workspaceId));
        dispatch(fetchTeamCalendarThunk(workspaceId)); // ✅ đây chính là teamId trong luồng này
        toast.dismiss();
        toast.success("Task deleted!");
      } catch {
        toast.dismiss();
        toast.error("Failed to delete task.");
      }
      return;
    }

    if (activeType === "Column") {
      const fromIndex = columns.findIndex((c) => c.id === String(active.id));
      const toIndex = columns.findIndex((c) => c.id === String(over?.id));

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

      try {
        await api.put(
          `/api/kanban/column/${active.id}/move`,
          { targetPosition: toIndex },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        dispatch(moveColumnLocal({ columnId: String(active.id), toIndex }));
        toast.dismiss();
        toast.success("Moved column!");
      } catch {
        toast.dismiss();
        toast.error("You don’t have permission to move column.");
      }

      return;
    }

    // 👉 Nếu là task
    const taskId = String(active.id);
    const fromColumnId = (active.data?.current as { columnId?: string })
      ?.columnId;
    const sortableInfo = (over.data?.current as SortableData)?.sortable;
    const targetPosition = sortableInfo?.index ?? 0;
    let toColumnId = sortableInfo?.containerId;

        const hasValidContainer = columns.some((col) => col.id === toColumnId);
    if (!hasValidContainer) {
      toColumnId = String(over.id);
    }

    const toCol = columns.find((c) => c.id === toColumnId);
    if (!toCol) {
      console.warn("⚠️ Column không tồn tại. Xem lại containerId:", toColumnId);
      return;
    }

    if (!fromColumnId || !toColumnId) return;

    if (!toCol) return;
    const taskCount = toCol.tasks.length;
    const safeTargetPosition = Math.min(taskCount, targetPosition);

    try {
      await api.put(
        `/api/kanban/task/${taskId}/move-column`,
        {
          targetColumnId: toColumnId,
          targetPosition: safeTargetPosition,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      dispatch(
        moveTaskLocal({
          taskId,
          fromColumnId,
          toColumnId,
          targetPosition: safeTargetPosition,
        }),
      );
      toast.dismiss();
      toast.success("Task moved.");
    } catch (err) {
      console.error("❌ Không thể cập nhật task:", err);
      toast.dismiss();
      toast.error("You don’t have permission to move task.");
    }
  };

  const createColumn = async (title: string) => {
    const clean = title.trim();
    if (!clean) return toast.error("Please enter a column name.");

    try {
      await dispatch(createColumnThunk({ workspaceId, title: clean })).unwrap();
      toast.dismiss();
      toast.success("New column added.");
      setAdding(false);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError;
      if (axiosErr.response?.status === 403) {
        toast.dismiss();
        toast.error("Permission denied.");
      } else {
        toast.error("Failed to create.");
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={columns.map((c) => c.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex h-full min-w-full items-start gap-4 overflow-x-auto pb-6">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              isDragging={isDragging}
              onClickTask={(task) => {
                setSelectedTask(task);
                setIsDragging(false);
              }}
            />
          ))}
          {adding ? (
            <AddColumnCard
              workspaceId={workspaceId}
              onAdd={createColumn}
              onCancel={() => setAdding(false)}
            />
          ) : (
            <BtnAddColumn onClick={() => setAdding(true)} />
          )}
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={null}>
        {draggingTask ? (
          <div className="pointer-events-none scale-[0.97] opacity-80">
            <TaskCard task={draggingTask} />
          </div>
        ) : null}
      </DragOverlay>
      {activeTab === "Board" && <TrashDropZone />}
      {selectedTask && (
        <TaskDetailModal
        teamId={workspaceId}
          task={selectedTask}
          token={token}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </DndContext>
  );
};
