// src/features/admin/components/AdminProfile.tsx
import { useSelector } from "react-redux";
import type { RootState } from "../../../state/store";

export const AdminProfile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt="Admin Avatar" className="h-8 w-8 rounded-full object-cover" />
      ) : (
        <div className="h-8 w-8 rounded-full bg-gray-600 text-white flex items-center justify-center font-semibold">
          {user.firstname?.charAt(0) ?? "A"}
        </div>
      )}
      <span className="text-sm font-medium text-white">{user.firstname} {user.lastname}</span>
    </div>
  );
};