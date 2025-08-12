
import { useState } from "react";
import { useAppDispatch } from "../../../state/hooks";
import { createColumnThunk } from "../kanbanSlice";
import toast from "react-hot-toast";

type AddColumnCardProps = {
  workspaceId: string;
  onAdd: (title: string) => Promise<string | undefined>;
  onCancel: () => void;
};

export const AddColumnCard = ({ workspaceId, onCancel }: AddColumnCardProps) => {
  const [title, setTitle] = useState("");
  const dispatch = useAppDispatch();

  const handleAdd = async () => {
    const trimmed = title.trim();

    if (!trimmed) {
      toast.error("Column name cannot be empty.");
      return;
    }

    try {
      const action = await dispatch(
        createColumnThunk({ workspaceId, title: trimmed })
      );

      if (createColumnThunk.fulfilled.match(action)) {
        toast.dismiss();
        toast.success("Column created.");
        setTitle("");
        onCancel(); // ✅ đóng modal hoặc UI thêm
      } else if (createColumnThunk.rejected.match(action)) {
        switch (action.payload) {
          case "NO_PERMISSION":
            toast.error("You don’t have permission to create columns.");
            break;
          case "UNAUTHORIZED":
            toast.error("Please log in to continue.");
            break;
          default:
            toast.error("Column creation failed.");
        }
      }
    } catch {
      toast.error("Unexpected error. Try again later.");
    }
  };

  return (
    <div className="w-[230px] flex-shrink-0 space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Type a column name..."
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <div className="flex items-center justify-between">
        <button
          className="mr-2 w-full rounded-md bg-yellow-200 px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-[#fbe89e]"
          onClick={handleAdd}
        >
          Add column
        </button>
        <button
          className="px-2 text-base font-bold text-gray-400 hover:text-gray-600"
          onClick={onCancel}
        >
          ×
        </button>
      </div>
    </div>
  );
};