import { useNavigate } from "react-router-dom";

type Props = {
  id: string;
  name: string;
};

export const SidebarTeamItem = ({ id, name }: Props) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/mainpage/team/${id}`)}
      className="w-full text-left px-4 py-2 text-sm text-gray-300 rounded hover:bg-gray-800 hover:text-white transition"
      title={name} // 🪄 Tooltip khi hover
    >
      <span className="block truncate max-w-full">{name}</span>
    </button>
  );
};