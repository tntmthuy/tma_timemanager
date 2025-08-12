// src/types/subtask.ts

import axios from "axios";

export type SubTask = {
  id: string;
  title: string;
  isComplete: boolean;
  subtaskPosition: number;
};

export const toggleSubtaskComplete = async (
  id: string,
  token: string
): Promise<void> => {
  await axios.put(
    `/api/kanban/task/subtask/${id}/toggle-complete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};