//src\features\team\components\AssigneePicker.tsx
import { useState, type ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import {
  assignMemberToTaskThunk,
  searchMembersInTeamThunk,
  unassignMemberFromTaskThunk,
} from "../../team/teamSlice";
import toast from "react-hot-toast";
import { updateTaskLocal } from "../kanbanSlice";
import { store } from "../../../state/store";
// import type { TaskDto } from "../task";

type Props = {
  teamId: string;
  taskId: string;
};

export const AssigneePicker = ({ teamId, taskId }: Props) => {
  const dispatch = useAppDispatch();
  const task = useAppSelector((state) =>
    state.kanban.tasks.find((t) => t.id === taskId),
  );

  const { searchResults, searchError } = useAppSelector((state) => state.team);
  const [keyword, setKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("teamId used for search:", teamId);
    setKeyword(value);
    dispatch(searchMembersInTeamThunk({ teamId, keyword: value }));
  };

  return (
    <div className="space-y-1">
      <label className="block text-[10px] font-semibold text-gray-600 uppercase">
        Assign a person
      </label>
      <div className="relative">
        <input
          type="text"
          value={keyword}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setKeyword(""); // 👈 reset luôn input khi blur
          }}
          placeholder="Type an assignee..."
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400"
        />

        {searchError === "UNAUTHORIZED" && keyword.trim() !== "" && (
          <p className="mt-1 text-sm text-red-500">
            Permission denied to search members.
          </p>
        )}

        <ul className="absolute z-50 mt-2 max-h-60 w-full rounded-md bg-white shadow-md">
          {isFocused &&
            keyword.trim() !== "" &&
            searchResults
              .filter(
                (member) =>
                  !task?.assignees?.some((a) => a.userId === member.userId),
              )
              .slice(0, 3)
              .map((member) => (
                <li
                  key={member.memberId}
                  onMouseDown={() => {
                    if (task) {
                      dispatch(
                        assignMemberToTaskThunk({
                          taskId: task.id,
                          memberId: String(member.memberId),
                        }),
                      )
                        .unwrap()
                        .then((updatedTask) => {
                          dispatch(updateTaskLocal(updatedTask));
                          toast.success(
                            "Member has been assigned successfully!",
                          );

                          const updatedFromSlice = store
                            .getState()
                            .kanban.tasks.find((t) => t.id === updatedTask.id);
                          console.log(
                            "✅ Task đã cập nhật:",
                            updatedFromSlice?.assignees,
                          );
                        })
                        .catch((err) => {
                          toast.error("You don't have permission.");
                          console.error("Failed to assign member:", err);
                        });
                    }
                  }}
                  className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-50"
                >
                  <img
                    src={member.avatarUrl ?? "/images/avatar-default.png"}
                    alt="Avatar"
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{member.fullName}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </li>
              ))}
        </ul>
      </div>
      {task?.assignees && task.assignees.length > 0 && (
        <div className="mt-3 space-y-1">
          <label className="block text-[10px] font-semibold text-gray-600 uppercase">
            Assigned Members
          </label>

          <div className="flex max-h-40 flex-col gap-2 overflow-y-auto rounded bg-white p-1">
            {task.assignees.map((member) => (
              <div
                key={member.userId}
                className="flex items-center justify-between gap-2 rounded bg-gray-100 px-2 py-1 hover:bg-gray-200"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={member.avatarUrl ?? "/images/avatar-default.png"}
                    alt={member.fullName}
                    className="h-6 w-6 rounded-full border border-gray-300 object-cover"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    {member.fullName}
                  </span>
                </div>

                {/* ❌ Nút chỉ để hiển thị */}
                <button
                  onClick={async () => {
                    try {
                      const updatedTask = await dispatch(
                        unassignMemberFromTaskThunk({
                          taskId: task.id,
                          memberId: member.id,
                        }),
                      ).unwrap();

                      dispatch(updateTaskLocal(updatedTask));
                      toast.dismiss();
                      toast.success("Member has been successfully removed!");
                    } catch {
                      toast.dismiss();
                      toast.error(
                        "You don't have permission to unassign this member.",
                      );
                    }
                  }}
                  className="rounded px-2 py-1 text-xs text-gray-400 hover:text-red-500"
                  title="Unassign"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
