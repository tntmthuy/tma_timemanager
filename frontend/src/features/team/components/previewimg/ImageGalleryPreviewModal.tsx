import { useEffect, useState } from "react";

type ImageGalleryPreviewModalProps = {
  images: string[];
  initialIndex: number;
  onClose: () => void;
};

const ImageGalleryPreviewModal = ({
  images,
  initialIndex,
  onClose,
}: ImageGalleryPreviewModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentUrl = images[currentIndex];

  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  // Xử lý phím mũi tên và Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, onClose]); // ✅ Không cần next/prevImage nữa

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
        href={currentUrl}
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

      {/* 🖼 Ảnh hiển thị */}
      <img
        src={currentUrl}
        alt="Preview"
        className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-xl transition-transform duration-200"
      />

      {/* 🔢 Hiển thị số ảnh */}
      <p className="absolute bottom-10 rounded bg-black/30 px-2 py-1 text-xs text-white">
        {currentIndex + 1} / {images.length}
      </p>

      {/* ⇤ ⇥ Mũi tên chuyển ảnh */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-5 text-[30px] text-white hover:text-gray-300"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-5 text-[30px] text-white hover:text-gray-300"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
};

export default ImageGalleryPreviewModal;
