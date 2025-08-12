import { useSelector } from "react-redux";
import type { RootState } from "../../../state/store";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks"; // ✅ thêm dòng này
import { fetchUserProfileThunk } from "../../auth/authSlice";
import { useNavigate } from "react-router-dom";

export const SidebarProfile = () => {
  const dispatch = useAppDispatch(); // ✅ khai báo dispatch
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const notifications = useAppSelector((s) => s.notification.list);
  const hasUnread = notifications.some((n) => !n.read);

  useEffect(() => {
    dispatch(fetchUserProfileThunk());
  }, [dispatch]);

  if (!user) return null;

  // Kiểm tra xem có thông báo chưa đọc không

  return (
    <div>
      <div className="flex cursor-pointer items-center justify-between gap-3 rounded-md p-2 transition hover:bg-gray-800">
        {/* 👉 Avatar + tên + email */}
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B3B1B0] text-sm font-bold text-white">
              {user.firstname?.charAt(0) ?? "?"}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{`${user.firstname} ${user.lastname}`}</span>
            <span className="text-[10px] text-gray-400">{user.email}</span>
          </div>
        </div>

        {/* 🔔 Icon bên phải */}
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 text-gray-400 transition hover:text-yellow-400"
            onClick={(e) => {
              e.stopPropagation();
              navigate("notification");
            }}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
            />
          </svg>
          {/* 🔴 ping badge khi có unread */}
          {hasUnread && (
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 animate-ping rounded-full bg-yellow-500"></span>
          )}
        </div>
      </div>
    </div>
  );
};
