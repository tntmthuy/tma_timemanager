// src\features\team\components\SubTaskList.tsx
import {
  useState,
  useImperativeHandle,
  forwardRef,
  type ForwardedRef,
  useEffect,
} from "react";
import type { SubTask } from "../subtask";
import { toggleSubtaskComplete } from "../subtask"; // ✅ import đúng hàm gọi API
import { useAppSelector } from "../../../state/hooks";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../state/hooks";
import { createSubtaskThunk } from "../kanbanSlice";
import axios from "axios";
import { deleteSubtaskThunk } from "../kanbanSlice";
import { ConfirmModal } from "./ConfirmModal";
import { EditableSubtaskTitle } from "./EditableSubtaskTitle";

export type SubTaskListHandle = {
  addAtTop: () => void;
};

type SubTaskListProps = {
  subTasks: SubTask[];
  taskId: string; // ✅ thêm dòng này để biết cha là ai
  hideCompleted?: boolean;
  onChange?: (updated: SubTask[]) => void;
  onFirstItemCreated?: () => void;
};

export const SubTaskList = forwardRef(
  (
    {
      subTasks,
      taskId,
      hideCompleted,
      onChange,
      onFirstItemCreated,
    }: SubTaskListProps,
    ref: ForwardedRef<SubTaskListHandle>,
  ) => {
    const [items, setItems] = useState<SubTask[]>(subTasks);
    const [newInputIndex, setNewInputIndex] = useState<number | null>(null);
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch();

    useEffect(() => {
      setItems(subTasks); // đồng bộ lại khi props thay đổi
    }, [subTasks]);

    const [modalSubtaskId, setModalSubtaskId] = useState<string | null>(null);
    useImperativeHandle(ref, () => ({
      addAtTop() {
        setNewInputIndex(-1);
      },
    }));

    const handleAdd = async (text: string) => {
      if (!token) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      if (items.length === 0) {
        onFirstItemCreated?.();
      }

      try {
        const action = await dispatch(
          createSubtaskThunk({
            parentTaskId: taskId,
            title: text,
          }),
        );

        if (createSubtaskThunk.fulfilled.match(action)) {
          const subtask = action.payload.subtask;

          const updatedItems = [...items, subtask]; // ✅ Chèn ở cuối

          // Nếu muốn giữ thứ tự subtaskPosition từ backend thì giữ dòng sort
          updatedItems.sort((a, b) => a.subtaskPosition - b.subtaskPosition);

          setItems(updatedItems);
          setNewInputIndex(null);
          onChange?.(updatedItems);
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          toast.error("You don’t have permission to add subtasks.");
        } else {
          toast.error("Subtask creation failed.");
        }
        console.error("🔥 Subtask creation failed", err);
      }
    };

    const toggleCompleteById = async (id: string) => {
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, isComplete: !item.isComplete } : item,
      );
      setItems(updatedItems);
      onChange?.(updatedItems);

      try {
        if (!token) {
          toast.error("Session expired. Please log in again.");
          return;
        }

        await toggleSubtaskComplete(id, token);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          toast.error("You don’t have permission to update this subtask.");
        } else {
          toast.error("Failed to toggle subtask.");
        }
        console.error("Toggle subtask failed:", err);
      }
    };

    const sortedItems = [...items].sort(
      (a, b) => a.subtaskPosition - b.subtaskPosition,
    );

    const visibleItems = hideCompleted
      ? sortedItems.filter((s) => !s.isComplete)
      : sortedItems;

    return (
      <div className="mt-2 space-y-2">
        {newInputIndex === -1 && (
          <div className="flex items-start gap-2">
            <div className="mt-2 h-4 w-4 rounded-full border-2 border-gray-300" />
            <input
              autoFocus
              className="w-full border-b border-gray-300 py-0.5 text-sm focus:outline-none"
              placeholder="Enter sub-task..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) handleAdd(val);
                }
              }}
              onBlur={() => setNewInputIndex(null)}
            />
          </div>
        )}

        <div className="space-y-2 pr-4">
          {visibleItems.map((sub) => (
            <div key={sub.id} className="group flex items-start gap-2">
              {/* Khối nội dung bên trái */}
              <div className="flex flex-1 gap-2">
                <button
                  onClick={() => toggleCompleteById(sub.id)}
                  className="flex h-5 w-5 items-center justify-center"
                >
                  {sub.isComplete ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="translate-y-[1px] text-gray-500"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2.25 12c0-5.385 
                      4.365-9.75 9.75-9.75s9.75 
                      4.365 9.75 9.75-4.365 
                      9.75-9.75 9.75S2.25 
                      17.385 2.25 12Zm13.36-1.814a.75.75 
                      0 1 0-1.22-.872l-3.236 
                      4.53L9.53 12.22a.75.75 
                      0 0 0-1.06 1.06l2.25 
                      2.25a.75.75 0 0 0 
                      1.14-.094l3.75-5.25Z"
                      />
                    </svg>
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-400" />
                  )}
                </button>
                <EditableSubtaskTitle
                  subtask={sub}
                  onUpdated={(updatedSubtask) => {
                    const updatedItems = items.map((i) =>
                      i.id === updatedSubtask.id ? updatedSubtask : i,
                    );
                    setItems(updatedItems);
                    onChange?.(updatedItems);
                  }}
                />
              </div>

              {/* khối phải */}
              <button
                onClick={() => setModalSubtaskId(sub.id)}
                className="invisible mt-[1px] h-4 text-[12px] text-gray-400 transition group-hover:visible hover:text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
        {modalSubtaskId && (
          <ConfirmModal
            title="Are you sure you want to delete?"
            message="You will not be able to recover them afterwards."
            onCancel={() => setModalSubtaskId(null)}
            onConfirm={async () => {
              const action = await dispatch(deleteSubtaskThunk(modalSubtaskId));
              if (deleteSubtaskThunk.fulfilled.match(action)) {
                toast.dismiss();
                toast.success("Subtask deleted!");
                const updatedItems = items.filter(
                  (i) => i.id !== modalSubtaskId,
                );
                setItems(updatedItems);
                onChange?.(updatedItems);
              } else {
                toast.error("Failed to delete subtask.");
              }
              setModalSubtaskId(null);
            }}
          />
        )}
        {items.length > 0 && newInputIndex === null && (
          <button
            onClick={() => setNewInputIndex(items.length - 1)}
            className="mt-1 ml-6 flex items-center gap-1 px-1 py-0.5 text-xs text-gray-500 transition hover:rounded hover:bg-yellow-50 hover:text-yellow-600"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2.25c-5.385 
                0-9.75 4.365-9.75 
                9.75s4.365 9.75 
                9.75 9.75 9.75-4.365 
                9.75-9.75S17.385 
                2.25 12 2.25ZM12.75 9a.75.75 
                0 0 0-1.5 0v2.25H9a.75.75 
                0 0 0 0 1.5h2.25V15a.75.75 
                0 0 0 1.5 0v-2.25H15a.75.75 
                0 0 0 0-1.5h-2.25V9Z"
              />
            </svg>
            Add sub-task
          </button>
        )}

        {newInputIndex !== null && newInputIndex !== -1 && (
          <div className="flex items-start gap-2">
            <div className="mt-2 h-4 w-4 rounded-full border-2 border-gray-300" />
            <input
              autoFocus
              className="w-full border-b border-gray-300 py-0.5 text-sm focus:outline-none"
              placeholder="Enter sub-task..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) handleAdd(val);
                }
              }}
              onBlur={() => setNewInputIndex(null)}
            />
          </div>
        )}
      </div>
    );
  },
);
