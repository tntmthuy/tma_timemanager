import type { JSX } from "react";
import { Link } from "react-router-dom";

type SidebarItemProps = {
  label: string;
  path: string;
  isActive: boolean;
  icon: JSX.Element;
};

export const SidebarItem = ({ label, path, isActive, icon }: SidebarItemProps) => {
  return (
    <Link
      to={path}
      className={`group relative flex items-center gap-3 rounded px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors pl-4 ${
        isActive ? "bg-[#1E1E1E] text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}
    >
      <span
        className={`absolute top-0 left-0 h-full w-1 bg-[#FFDE70] transition ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      />
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};