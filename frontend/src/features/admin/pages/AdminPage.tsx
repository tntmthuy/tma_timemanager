import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/AdminSidebar";

export const AdminPage = () => {
  return (
    <div className="relative flex min-h-screen bg-yellow-50">
      {/* Sidebar trái */}
      <div className="w-64">
        <AdminSidebar />
      </div>

      {/* Nội dung bên phải */}
      <div className="flex-1 overflow-y-auto text-yellow-900 px-8 py-10">
        <Outlet />
      </div>
    </div>
  );
};