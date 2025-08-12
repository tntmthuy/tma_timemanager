// ./features/dashboard/pages/TeamDetailPage.tsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { KanbanBoard } from "../components/KanbanBoard";
import { TeamHeader } from "../components/TeamHeader";
import { TeamFileList } from "../components/TeamFileList";
import { fetchTeamAttachments } from "../commentSlice";
import { TeamMemberList } from "../components/TeamMemberList";
import { fetchTeamCalendarThunk, fetchTeamDetailThunk } from "../teamSlice";
import { TeamCalendar } from "../components/TeamCalendar";

type TabType = "Board" | "Member" | "File" | "Calendar";

export const TeamDetailPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const teamDetail = useAppSelector((state) => state.team.teamDetail);
  console.log("User info:", user);
  const [activeTab, setActiveTab] = useState<TabType>("Board");

  useEffect(() => {
    if (!id || !token) return;
    dispatch(fetchTeamDetailThunk(id));
    dispatch(fetchTeamAttachments({ teamId: id }));
    dispatch(fetchTeamCalendarThunk(id));
  }, [id, token, dispatch]);

  if (!teamDetail)
    return <div className="p-6 text-slate-600">Đang tải thông tin nhóm...</div>;

  const availableTabs: TabType[] = ["Board", "Member", "File"];
  if (user?.isPremium) availableTabs.push("Calendar");

  return (
    <div className="flex h-full w-full flex-col bg-white p-8 shadow-xl">
      <TeamHeader
        teamName={teamDetail.teamName}
        description={teamDetail.description}
        teamId={teamDetail.id}
      />

      {/* 🔖 Tabs */}
      <div className="mt-4 flex gap-2">
        {availableTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-t-md rounded-b-none px-3 py-1 text-sm font-semibold transition-colors duration-200 ${
              activeTab === tab
                ? "bg-yellow-200 text-yellow-800"
                : "text-gray-400 hover:bg-yellow-100 hover:text-yellow-700"
            }`}
          >
            {tab === "Board"
              ? "Board"
              : tab === "Member"
                ? "Team"
                : tab === "File"
                  ? "Files"
                  : "Calendar"}
          </button>
        ))}
      </div>

      {/* 📦 Tab content */}
      <div className="mt-[-1px] h-full w-full rounded-tr-md rounded-b-md bg-gray-50 p-4">
        {activeTab === "Board" && (
          <KanbanBoard workspaceId={teamDetail.id} activeTab={"Board"} />
        )}
        {activeTab === "Member" && <TeamMemberList />}
        {activeTab === "File" && <TeamFileList />}
        {activeTab === "Calendar" && user?.isPremium && (
          <TeamCalendar />
        )}
      </div>
    </div>
  );
};
