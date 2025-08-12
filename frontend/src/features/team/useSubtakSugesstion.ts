// src\features\team\useSubtakSugesstion.ts
import { useState } from "react";
import type { SubTask } from "./subtask";
import { fetchSubtaskSuggestions } from "./openrouter";
import { useAppDispatch } from "../../state/hooks";
import { createMultipleSubtasksThunk } from "./kanbanSlice";
import toast from "react-hot-toast";

export type SuggestedSubtask = {
  id: string;
  title: string;
  isSelected: boolean;
};

export const useSubtaskSuggestion = (
  existingSubtasks: SubTask[],
  handleUpdate: (newList: SubTask[]) => void,
  taskTitle: string,
  taskDescription?: string,
) => {
  const [suggestedSubtasks, setSuggestedSubtasks] = useState<SuggestedSubtask[]>([]);
  const [isSuggestionModalOpen, setSuggestionModalOpen] = useState(false);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);

  const toggleSuggestion = (id: string) => {
    setSuggestedSubtasks((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, isSelected: !s.isSelected } : s
      )
    );
  };

  const dispatch = useAppDispatch();

  const handleAddSuggestions = async (parentTaskId: string) => {
    const selected = suggestedSubtasks.filter((s) => s.isSelected);
    if (selected.length === 0) return;

    try {
      const res = await dispatch(createMultipleSubtasksThunk({
        parentTaskId,
        titles: selected.map((s) => s.title),
      })).unwrap();

      const newSubTasks: SubTask[] = res.subtasks;
      const updatedList: SubTask[] = [...existingSubtasks, ...newSubTasks];

      handleUpdate(updatedList);
      setSuggestedSubtasks([]);
      setSuggestionModalOpen(false);
    } catch {
      toast.error("Không thể thêm subtask. Vui lòng thử lại.");
    }
  };

  const handleRetrySuggestions = async () => {
    setIsLoadingSuggestion(true);
    const raw = await fetchSubtaskSuggestions(taskTitle, taskDescription); // gọi OpenRouter
    const formatted = raw.map((title, idx) => ({
      id: `${idx}`,
      title,
      isSelected: false,
    }));
    setSuggestedSubtasks(formatted);
    setIsLoadingSuggestion(false);
  };

  const handleOpenSuggestions = async (taskTitle: string) => {
  setSuggestionModalOpen(true);
  setIsLoadingSuggestion(true);

  const titles = await fetchSubtaskSuggestions(taskTitle, taskDescription);

  const formatted = titles.map((title, idx) => ({
    id: `sug-${idx}`,
    title,
    isSelected: false,
  }));

  setSuggestedSubtasks(formatted);
  setIsLoadingSuggestion(false);
};

  return {
    suggestedSubtasks,
    isSuggestionModalOpen,
    isLoadingSuggestion,
    setSuggestedSubtasks,
    setSuggestionModalOpen,
    setIsLoadingSuggestion,
    toggleSuggestion,
    handleAddSuggestions,
    handleOpenSuggestions,
    handleRetrySuggestions,
  };
};