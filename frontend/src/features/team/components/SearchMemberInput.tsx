import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAppSelector } from "../../../state/hooks";

type MemberInvite = {
  email: string;
  role: "MEMBER" | "OWNER"; // Hoặc thêm các vai trò nếu có
};

type Props = {
  onChange?: (invited: MemberInvite[]) => void;
};

type UserSuggestion = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
};

export const SearchMemberInput = ({ onChange }: Props) => {
  const token = useAppSelector((state) => state.auth.token);
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [invited, setInvited] = useState<UserSuggestion[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mapped: MemberInvite[] = invited.map((u) => ({
      email: u.email,
      role: "MEMBER" as const, // 👈 ép kiểu literal để khớp MemberInvite
    }));
    onChange?.(mapped); // ✅ gửi ra ngoài mỗi lần invited thay đổi
  }, [invited, onChange]);

  // Fetch gợi ý
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!keyword.trim() || !token) return;
      try {
        const res = await axios.get(
          "http://localhost:8081/api/user/search-new-team",
          {
            params: { keyword },
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setSuggestions(res.data.data);
      } catch (err) {
        console.error("Lỗi khi gợi ý thành viên:", err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [keyword, token]);

  // Đóng gợi ý khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAdd = (user: UserSuggestion) => {
    if (invited.some((u) => u.id === user.id)) return;
    setInvited((prev) => [...prev, user]);
    setKeyword("");
    setSuggestions([]);
  };

  const handleRemove = (id: string) => {
    setInvited((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div ref={containerRef} className="relative space-y-2">
      {/* 🔍 Thanh tìm */}
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Invite a teammate"
        className="w-full rounded border px-3 py-2 text-sm"
      />

      {/* 📍 Gợi ý người dùng */}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-[192px] w-full overflow-auto rounded border bg-white text-sm text-black shadow">
          {suggestions.map((user) => {
            const isSelf = user.id === currentUserId;
            const isInvited = invited.some((u) => u.id === user.id);

            if (isSelf) return null;

            return (
              <li
                key={user.id}
                onClick={() => {
                  if (!isInvited) handleAdd(user);
                }}
                className={`flex items-start gap-3 px-3 py-2 text-sm ${
                  isInvited
                    ? "cursor-not-allowed text-gray-400"
                    : "cursor-pointer hover:bg-gray-100"
                }`}
                title={isInvited ? "Already invited" : ""}
              >
                {/* 🖼️ Avatar trái */}
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-300 text-xs font-medium">
                    {user.fullName?.charAt(0) || "?"}
                  </div>
                )}

                {/* 📋 Info phải: tên + email */}
                <div className="flex flex-grow flex-col">
                  <span
                    className={`text-[13px] leading-tight font-medium ${isInvited ? "line-through" : ""}`}
                  >
                    {user.fullName}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {user.email}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* 👥 Danh sách thành viên được mời */}
      {/* 👥 Invited members list */}
      {invited.length > 0 && (
        <div className="mt-4">
          <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold text-gray-700 uppercase">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-3 w-3 text-black"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.351.92 7.47 7.47 0 0 1-3.522.877 7.47 7.47 0 0 1-3.522-.877.75.75 0 0 1-.351-.92ZM15 8.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15ZM14.25 12a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15Z"
              />
            </svg>
            Invited members:
          </p>
          <div className="max-h-[112px] space-y-2 overflow-y-auto pr-1">
            {" "}
            {/* 56px * 2 rows */}
            {invited.map((u) => (
              <div
                key={u.id}
                className="flex w-full items-center justify-between gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-800 shadow-sm"
              >
                {/* Avatar + name */}
                <div className="flex min-w-0 items-center gap-2">
                  {u.avatarUrl ? (
                    <img
                      src={u.avatarUrl}
                      alt={u.fullName}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs font-medium">
                      {u.fullName?.charAt(0) || "?"}
                    </div>
                  )}
                  <span className="truncate font-medium">{u.fullName}</span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => handleRemove(u.id)}
                  className="text-gray-400 transition hover:text-red-600"
                  title="Remove"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
