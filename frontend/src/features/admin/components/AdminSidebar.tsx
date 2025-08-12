import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../../state/hooks";
import { logoutThunk } from "../../auth/logoutThunks";
import { AdminProfile } from "./AdminProfile";
import { ProfileDetailModal } from "../../sidebar/components/ProfileDetailModal";
import { SidebarItem } from "../../sidebar/components/SidebarItem"; // đảm bảo đường dẫn đúng

export const AdminSidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const pathname = location.pathname;
  const active =
    pathname === "/admin"
      ? "Dashboard"
      : pathname === "/admin/users"
        ? "Users"
        : pathname === "/admin/teams"
          ? "Teams"
          : pathname === "/admin/profile"
            ? "Profile"
            : pathname === "/admin/payments"
              ? "Payments"
              : null;

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  return (
    <aside className="fixed top-0 left-0 flex h-screen w-64 flex-col justify-between bg-[#1B1B1F] p-6 text-gray-300">
      {" "}
      <div className="space-y-4">
        <div
          className="cursor-pointer rounded-md p-2 transition hover:bg-slate-700"
          onClick={() => setShowProfileModal(true)}
        >
          <AdminProfile />
        </div>

        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="relative w-[600px] rounded-md bg-white shadow-lg">
              <ProfileDetailModal />
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-3 right-3 text-lg font-black text-gray-800 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Sidebar Navigation with Grouped Sections */}
        <nav className="space-y-6">
          {/* Management Section */}
          <div>
            <div className="space-y-1">
              <SidebarItem
                label="Dashboard"
                path="/admin"
                isActive={active === "Dashboard"}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                    />
                  </svg>
                }
              />
              <SidebarItem
                label="Users"
                path="/admin/users"
                isActive={active === "Users"}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                }
              />
              <SidebarItem
                label="Teams"
                path="/admin/teams"
                isActive={active === "Teams"}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                    />
                  </svg>
                }
              />
              <SidebarItem
                label="Payments"
                path="/admin/payments"
                isActive={active === "Payments"}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                }
              />
            </div>
          </div>
        </nav>
      </div>
      <div className="border-t border-slate-600 pt-4">
        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-400 transition hover:text-white"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15m-3 0-3-3m0 0l3-3m-3 3H15"
            />
          </svg>
          <span className="pl-1">Log out</span>
        </button>
      </div>
    </aside>
  );
};
