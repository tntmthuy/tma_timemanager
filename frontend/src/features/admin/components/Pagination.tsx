// src\features\admin\components\Pagination.tsx
type Props = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({ totalPages, currentPage, onPageChange }: Props) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex justify-center gap-2">
      {[...Array(totalPages)].map((_, idx) => {
        const pageNum = idx + 1;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`rounded px-3 py-1 text-sm font-semibold transition ${
              currentPage === pageNum
                ? 'bg-yellow-400 text-white'
                : 'border border-yellow-300 bg-white text-yellow-700 hover:bg-yellow-100'
            }`}
          >
            {pageNum}
          </button>
        );
      })}
    </div>
  );
};