import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { searchNewTeamMembersThunk } from "../teamSlice";
import { inviteMemberToTeamThunk } from "../teamSlice";
import toast from "react-hot-toast";

type Props = {
  teamId: string;
  onClose: () => void;
};

const InvitePopup = ({ teamId, onClose }: Props) => {
  const [email, setEmail] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const suggestions = useAppSelector((state) => state.team.newTeamSuggestions);

  // 🎯 Gọi API khi gõ email (debounce)
  useEffect(() => {
    if (email.trim().length === 0) return;
    const timer = setTimeout(() => {
      dispatch(searchNewTeamMembersThunk(email));
    }, 300);
    return () => clearTimeout(timer);
  }, [email, dispatch]);

  // ✨ Tự đóng khi click ra ngoài ➤ reset input
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
        setEmail("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="absolute top-11 right-0 z-20 min-w-[220px] rounded border border-gray-300 bg-white shadow-lg"
    >
      <div className="p-3 text-sm text-gray-800">
        <p className="mb-1 font-medium">Invite team members</p>
        <p className="text-[10px] text-gray-500">
          Enter their email to send an invitation to join your team.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email..."
          className="mt-1 w-full rounded border px-2 py-1 text-sm outline-none"
        />

        {/* 👤 Hiển thị gợi ý nếu có và input không rỗng */}
        {email.trim().length > 0 && suggestions[0] && (
          <div
            onClick={() => setEmail(suggestions[0].email)}
            className="mt-2 flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-100"
          >
            <img
              src={suggestions[0].avatarUrl || "/default-avatar.png"}
              alt={suggestions[0].fullName}
              className="h-6 w-6 rounded-full object-cover"
            />
            <div>
              <div className="font-medium">{suggestions[0].fullName}</div>
              <div className="text-xs text-gray-500">
                {suggestions[0].email}
              </div>
            </div>
          </div>
        )}

        <button
          className="mt-3 w-full rounded bg-yellow-200 py-1 text-sm font-medium text-yellow-800 hover:bg-yellow-300"
          onClick={async () => {
            if (!email.trim()) return;

            try {
              const res = await dispatch(
                inviteMemberToTeamThunk({ teamId, email }),
              ).unwrap();
              toast.success(res); // "Đã gửi lời mời thành công!"
            } catch (err) {
              if (err === "FORBIDDEN_INVITE") {
                toast.error("You don’t have permission.");
              } else {
                toast.error("An invitation has already been sent.");
              }
            }

            setEmail("");
            onClose();
          }}
        >
          Send Invite
        </button>
      </div>
    </div>
  );
};

export default InvitePopup;
