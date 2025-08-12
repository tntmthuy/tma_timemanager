type ImagePreviewModalProps = {
  url: string;
  onClose: () => void;
};

const ImagePreviewModal = ({ url, onClose }: ImagePreviewModalProps) => {
  return (
    <div
      className="bg-opacity-70 fixed inset-0 z-[100] flex items-center justify-center bg-gray-900"
      onClick={onClose}
    >
      {/* ✖ Nút đóng */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-3 right-3 text-[22px] text-white hover:text-gray-300"
      >
        ✖
      </button>

      {/* ⬇️ Nút tải xuống */}
      <a
        href={url}
        target="_blank"
        download
        onClick={(e) => e.stopPropagation()}
        className="absolute top-3 left-3 flex items-center gap-1 rounded bg-black/30 px-2 py-1 text-xs text-white hover:bg-black/50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
          />
        </svg>

        <span>Download</span>
      </a>

      {/* 🖼 Ảnh preview */}
      <img
        src={url}
        alt="Preview"
        className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-xl transition-transform duration-200"
      />
    </div>
  );
};

export default ImagePreviewModal;
