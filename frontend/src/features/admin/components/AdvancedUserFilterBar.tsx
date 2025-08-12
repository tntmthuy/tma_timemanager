import { useState } from "react";
import type { Role } from "../adminSlice";

export type FilterType = "keyword" | "date" | "role";

export type SearchFilters = {
  keyword?: string;
  role?: Role;
  createdFrom?: string;
  createdTo?: string;
};

type Props = {
  filterType: FilterType;
  onFilterTypeChange: (type: FilterType) => void;
  onApplyFilters: (filters: SearchFilters) => void;
  onResetFilters: () => void;
};

export const AdvancedUserFilterBar = ({
  filterType,
  onFilterTypeChange,
  onApplyFilters,
  onResetFilters,
}: Props) => {
  const [keyword, setKeyword] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | "">("");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");

  const inputStyle =
    "rounded border border-black bg-white px-3 py-2 text-sm text-yellow-900 shadow";

  const handleSubmit = () => {
    if (filterType === "keyword" && keyword.trim().length >= 2) {
      onApplyFilters({ keyword: keyword.trim() });
    }

    if (filterType === "role" && selectedRole) {
      onApplyFilters({ role: selectedRole as Role });
    }

    if (filterType === "date" && createdFrom && createdTo) {
      onApplyFilters({
        createdFrom,
        createdTo,
      });
    }
  };

  return (
    <div className="mb-6 rounded-md bg-amber-200 p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-4 overflow-x-auto">
        <span className="text-sm font-semibold whitespace-nowrap text-gray-700">
          Search Options:
        </span>

        {/* Filter type selection */}
        <select
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value as FilterType)}
          className={inputStyle}
        >
          <option value="keyword">Name or Email</option>
          <option value="role">User Role</option>
          <option value="date">Created Date</option>
        </select>

        {/* Keyword filter */}
        {filterType === "keyword" && (
          <input
            type="text"
            placeholder="Enter keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && keyword.trim().length >= 2) {
                handleSubmit();
              }
            }}
            className={`${inputStyle} min-w-[160px]`}
          />
        )}

        {/* Role filter */}
        {filterType === "role" && (
          <select
            value={selectedRole}
            onChange={(e) => {
              const role = e.target.value as Role;
              setSelectedRole(role);
              if (role) onApplyFilters({ role });
            }}
            className={inputStyle}
          >
            <option value="">Select Role</option>
            <option value="FREE">FREE</option>
            <option value="PREMIUM">PREMIUM</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        )}

        {/* Date range filter */}
        {filterType === "date" && (
          <>
            <input
              type="date"
              value={createdFrom}
              onChange={(e) => {
                const from = e.target.value;
                setCreatedFrom(from);
                if (from && createdTo)
                  onApplyFilters({ createdFrom: from, createdTo });
              }}
              className="w-[150px] rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm"
            />
            <span className="text-gray-500">→</span>
            <input
              type="date"
              value={createdTo}
              onChange={(e) => {
                const to = e.target.value;
                setCreatedTo(to);
                if (createdFrom && to)
                  onApplyFilters({ createdFrom, createdTo: to });
              }}
              className="w-[150px] rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm"
            />
          </>
        )}

        {/* Action buttons */}
        {filterType === "keyword" && (
          <button
            onClick={handleSubmit}
            className="rounded bg-yellow-500 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-yellow-600"
          >
            Search
          </button>
        )}

        <button
          onClick={onResetFilters}
          className="rounded bg-amber-300 px-4 py-2 text-sm font-semibold text-yellow-800 shadow hover:bg-yellow-200"
        >
          View All
        </button>
      </div>
    </div>
  );
};
