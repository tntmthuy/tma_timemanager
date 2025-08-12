import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../state/hooks";
import { logoutThunk } from "../../auth/logoutThunks";
import { SidebarItem } from "./SidebarItem";
import { SidebarTeamList } from "./SidebarTeamList";
import { SidebarProfile } from "./SidebarProfile";
import { useState } from "react";
import { ProfileDetailModal } from "./ProfileDetailModal";

type SidebarProps = {
  onNewTeam: () => void;
};

export const Sidebar = ({ onNewTeam }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const teamSlugs = ["frontend-squad", "ux-warriors"];
  const pathname = location.pathname;

  const isTeamPath = pathname.startsWith("/mainpage/team/");
  const isTeamDetail = teamSlugs.some(
    (slug) => pathname === `/mainpage/team/${slug}`,
  );

  const active =
    pathname === "/mainpage/focus"
      ? "Focus"
      : pathname === "/mainpage/dashboard"
        ? "Dashboard"
        : isTeamPath && !isTeamDetail
          ? "My Teams"
          : null;

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  return (
    <aside className="fixed top-0 left-0 z-40 flex h-screen w-64 flex-col justify-between bg-black px-4 py-6 text-white">
      {" "}
      <div className="space-y-2">
        {/* nữa tách ra thành component profile */}
        <div
          className="cursor-pointer rounded-md p-2 transition hover:bg-gray-800 hover:text-white"
          onClick={() => setShowProfileModal(true)}
        >
          <SidebarProfile />
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
        <nav className="space-y-1">
          <SidebarItem
            label="Focus"
            path="/mainpage/focus"
            isActive={active === "Focus"}
            icon={
              <svg
                className="h-5 w-5"
                stroke="currentColor"
                fill="none"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25"
                />
              </svg>
            }
          />

          <SidebarItem
            label="Dashboard"
            path="/mainpage/dashboard"
            isActive={active === "Dashboard"}
            icon={
              <svg
                className="h-5 w-5"
                stroke="currentColor"
                fill="none"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25Z"
                />
              </svg>
            }
          />

          <SidebarTeamList
            isActive={active === "My Teams"}
            onNewTeam={onNewTeam}
          />
        </nav>
      </div>
      <div className="space-y-1 border-t border-[#444] pt-4">
        <button
          onClick={() => navigate("/mainpage/upgrade")}
          className="relative w-full overflow-hidden rounded-md bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 px-4 py-2 text-xs font-semibold text-black uppercase shadow-md transition hover:from-yellow-400 hover:to-yellow-600 hover:brightness-105"
        >
          <span className="relative z-10 font-bold">Go Pro</span>

          {/* ⭐ SVG icon lấp lánh ở góc phải trên */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute top-1 right-1 h-4 w-4 text-yellow-200 drop-shadow-[0_0_2px_rgba(255,255,0,0.8)]"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
            />
          </svg>
        </button>
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase transition hover:text-white"
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
