import dayjs from "dayjs";
import type { Role, UserSummaryDto } from "../adminSlice";
import customParseFormat from "dayjs/plugin/customParseFormat";

type Props = {
  users: UserSummaryDto[];
  loading: boolean;
  onDelete: (id: string) => void;
  onRoleChangeClick: (id: string, newRole: Role) => void;
};

dayjs.extend(customParseFormat);
export const UserTable = ({
  users,
  loading,
  onDelete,
  onRoleChangeClick,
}: Props) => {
  return (
    <div className="overflow-x-auto rounded-md bg-white shadow-md">
      <table className="w-full text-left text-sm">
        <thead className="bg-yellow-200 font-semibold text-yellow-900">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Fullname</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={6}
                className="py-6 text-center text-yellow-600 italic"
              >
                Loading users...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-4 text-center text-gray-500 italic">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="border-b transition hover:bg-yellow-50"
              >
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.fullName}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  {dayjs(user.createdAt, "DD/MM/YYYY").isValid() ? (
                    dayjs(user.createdAt, "DD/MM/YYYY").format("DD/MM/YYYY")
                  ) : (
                    <span className="text-gray-500 italic">Invalid Date</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {user.role === "ADMIN" ? (
                    <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                      ADMIN
                    </span>
                  ) : (
                    <select
                      value={user.role}
                      onChange={(e) =>
                        onRoleChangeClick(user.id, e.target.value as Role)
                      }
                      className={`rounded border px-2 py-1 text-xs font-semibold transition ${
                        user.role === "PREMIUM"
                          ? "border-yellow-300 bg-yellow-100 text-yellow-800"
                          : "border-green-300 bg-green-100 text-green-700"
                      }`}
                    >
                      <option value="FREE">FREE</option>
                      <option value="PREMIUM">PREMIUM</option>
                    </select>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {user.role === "ADMIN" ? (
                    <span className="text-xs text-gray-400 italic">
                      Not editable
                    </span>
                  ) : (
                    <button
                      onClick={() => onDelete(user.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete user"
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
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
