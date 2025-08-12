// task.ts
import axios from "axios";
import type { SubTask } from "./subtask";
import type { AssigneeDTO } from "./member";

export type Priority = "HIGH" | "MEDIUM" | "LOW" | null;

export type UpdateTaskRequest = {
  title?: string;
  description?: string;
  priority?: Priority;
  dateDue?: string | null;
  subTasks?: SubTask[];
};

export type TaskDto = {
  id: string;
  taskTitle: string;
  description?: string;
  priority: Priority;
  progressDisplay: string;
  progress: number;
  dateDue: string;
  assignees: AssigneeDTO[];
  subTasks?: SubTask[];
  columnId: string;
};

export interface AssignedTask {
  taskId: string;
  title: string;
  teamId: string;
  teamName: string;
  teamUrl: string;
  dateDue?: string;
}

export const createTask = async (
  columnId: string,
  title: string,
  token: string
): Promise<TaskDto> => {
  const res = await axios.post(
    "/api/kanban/task",
    { columnId, title },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data.data as TaskDto;
};