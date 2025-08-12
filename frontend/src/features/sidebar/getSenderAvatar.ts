import type { Notification } from "./notificationSlice"; 

export const getSenderAvatar = (noti: Notification): string => {
  const isSystemGenerated = noti.type === "DEADLINE_REMINDER";

  if (isSystemGenerated) return "/images/noti.png"; // avatar hệ thống

  const avatar = noti.senderAvatar?.trim();
  if (avatar) return avatar;

  const firstLetter = noti.senderName?.charAt(0)?.toUpperCase() || "?";
  return `__TEXT__|${firstLetter}`; // fallback nếu không có ảnh
};