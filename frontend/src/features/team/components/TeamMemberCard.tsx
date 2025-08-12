import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../../state/hooks";
import {
  fetchTeamDetailThunk,
  removeTeamMemberThunk,
  transferOwnershipThunk,
} from "../teamSlice";
import toast from "react-hot-toast";
import { ConfirmModal } from "./ConfirmModal";

type Props = {
  fullName: string;
  email: string;
  avatarUrl: string | null;
  teamRole: "OWNER" | "MEMBER";
  teamId: string;
  userId: string;
};

export const TeamMemberCard = ({
  fullName,
  email,
  avatarUrl,
  teamRole,
  teamId,
  userId,
}: Props) => {
  const dispatch = useAppDispatch();

  // 🛠️ State để hiển thị popup
  const [showActions, setShowActions] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActions]);

  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<"transfer" | "remove" | null>(
    null,
  );

  //xác nhận chuyển quyền sở hữu
  const confirmTransfer = async () => {
    try {
      await dispatch(transferOwnershipThunk({ teamId, userId })).unwrap();
      await dispatch(fetchTeamDetailThunk(teamId));
      toast.success("Ownership transferred!");
      setShowActions(false);
    } catch {
      toast.dismiss();
      toast.error("You don’t have permission to perform this action.");
    }
  };

  //xác nhận xóa thành viên
  const confirmRemove = async () => {
    try {
      await dispatch(removeTeamMemberThunk({ teamId, userId })).unwrap();
      await dispatch(fetchTeamDetailThunk(teamId));
      toast.success("Member removed!");
      setShowActions(false);
    } catch {
      toast.dismiss();
      toast.error("You don’t have permission to perform this action.");
    }
  };

  return (
    <div className="relative flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      {/* 🖼 Avatar hoặc chữ cái đầu */}
      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-yellow-100 font-semibold text-yellow-700 uppercase">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={fullName}
            className="h-full w-full object-cover"
          />
        ) : (
          fullName.charAt(0)
        )}
      </div>

      {/* 👤 Họ tên & email + role */}
      <div className="flex-1">
        <p className="flex items-center gap-2 font-medium text-gray-800">
          {fullName}
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              teamRole === "OWNER"
                ? "bg-yellow-200 text-yellow-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {teamRole}
          </span>
        </p>
        <p className="text-xs text-gray-500">{email}</p>
      </div>

      {/* ⚙️ Icon bên phải */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6"
        onClick={() => setShowActions(true)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
        />
      </svg>
      {showActions && (
        <div
          ref={popupRef}
          className="absolute top-12 right-2 z-50 w-fit rounded-md border border-gray-200 bg-white text-sm shadow-md"
        >
          {" "}
          <button
            onClick={() => {
              setActionType("transfer");
              setShowModal(true);
            }}
            className="block rounded-t-md px-2.5 py-1.5 text-left transition hover:bg-gray-100"
          >
            Transfer
          </button>
          <button
            onClick={() => {
              setActionType("remove");
              setShowModal(true);
            }}
            className="block rounded-b-md px-2.5 py-1.5 text-left text-red-600 transition hover:bg-red-50"
          >
            Remove
          </button>
          {showModal && (
            <ConfirmModal
              title={
                actionType === "transfer"
                  ? "Confirm transfer"
                  : "Confirm removal"
              }
              message={
                actionType === "transfer"
                  ? `Are you sure you want to transfer\nownership to ${fullName}?`
                  : `Are you sure you want to remove\n${fullName} from this team?`
              }
              onConfirm={() => {
                if (actionType === "transfer") confirmTransfer();
                else if (actionType === "remove") confirmRemove();
                setShowModal(false);
              }}
              onCancel={() => setShowModal(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};
