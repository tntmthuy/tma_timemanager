// src/features/team/components/AddTaskInlineInput.tsx
import { useState, useRef, useEffect } from "react";
import { createTask, type TaskDto } from "../task";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import toast from "react-hot-toast";
import { fetchTeamCalendarThunk } from "../teamSlice";

type Props = {
  columnId: string;
  teamId: string;
  onAddTask: (newTask: TaskDto) => void;
};

export const AddTaskInlineInput = ({ columnId, teamId, onAddTask }: Props) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);
  const dispatch = useAppDispatch();
  
  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed || !token) return;

    try {
      const task = await createTask(columnId, trimmed, token);
      onAddTask(task);
      dispatch(fetchTeamCalendarThunk(teamId));
      setValue("");
      setEditing(false);
      toast.success("Task created successfully!");
    } catch (err) {
      console.error("Failed to create task:", err);
      toast.error("Unable to create task");
    }
  };
  
  const handleBlur = () => {
    const trimmed = value.trim();

    if (trimmed) {
      handleSubmit(); // gọi tạo task nếu có nội dung
    } else {
      setEditing(false); // ❌ không tạo task trống
      setValue(""); // ✅ reset luôn
    }
  };
  return editing ? (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSubmit();
        if (e.key === "Escape") {
          setValue("");
          setEditing(false);
        }
      }}
      placeholder="Write task title..."
      className="w-full rounded-md border px-3 py-2 text-sm"
    />
  ) : (
    <button
      onClick={() => setEditing(true)}
      className="w-full rounded-md bg-gray-200 px-3 py-2 text-sm hover:bg-gray-300"
    >
      + Add Task
    </button>
  );
};
