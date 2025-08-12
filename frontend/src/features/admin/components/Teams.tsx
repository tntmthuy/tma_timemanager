import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { deleteTeamById, fetchTeamSummaryList } from "../adminSlice";
import { Pagination } from "../components/Pagination";
import { ConfirmModal } from "../../team/components/ConfirmModal";

const ITEMS_PER_PAGE = 10;

function getColorFromName(name: string): string {
  const colors = [
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-pink-400",
    "bg-purple-400",
    "bg-indigo-400",
    "bg-red-400",
    "bg-teal-400",
  ];
  const index = name?.charCodeAt(0) % colors.length;
  return colors[index];
}

export const Teams = () => {
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.admin.teams);
  const loading = useAppSelector((state) => state.admin.loadingTeams);
  const deletingTeamId = useAppSelector((state) => state.admin.deletingTeamId);

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTeamSummaryList());
  }, [dispatch]);

  const filteredTeams = [...teams]
  .sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateA.getTime() - dateB.getTime(); // cũ → mới
  })
  .filter((team) => {
    if (!startDate && !endDate) return true;
    const created = new Date(team.createdAt);
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;
    return (!from || created >= from) && (!to || created <= to);
  });

  const totalPages = Math.ceil((filteredTeams.length ?? 0) / ITEMS_PER_PAGE);
  const paginatedTeams = filteredTeams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleConfirmDelete = () => {
    if (!selectedTeamId) return;
    dispatch(deleteTeamById(selectedTeamId));
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-8 text-yellow-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Teams</h1>
        <p className="mt-2 text-sm text-yellow-700">
          Overview of all created teams and their details.
        </p>
        <div className="mt-2 flex gap-2">
          {[...Array(3)].map((_, idx) => (
            <span key={idx} className="h-2 w-2 rounded-full bg-yellow-400" />
          ))}
        </div>
        <p className="mt-6 rounded-md bg-amber-200 p-3 font-semibold">
          A total of <strong>{filteredTeams?.length ?? 0}</strong> teams match
          your filter.
        </p>
      </div>

      {/* 🔍 Filter by date */}
      <div className="mb-6 rounded-md bg-amber-200 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 overflow-x-auto">
          <span className="text-sm font-semibold whitespace-nowrap text-gray-700">
            Create Date:
          </span>

          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            className="w-[150px] rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="dd/mm/yyyy"
          />

          <span className="text-gray-500">→</span>

          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            className="w-[150px] rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="dd/mm/yyyy"
          />

          {/* 🧼 View All button */}
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setCurrentPage(1);
            }}
            className="rounded bg-amber-300 px-4 py-2 text-sm font-semibold text-yellow-800 shadow hover:bg-yellow-200"
          >
            View All
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md bg-white shadow-md">
        <table className="w-full min-w-[1200px] text-center text-sm">
          <thead className="bg-yellow-200 font-semibold text-yellow-900">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Creator</th>
              <th className="px-4 py-2">Owner</th>
              <th className="px-4 py-2">Members</th>
              <th className="px-4 py-2">Tasks</th>
              <th className="px-4 py-2">Comments</th>
              <th className="px-4 py-2">Files</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="py-4 text-yellow-600 italic">
                  Loading data...
                </td>
              </tr>
            ) : paginatedTeams?.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-4 text-gray-500 italic">
                  No teams found.
                </td>
              </tr>
            ) : (
              paginatedTeams?.map((team, idx) => (
                <tr
                  key={team.teamId ?? idx}
                  className="border-b transition hover:bg-yellow-50"
                >
                  <td className="w-64 px-4 py-2 text-left text-xs whitespace-nowrap text-gray-700">
                    {team.teamId}
                  </td>
                  <td className="px-4 py-2 text-left">
                    {team.teamName ?? "Untitled"}
                  </td>
                  <td className="px-4 py-2">
                    {team.createdAt
                      ? new Date(team.createdAt).toLocaleDateString("en-GB")
                      : "Unknown"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      {team.createdByAvatarUrl ? (
                        <img
                          src={team.createdByAvatarUrl}
                          alt="creator"
                          title={team.createdBy ?? ""}
                          className="h-5 w-5 rounded-full"
                        />
                      ) : (
                        <div
                          title={team.createdBy ?? ""}
                          className={`flex h-6 w-6 items-center justify-center rounded-full font-semibold text-white ${getColorFromName(team.createdBy ?? "")}`}
                        >
                          {team.createdBy
                            ? team.createdBy.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      {team.ownerAvatarUrl ? (
                        <img
                          src={team.ownerAvatarUrl}
                          alt="owner"
                          title={team.ownerFullName ?? ""}
                          className="h-5 w-5 rounded-full"
                        />
                      ) : (
                        <div
                          title={team.ownerFullName ?? ""}
                          className={`flex h-6 w-6 items-center justify-center rounded-full font-semibold text-white ${getColorFromName(team.ownerFullName ?? "")}`}
                        >
                          {team.ownerFullName
                            ? team.ownerFullName.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">{team.members?.length ?? 0}</td>
                  <td className="px-4 py-2">{team.totalTasks ?? 0}</td>
                  <td className="px-4 py-2">{team.totalComments ?? 0}</td>
                  <td className="px-4 py-2">{team.totalFiles ?? 0}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => {
                        setSelectedTeamId(team.teamId);
                        setShowModal(true);
                      }}
                      disabled={deletingTeamId === team.teamId}
                      className="text-sm text-red-600 hover:text-red-700 hover:underline disabled:opacity-50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {showModal && (
          <ConfirmModal
            title="Xác nhận xoá nhóm"
            message={`Bạn có chắc chắn muốn xoá nhóm này?\nHành động này không thể hoàn tác.`}
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowModal(false)}
          />
        )}
      </div>

      {/* Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
