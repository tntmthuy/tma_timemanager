import { useEffect, useState } from "react";
import { useAppSelector } from "../../../state/hooks";
import ImagePreviewModal from "./previewimg/ImagePreviewModal";

export const TeamFileList = () => {
  const attachments = useAppSelector((state) => state.comments.attachments);
  useEffect(() => {
    console.log("📋 attachments from Redux:", attachments);
  }, [attachments]);
  //modal
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const getFileEmoji = (type: string) => {
    if (type === "PDF")
      return (
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
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>
      );
    if (type === "IMAGE")
      return (
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
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      );
    if (type === "WORD") return "📘";
    if (type === "EXCEL") return "📊";
    if (type === "ARCHIVE") return "🗜️";
    return "📎";
  };

  if (!Array.isArray(attachments) || attachments.length === 0)
    return (
      <div className="w-full p-4 text-sm text-gray-600">
        📂 Looks like this team doesn't have any shared files yet.
      </div>
    );

  return (
    <div className="w-full p-4">
      {/* 🔰 Tổng quan */}
      <div className="mb-3 text-sm text-gray-600">
        Total Files: <span className="font-semibold">{attachments.length}</span>
      </div>

      {/* 📋 Bảng cuộn với tiêu đề cố định */}
      <div className="max-h-[400px] overflow-y-auto">
        <table className="min-w-full table-auto border-separate border-spacing-y-3">
          <thead className="sticky top-0 z-10 bg-yellow-100">
            <tr className="text-xs text-gray-500">
              <th className="px-2 py-2 text-left uppercase">File name</th>
              <th className="px-2 py-2 text-left uppercase">Type</th>
              <th className="px-2 py-2 text-left uppercase">Size</th>
              <th className="px-2 py-2 text-center uppercase">Uploaded by</th>
              <th className="px-2 py-2 text-center uppercase">Date</th>
              <th className="px-2 py-2 text-center uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {attachments.map((file) => (
              <tr
                key={file.id}
                className="border-b border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
              >
                <td
                  className="cursor-pointer border-b border-gray-300 px-2 py-2"
                  onClick={() => {
                    if ((file.uiType || file.type) === "IMAGE") {
                      setPreviewUrl(file.url);
                    } else {
                      window.open(file.url, "_blank");
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    {/* SVG icon */}
                    {getFileEmoji(file.uiType || file.type || "OTHER")}

                    {/* Tên file */}
                    <span>{file.name}</span>
                  </div>

                  {/* Modal preview nếu có */}
                  {previewUrl && (
                    <ImagePreviewModal
                      url={previewUrl}
                      onClose={() => setPreviewUrl(null)}
                    />
                  )}
                </td>
                <td className="border-b border-gray-300 px-2 py-2">
                  {file.uiType || file.type}
                </td>
                <td className="border-b border-gray-300 px-2 py-2">
                  {file.displaySize}
                </td>
                <td className="border-b border-gray-300 px-2 py-2 text-center">
                  <div className="group relative flex min-h-[28px] justify-center">
                    <img
                      src={file.uploadedByAvatar || "/default-avatar.png"}
                      alt={file.uploadedByName}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <div className="absolute bottom-1/5 left-1/2 ml-2 -translate-y-1/2 rounded bg-gray-800 px-2 py-[2px] text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      {file.uploadedByName}
                    </div>
                  </div>
                </td>
                <td className="border-b border-gray-300 px-2 py-2 text-center">
                  {formatDate(file.createdAt)}
                </td>
                <td className="border-b border-gray-300 px-2 py-2">
                  <div className="flex h-full items-center justify-center">
                    <a
                      href={file.url}
                      target="_blank"
                      download={file.downloadName || file.name}
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775
           5.25 5.25 0 0 1 10.233-2.33
           3 3 0 0 1 3.758 3.848
           A3.752 3.752 0 0 1 18 19.5H6.75Z"
                        />
                      </svg>
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
