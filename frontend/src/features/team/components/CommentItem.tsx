import { useState, useEffect, useRef, useMemo } from "react";
import type { AttachedFileDTO } from "../comment";
import React from "react";
import { deleteCommentThunk, fetchTeamAttachments } from "../commentSlice";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../state/hooks";
import ImagePreviewModal from "./previewimg/ImagePreviewModal"; // đường dẫn tuỳ theo vị trí file
import ImageGalleryPreviewModal from "./previewimg/ImageGalleryPreviewModal";

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const isImageFile = (file: AttachedFileDTO) => file.type === "IMAGE";

const CommentItem = ({
  content,
  authorName,
  avatarUrl,
  commentId,
  activeMenuId,
  setActiveMenuId,
  visibility,
  createdAt,
  attachments = [],
  taskId,
  teamId,
  token,
}: {
  content: string;
  authorName?: string;
  avatarUrl?: string;
  commentId: string;
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  visibility?: "PUBLIC" | "PRIVATE"; // ⬅️ thêm dòng này
  createdAt?: string;
  attachments?: AttachedFileDTO[];
  taskId: string;
  teamId: string;
  token: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 💡 Đóng menu khi click ra ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setActiveMenuId]);

  const isLong = content.length > 200;
  const displayText =
    expanded || !isLong ? content : content.slice(0, 200) + "...";

  const isMenuOpen = activeMenuId === commentId;

  // xử lý hiển thị ảnh và file đính kèm
  const imageFiles = useMemo(
    () => attachments.filter(isImageFile),
    [attachments],
  );
  const otherFiles = useMemo(
    () => attachments.filter((f) => !isImageFile(f)),
    [attachments],
  );

  //dispatch
  const dispatch = useAppDispatch();

  //loading
  const [isDeleting, setIsDeleting] = useState(false);

  //preview image modal state
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  //preview n image
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [initialIndex, setInitialIndex] = useState(0);

  return (
    <div className="relative space-y-1 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-[12px] text-gray-800">
      {/* 🧑👤 Hàng đầu: avatar + tên + icon ba chấm */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="h-5 w-5 rounded-full object-cover"
          />
          <span className="text-[11px] font-semibold text-gray-600">
            {authorName}
          </span>
          {visibility === "PRIVATE" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-3 text-gray-400"
            >
              <path
                fillRule="evenodd"
                d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* 📍 Icon ba chấm */}
        <div className="flex items-center">
          {createdAt && (
            <p className="text-[10px] text-gray-500 italic">
              {formatDate(createdAt)}
            </p>
          )}
          <button onClick={() => setActiveMenuId(commentId)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-gray-400"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 
              1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 
              3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 
              1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
              />
            </svg>
          </button>
        </div>

        {/* 🧩 Popup menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute top-7 right-2 z-10 max-w-[70px] rounded border border-gray-200 bg-white text-[12px] text-gray-700 shadow"
          >
            <button
              className="w-full px-3 py-1 text-left text-red-500 hover:bg-gray-100"
              disabled={isDeleting}
              onClick={() => {
                setIsDeleting(true);
                dispatch(deleteCommentThunk({ commentId, taskId, token }))
                  .unwrap()
                  .then(({ updatedAttachments }) => {
                    toast.success("Đã xoá bình luận");

                    if (
                      !updatedAttachments ||
                      updatedAttachments.length === 0
                    ) {
                      setTimeout(() => {
                        dispatch(fetchTeamAttachments({ teamId, token }));
                      }, 200); // ⏳ delay nhẹ để tránh ghi đè slice mới nhận
                    }

                    setActiveMenuId(null);
                  })
                  .catch((err) => {
                    const msg =
                      typeof err === "string" ? err : "Không thể xoá bình luận";
                    toast.error(msg);
                  })
                  .finally(() => setIsDeleting(false));
              }}
            >
              {isDeleting ? "Wait..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      {attachments.length > 0 && (
        <div className="space-y-2">
          {/* 📄 Hàng file ➤ cuộn ngang */}
          {otherFiles.map((file) => (
            <a
              key={file.name}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 cursor-pointer items-center gap-1 rounded-xl bg-gray-300 px-2 py-1 hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>

              <span className="truncate font-mono text-xs">{file.name}</span>

              {/* 📎 Nút tải về riêng */}
              <span className="ml-1 text-[10px] text-blue-500 underline">
                Download
              </span>
            </a>
          ))}

          {/* 🖼 Hàng ảnh ➤ cuộn ngang */}
          {imageFiles.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pt-1">
              {imageFiles.map((file) => (
                <img
                  key={file.name}
                  src={file.url}
                  alt={file.name}
                  className="h-20 w-auto max-w-[200px] shrink-0 rounded border object-cover"
                  onClick={() => {
                    if (imageFiles.length === 1) {
                      setPreviewImageUrl(file.url); // dùng modal đơn
                    } else {
                      setGalleryImages(imageFiles.map((f) => f.url)); // dùng gallery
                      setInitialIndex(
                        imageFiles.findIndex((f) => f.url === file.url),
                      );
                    }
                  }}
                />
              ))}
              {previewImageUrl && (
                <ImagePreviewModal
                  url={previewImageUrl}
                  onClose={() => setPreviewImageUrl(null)}
                />
              )}
              {galleryImages.length > 0 && (
                <ImageGalleryPreviewModal
                  images={galleryImages}
                  initialIndex={initialIndex}
                  onClose={() => setGalleryImages([])}
                />
              )}
            </div>
          )}
        </div>
      )}
      {/* 💬 Nội dung bình luận */}
      <div
        className={`break-words whitespace-pre-wrap ${
          expanded ? "max-h-[10rem] overflow-y-auto" : ""
        }`}
      >
        {displayText}
      </div>

      {/* 🔁 Nút toggle nếu dài */}
      {isLong && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="text-[11px] text-blue-500 hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};
export default React.memo(CommentItem);
