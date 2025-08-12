import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../state/hooks";
import { updateSubtaskTitleThunk } from "../kanbanSlice";
import type { SubTask } from "../subtask";
import { EditableText } from "./EditableText";

type EditableSubtaskTitleProps = {
  subtask: SubTask;
  onUpdated?: (updated: SubTask) => void;
};

export const EditableSubtaskTitle = ({
  subtask,
  onUpdated,
}: EditableSubtaskTitleProps) => {
  const dispatch = useAppDispatch();
  const [localTitle, setLocalTitle] = useState(subtask.title);

  useEffect(() => {
    setLocalTitle(subtask.title);
  }, [subtask.title]);

  const handleSubmit = async (newTitle: string) => {
    const action = await dispatch(
      updateSubtaskTitleThunk({ subtaskId: subtask.id, title: newTitle })
    );

    if (updateSubtaskTitleThunk.fulfilled.match(action)) {
      toast.success("✔️ Subtask title updated!");
      const updated = action.payload;
      setLocalTitle(updated.title);
      onUpdated?.(updated);
    } else {
      toast.error("❌ Failed to update title.");
    }
  };

  return (
    <EditableText
      text={localTitle}
      allowEmpty={false}
      placeholder="Tên subtask..."
      onSubmit={handleSubmit}
      disabled={subtask.isComplete}
      className="flex-1"
      inputClassName="text-xs text-gray-800"
      tagClassName={`text-[12px] ${subtask.isComplete ? "text-gray-400 line-through" : "text-gray-800"}`}
    />
  );
};