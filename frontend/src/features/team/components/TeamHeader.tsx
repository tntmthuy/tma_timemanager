import { EditableText } from "./EditableText";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { leaveTeamThunk, updateTeamName } from "../teamSlice";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import InvitePopup from "./InvitePopup";
import { deleteTeamThunk } from "../teamSlice";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "./ConfirmModal";
import axios from "axios";

type Props = {
  teamName: string;
  description?: string;
  teamId: string;
};

export const TeamHeader = ({ teamName, description, teamId }: Props) => {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  // ✅ dùng state nội bộ để UI cập nhật đúng sau khi sửa
  const [title, setTitle] = useState(teamName);
  const [desc, setDesc] = useState(description || "");

  useEffect(() => {
    setTitle(teamName);
  }, [teamName]);

  useEffect(() => {
    setDesc(description || "");
  }, [description]);

  const updateTeamInfo = async (payload: {
    newName?: string;
    description?: string;
  }) => {
    try {
      const res = await fetch(`/api/teams/${teamId}/name`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newName: payload.newName ?? title,
          description: payload.description ?? desc,
        }),
      });

      const data = await res.json();
      console.log("Team updated:", data);

      // ✅ cập nhật state sau khi sửa
      if (payload.newName) {
        dispatch(updateTeamName({ id: teamId, newName: payload.newName }));
        setTitle(payload.newName);
      }

      if (payload.description !== undefined) {
        setDesc(payload.description);
      }
    } catch (err) {
      toast.error("You don't have permission to update this group.");
      console.error("Lỗi cập nhật:", err);
    }
  };

  //xóa nhóm
  const navigate = useNavigate();

  const myTeams = useAppSelector((state) => state.team.teams);

  const handleDeleteTeam = async () => {
    try {
      const message = await dispatch(deleteTeamThunk(teamId)).unwrap(); // ✅ lấy thông báo
      toast.success(message); // "Đã xoá nhóm thành công!"

      // ✅ Cập nhật giao diện ➤ chọn nhóm khác hoặc về dashboard
      const fallbackTeam = myTeams.find((t) => t.id !== teamId);
      if (fallbackTeam) {
        navigate(`/mainpage/team/${fallbackTeam.id}`);
      } else {
        navigate("/mainpage/dashboard");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        toast.dismiss();
        toast.error("You don’t have permission to delete this team.");
      } else {
        toast.dismiss();
        toast.error("Failed to delete team.");
      }

      console.error("Lỗi xoá nhóm:", err);
    }
  };

  //leave
  const handleLeaveTeam = async () => {
    try {
      const msg = await dispatch(leaveTeamThunk(teamId)).unwrap();
      toast.success(msg);

      // ✅ Sau khi rời ➤ chọn nhóm còn lại
      const otherTeams = myTeams.filter((t) => t.id !== teamId);
      if (otherTeams.length > 0) {
        navigate(`/mainpage/team/${otherTeams[0].id}`); // nhóm đầu tiên khác
      } else {
        navigate("/mainpage/dashboard"); // không còn nhóm nào
      }
    } catch (err) {
      if (err === "FORBIDDEN_LEAVE") {
        toast.error("You don’t have permission to leave this team.");
      } else {
        toast.error("Failed to leave team.");
      }
      console.error("Lỗi rời nhóm:", err);
    }
  };
  const [confirmAction, setConfirmAction] = useState<"leave" | "delete" | null>(
    null,
  );

  const [isInviteOpen, setIsInviteOpen] = useState(false);

  //out
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="mb-6 space-y-2">
      {/* 🔹 Tiêu đề nhóm + nút */}
      <div className="flex items-center justify-between">
        <EditableText
          text={title}
          as="h2"
          tagClassName="text-2xl font-bold text-gray-900"
          inputClassName="text-2xl font-bold text-gray-900"
          onSubmit={(val) => updateTeamInfo({ newName: val })}
          placeholder="Team name"
        />
        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-3">
            <button
              className="rounded-md bg-yellow-200 px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-[#fbe89e]"
              onClick={() => setIsInviteOpen((prev) => !prev)}
            >
              +Invite
            </button>

            {isInviteOpen && (
              <InvitePopup
                onClose={() => setIsInviteOpen(false)}
                teamId={teamId}
              />
            )}
          </div>
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 cursor-pointer text-gray-500"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>

            {showMenu && (
              <div
                ref={menuRef}
                className="absolute top-8 left-0 z-50 w-fit rounded-md bg-white text-sm shadow-lg"
              >
                <button
                  className="block w-full rounded-sm bg-green-600 px-3 py-1.5 text-center font-bold text-white transition hover:bg-green-700"
                  onClick={() => {
                    setConfirmAction("leave");
                    setShowMenu(false);
                  }}
                >
                  Exit
                </button>
                <button
                  className="block w-full rounded-sm bg-red-600 px-3 py-1.5 text-left font-bold text-white transition hover:bg-red-700"
                  onClick={() => {
                    setConfirmAction("delete");
                    setShowMenu(false);
                  }}
                >
                  Del
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {confirmAction && (
        <ConfirmModal
          title={`Confirm ${confirmAction === "leave" ? "Leave" : "Delete"}`}
          message={
            confirmAction === "leave"
              ? "Are you sure you want to leave this team?\nYou’ll lose access immediately."
              : "Are you sure you want to delete this team?\nThis action cannot be undone."
          }
          onConfirm={() => {
            setConfirmAction(null);

            if (confirmAction === "leave") {
              handleLeaveTeam();
            } else {
              handleDeleteTeam();
            }
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}
      {/* 🔸 Mô tả nhóm */}

      <EditableText
        allowEmpty={true}
        text={desc}
        as="p"
        tagClassName="text-sm text-gray-600" // 🔽 dùng text-sm thay vì text-base
        inputClassName="text-sm text-gray-600"
        onSubmit={(val) => updateTeamInfo({ description: val })}
        placeholder="Add a description..."
      />
    </div>
  );
};
