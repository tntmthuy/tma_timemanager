import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import {
  deleteUser,
  fetchUserList,
  updateUserRole,
  searchUsersByCriteria, // ✅ dùng filter tổng hợp
} from "../adminSlice";

import type { Role } from "../adminSlice";
import type { SearchFilters } from "./AdvancedUserFilterBar";

import { ConfirmModal } from "../../team/components/ConfirmModal";
import { Pagination } from "./Pagination";
import { UserTable } from "./UserTable";
import {
  AdvancedUserFilterBar,
  type FilterType,
} from "./AdvancedUserFilterBar";

const ITEMS_PER_PAGE = 10;

export const Users = () => {
  const dispatch = useAppDispatch();
  const { users, loadingUsers, errorUsers } = useAppSelector(
    (state) => state.admin,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<FilterType>("keyword");

  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [pendingUserName, setPendingUserName] = useState<string | null>(null);
  const [pendingRole, setPendingRole] = useState<Role | null>(null);

  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);
  const [userToDeleteName, setUserToDeleteName] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUserList());
  }, [dispatch]);

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ✅ Khi người dùng chọn filter và nhấn Search
  const handleApplyFilters = (filters: SearchFilters) => {
    dispatch(searchUsersByCriteria(filters));
    setCurrentPage(1);
  };

  // ✅ Reset toàn bộ
  const handleResetFilters = () => {
    dispatch(fetchUserList());
    setCurrentPage(1);
  };

  // 🔧 Role
  const handleRoleChangeClick = (id: string, newRole: Role) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setPendingUserId(id);
      setPendingUserName(user.fullName);
      setPendingRole(newRole);
    }
  };

  const confirmChangeRole = () => {
    if (pendingUserId && pendingRole) {
      dispatch(updateUserRole({ id: pendingUserId, role: pendingRole }));
    }
    setPendingUserId(null);
    setPendingUserName(null);
    setPendingRole(null);
  };

  const cancelChangeRole = () => {
    setPendingUserId(null);
    setPendingUserName(null);
    setPendingRole(null);
  };

  // 🔧 Delete
  const handleDeleteClick = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setUserToDeleteId(id);
      setUserToDeleteName(user.fullName);
    }
  };

  const confirmDeleteUser = () => {
    if (userToDeleteId) dispatch(deleteUser(userToDeleteId));
    setUserToDeleteId(null);
    setUserToDeleteName(null);
  };

  const cancelDeleteUser = () => {
    setUserToDeleteId(null);
    setUserToDeleteName(null);
  };

  // if (loadingUsers) return <p className="p-8 text-gray-500 italic">Loading...</p>;
  if (errorUsers)
    return <p className="p-8 text-red-600">Error: {errorUsers}</p>;

  return (
    <div className="min-h-screen bg-yellow-50 p-8 text-yellow-900">
      {/* 🧭 Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <p className="mt-2 text-sm text-yellow-700">
          A quick snapshot of all registered users.
        </p>
        <div className="mt-2 flex gap-2">
          {[...Array(3)].map((_, idx) => (
            <span key={idx} className="h-2 w-2 rounded-full bg-yellow-400" />
          ))}
        </div>
        <p className="mt-6 rounded-md bg-amber-200 p-3 font-semibold">
          A total of <strong>{users.length}</strong> registered users match your
          filter.
        </p>
      </header>

      {/* 🔎 Filter bar */}
      <AdvancedUserFilterBar
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      {/* 📋 User table */}
      <UserTable
        users={paginatedUsers}
        loading={loadingUsers}
        onDelete={handleDeleteClick}
        onRoleChangeClick={handleRoleChangeClick}
      />

      {/* 🔢 Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* 🔐 Confirm role modal */}
      {pendingUserId && pendingRole && (
        <ConfirmModal
          title="Change Role"
          message={`Are you sure you want to change role for "${pendingUserName}" to ${pendingRole}?`}
          onConfirm={confirmChangeRole}
          onCancel={cancelChangeRole}
        />
      )}

      {/* 🗑️ Confirm delete modal */}
      {userToDeleteId && (
        <ConfirmModal
          title="Delete User"
          message={`Are you sure you want to delete "${userToDeleteName}"? This action cannot be undone.`}
          onConfirm={confirmDeleteUser}
          onCancel={cancelDeleteUser}
        />
      )}
    </div>
  );
};
