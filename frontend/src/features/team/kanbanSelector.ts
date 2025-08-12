//src\features\team\kanbanSelector.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../state/store";

export const selectTaskById = createSelector(
  [(state: RootState) => state.kanban.tasks, (_: RootState, taskId: string) => taskId],
  (tasks, taskId) => tasks.find((t) => t.id === taskId)
);