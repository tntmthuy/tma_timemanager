// src/pages/kanban.ts

import type { TaskDto } from "./task";

export type KanbanColumnDto = {
  id: string;
  title: string;
  position: number;
  tasks: TaskDto[];

  isPlaceholder?: boolean;
};