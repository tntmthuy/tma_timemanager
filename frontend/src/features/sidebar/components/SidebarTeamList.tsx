// src\features\sidebar\components\SidebarTeamList.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../../state/hooks";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../../api/axios";
import { SidebarTeamItem } from "./SidebarTeamItem";
import type { RootState } from "../../../state/store";
import { setTeams } from "../../team/teamSlice";

type SidebarTeamListProps = {
  isActive: boolean;
  onNewTeam?: () => void;
};

export const SidebarTeamList = ({
  isActive,
  onNewTeam,
}: SidebarTeamListProps) => {
  const [showTeams, setShowTeams] = useState(true);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const teamList = useSelector((state: RootState) => state.team.teams);
  const location = useLocation();

  const isTeamDetailSelected = location.pathname.startsWith("/mainpage/team/");

  useEffect(() => {
    if (!token) return;

    api
      .get("/api/teams")
      .then((res) => {
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        dispatch(setTeams(list)); // 🎯 Cập nhật Redux store
      })
      .catch((err) => {
        console.error("❌ Lỗi khi fetch danh sách nhóm:", err);
        dispatch(setTeams([]));
      });
  }, [token, dispatch]);

  return (
    <div className="mt-6">
      <button
        onClick={() => setShowTeams((prev) => !prev)}
        className={`flex w-full items-center justify-between px-4 py-2 text-xs font-semibold tracking-wider uppercase transition ${
          isActive && !isTeamDetailSelected
            ? "bg-[#1E1E1E] text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        <span className="flex items-center gap-3">
          <span className="h-5 w-5">
            <svg
              className="h-5 w-5 text-inherit"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 6.75a3 3 0 11-6 0 3 3 0 016 0Z
                  M19.5 9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0Z
                  M4.5 9a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0Z
                  M6 18.72a8.98 8.98 0 0012 0
                  M6 18.72a5.972 5.972 0 01.94-3.197
                  M17.06 15.523a5.972 5.972 0 01.94 3.197
                  M6 18.72a9.094 9.094 0 01-3.741-.479
                  M21.741 18.241A9.094 9.094 0 0118 18.72
                  M6 18.72c.005.224.019.445.042.664
                  M18 18.72c-.023.219-.037.44-.042.664
                  M12 21c-2.17 0-4.207-.576-5.963-1.584
                  M12 21c2.17 0 4.207-.576 5.963-1.584"
              />
            </svg>
          </span>
          <span>My Teams</span>
        </span>

        <svg
          className={`h-5 w-5 transform transition-transform ${
            showTeams ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {showTeams && (
        <div className="mt-2 space-y-1 pl-8">
          {teamList.length > 0 ? (
            teamList.map((team) => (
              <SidebarTeamItem
                key={team.id}
                id={team.id}
                name={team.teamName}
              />
            ))
          ) : (
            <p className="px-4 py-2 text-sm text-gray-400">Không có nhóm nào</p>
          )}

          <button
            onClick={onNewTeam}
            className="flex items-center gap-2 px-4 py-2 pl-8 text-xs tracking-wider text-[#FFDE70] uppercase transition hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span>New Team</span>
          </button>
        </div>
      )}
    </div>
  );
};
