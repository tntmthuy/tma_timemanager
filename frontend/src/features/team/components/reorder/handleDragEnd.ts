import type { DragEndEvent } from "@dnd-kit/core";
import axios from "axios";

export async function handleDragEnd(
  event: DragEndEvent,
  token: string // hoặc truyền dispatch nếu muốn gọi thunk
) {
  const { active, over } = event;
  if (!over) return;

  const id = active.id.toString();
  const overId = over.id.toString();

  // Kéo vào thùng rác
  if (overId === "trash-zone") {
    const [type, entityId] = id.split(":");
    try {
      switch (type) {
        case "column":
          await axios.delete(`/api/kanban/column/${entityId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          break;
        case "task":
          await axios.delete(`/api/kanban/task/${entityId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          break;
        case "subtask":
          await axios.delete(`/api/kanban/subtask/${entityId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          break;
      }
    } catch {
      console.error("Không thể xóa mục:", type, entityId);
    }
  }
}