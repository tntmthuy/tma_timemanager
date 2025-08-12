// src/features/admin/components/UserSearchBar.tsx
import { useState } from "react";

type Props = {
  onSearch: (keyword: string) => void;
};

export const UserSearchBar = ({ onSearch }: Props) => {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-3">
      <input
        type="text"
        placeholder="Search by name or email..."
        className="flex-1 rounded border border-yellow-300 px-3 py-2 text-sm"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button
        type="submit"
        className="rounded bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-700"
      >
        Search
      </button>
    </form>
  );
};