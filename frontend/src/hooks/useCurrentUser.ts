//src\hooks\useCurrentUser.ts

import { useAppSelector } from "../state/hooks";
import type { User } from "../features/auth/authSlice";

// 🧠 Trả về toàn bộ user hiện tại từ Redux
export const useCurrentUser = (): User | null => {
  return useAppSelector((state) => state.auth.user);
};

// 🆔 Trả về userId (hoặc null nếu chưa đăng nhập)
export const useCurrentUserId = (): string | null => {
  return useAppSelector((state) => state.auth.user?.id ?? null);
};

// 💡 So sánh với một userId bất kỳ (VD: user đang được render)
export const useIsCurrentUser = (targetId: string | undefined | null): boolean => {
  const currentUserId = useCurrentUserId();
  if (!targetId || !currentUserId) return false;
  return String(targetId).toLowerCase() === currentUserId.toLowerCase();
};