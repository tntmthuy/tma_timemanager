import { useState } from "react";
import { Sidebar } from "../../sidebar/components/Sidebar";
import { Outlet } from "react-router-dom";
import { CreateTeamModal } from "../../team/components/CreateTeamModal";

export const MainPage = () => {
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-black">
      {/* Sidebar trái */}
      <Sidebar onNewTeam={() => setShowCreateTeamModal(true)} />

      {/* Nội dung bên phải */}
      <div className="ml-64 flex-1 overflow-y-auto bg-black text-gray-900">
        <Outlet />
      </div>

      {showCreateTeamModal && (
        <CreateTeamModal onClose={() => setShowCreateTeamModal(false)} />
      )}
    </div>
  );
};
