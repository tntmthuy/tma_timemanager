// src/features/team/components/ConfirmModal.tsx
export function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
}: {
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-[280px] max-w-xs rounded-xl bg-white px-6 py-6 text-center shadow-xl">
        {/* Nút Close */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 transition hover:text-gray-600"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex justify-center">
          <img
            src="/images/warning.png" 
            alt="Trash"
            className="h-45 w-50"
          />
        </div>

        {/* Tiêu đề */}
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>

        {/* Văn bản đúng dòng như ảnh */}
        <p className="text-[10px] whitespace-pre-line text-gray-600">
          {message}
        </p>

        <div className="mt-3 flex flex-col items-center space-y-3">
          {/* Confirm button */}
          <button
            onClick={onConfirm}
            className="w-28 rounded-3xl border border-b-4 border-yellow-500 px-4 py-1.5 text-sm font-bold text-yellow-800 transition hover:bg-yellow-300"
          >
            Confirm
          </button>
          {/* Cancel button */}
          <button
            onClick={onCancel}
            className="w-28 rounded-3xl px-4 py-1.5 text-xs text-yellow-700 transition hover:text-yellow-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
