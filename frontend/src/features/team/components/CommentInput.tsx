//src\features\team\components\CommentInput.tsx
import { useRef, useEffect } from "react";
import type { TeamMemberDTO } from "../member";
import toast from "react-hot-toast";
import type { AttachedFileDTO } from "../comment";
// import toast from "react-hot-toast";
// import type { AttachedFileDTO } from "../comment";

type CommentInputProps = {
  avatarUrl?: string;
  value: string;
  attachments: AttachedFileDTO[];
  onChange: (text: string) => void;
  onSubmit: (files: File[]) => void;

  // 👇 Thêm các prop mới để xử lý notify
  notifyKeyword: string;
  onNotifyChange: (text: string) => void;
  searchResults: TeamMemberDTO[];
  selectedUserIds: string[];
  onAddNotifyUser: (id: string) => void;
  onRemoveNotifyUser: (id: string) => void;
  onAttachRawFiles?: (files: File[]) => void; // dùng khi vừa chọn file
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onClearFiles?: () => void;
  isSending?: boolean;
};

//nhận biết đuôi là ảnh
// const isImageFile = (file: AttachedFileDTO) => file.uiType === "IMAGE";
const isRawImageFile = (file: File) => file.type.startsWith("image/");

export const CommentInput = ({
  avatarUrl,
  value,
  attachments,
  onChange,
  onSubmit,
  notifyKeyword,
  onNotifyChange,
  searchResults,
  selectedUserIds,
  onAddNotifyUser,
  onRemoveNotifyUser,
  setSelectedFiles,
  selectedFiles,
  onClearFiles,
  isSending,
}: CommentInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 🎯 Auto resize height theo nội dung, max 4 dòng
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto"; // reset trước
      const maxLines = 4;
      const lineHeight = 24; // 1.5rem = 24px
      const maxHeight = maxLines * lineHeight;

      el.style.height = Math.min(el.scrollHeight, maxHeight) + "px"; // tăng dần → max, sau đó scroll
    }
  }, [value]);

  //xử lý tệp
  // const files = selectedFiles;

  useEffect(() => {
    if (attachments.length === 0) {
      setSelectedFiles([]); // ✅ clear nếu cha reset
    }
  }, [attachments, setSelectedFiles]);

  return (
    <div className="flex items-start gap-3">
      {/* 💬 Khung input đầy đủ */}
      <div className="flex flex-grow flex-col items-start rounded border border-gray-300 bg-white px-3 py-2 focus-within:ring-1 focus-within:ring-black">
        {/* 💬 Notify + Input cùng dòng */}
        <div className="mb-2 flex w-full items-start gap-1 text-sm text-gray-700">
          <span className="inline-block rounded bg-gray-200 px-2 py-1 font-semibold text-black">
            Notify
          </span>
          <div className="flex max-w-[150px] gap-2 overflow-x-auto">
            {selectedUserIds.map((id) => {
              const member = searchResults.find((m) => m.userId === id);
              return (
                <div
                  key={id}
                  className="flex shrink-0 items-center gap-1 rounded bg-gray-100 px-2 py-1"
                >
                  <img
                    src={member?.avatarUrl ?? "/placeholder-avatar.png"}
                    alt={member?.fullName}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-800">
                    {member?.fullName}
                  </span>
                  <button
                    onClick={() => onRemoveNotifyUser(id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
          {/* 🔍 Khung input + gợi ý */}
          <div className="relative flex-grow">
            <input
              type="text"
              value={notifyKeyword}
              onChange={(e) => onNotifyChange(e.target.value)}
              placeholder="Nobody"
              className="border-none px-3 py-2 text-sm text-gray-700 outline-none focus:ring-0 focus:outline-none"
            />

            {/* 🧠 Gợi ý 1 kết quả ngay dưới input */}
            {notifyKeyword.trim() !== "" && (
              <ul className="absolute top-full left-0 z-50 inline-block max-w-[240px] min-w-[100px] rounded border border-gray-300 bg-white shadow">
                {" "}
                {searchResults
                  .filter((m) => !selectedUserIds.includes(m.userId))
                  .slice(0, 1)
                  .map((member) => (
                    <li
                      key={member.userId}
                      onMouseDown={() => {
                        onAddNotifyUser(member.userId);
                        onNotifyChange("");
                      }}
                      className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <img
                        src={member.avatarUrl ?? "/placeholder-avatar.png"}
                        alt={member.fullName}
                        className="h-5 w-5 rounded-full object-cover"
                      />
                      <span>{member.fullName}</span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        {/* Xử lý nhập dữ liệu */}
        {/* 📄 Hiển thị danh sách file đã chọn */}
        <div className="w-full space-y-1 text-sm text-gray-700">
          {selectedFiles.slice(0, 5).map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between gap-1"
            >
              {/* 📎 Icon + tên file */}
              <div className="flex items-center gap-1 truncate">
                {isRawImageFile(file) ? (
                  // 🖼 Icon cho ảnh
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-4 w-4 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 
              1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 
              3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 
              0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 
              1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 
              0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                ) : (
                  // 📄 Icon cho file khác
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-4 w-4 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 
              1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 
              0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 
              1.125v17.25c0 .621.504 1.125 1.125 
              1.125h12.75c.621 0 1.125-.504 
              1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                )}
                <span className="w-full truncate">{file.name}</span>
              </div>

              {/* ✖ Nút xoá */}
              <button
                onClick={() =>
                  setSelectedFiles((prev) =>
                    prev.filter((f) => f.name !== file.name),
                  )
                }
                className="ml-2 text-xs text-red-500 hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* ✏️ Khung nhập + icon gửi */}
        <div className="mt-2 flex w-full items-start gap-2">
          <img
            src={avatarUrl ?? "/placeholder-avatar.png"}
            alt="Avatar"
            className="h-6 w-6 rounded-full object-cover"
          />

          <textarea
            ref={textareaRef}
            // value={value}
            onChange={(e) => {
              onChange(e.target.value); // ✅ Gọi logic xử lý nội dung (cho textarea, input text)
              // e.target.value = ""; // ✅ Reset giá trị sau khi chọn ➤ cho phép chọn lại cùng nội dung
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(selectedFiles);
                onClearFiles?.();
              }
            }}
            placeholder={isSending ? "Sending..." : "Write a comment..."}
            disabled={isSending}
            value={isSending ? "" : value}

            rows={1}
            className="flex-grow resize-none overflow-y-auto border-none text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
            style={{
              lineHeight: "1.5rem",
              maxHeight: "6rem",
            }}
          />

          {/* 📎 Chọn tệp */}
          <label htmlFor="fileUpload" className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5 text-gray-700 hover:text-gray-500"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.97 3.659a2.25 2.25 0 0 0-3.182 0l-10.94 10.94a3.75 
        3.75 0 1 0 5.304 5.303l7.693-7.693a.75.75 0 0 1 1.06 
        1.06l-7.693 7.693a5.25 5.25 0 1 1-7.424-7.424l10.939-10.94a3.75 
        3.75 0 1 1 5.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002
        -.003.002A2.25 2.25 0 0 1 5.91 15.66l7.81-7.81a.75.75 
        0 0 1 1.061 1.06l-7.81 7.81a.75.75 0 0 0 1.054 
        1.068L18.97 6.84a2.25 2.25 0 0 0 0-3.182Z"
              />
            </svg>
          </label>

          {/* 🗂️ Input file (ẩn) */}
          <input
            id="fileUpload"
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              const MAX_SIZE = 1024 * 1024;
              const files = Array.from(e.target.files ?? []);
              const validFiles = files.filter((f) => f.size <= MAX_SIZE);
              const oversizedFiles = files.filter((f) => f.size > MAX_SIZE);

              if (oversizedFiles.length > 0) {
                toast.error("Each file must be no larger than 1MB.");
              }

              const combined = [...selectedFiles, ...validFiles];
              if (combined.length > 5) {
                toast.error("You can upload up to 5 files only.");
                e.target.value = "";
                return;
              }

              setSelectedFiles(combined); // ✅ chỉ lưu tạm
              e.target.value = "";

              // ❌ XÓA dòng này để không upload sớm
              // onAttachRawFiles?.(validFiles);
            }}
          />

          {/* 🟡 Nút gửi */}
          <button
            onClick={() => onSubmit(selectedFiles)}
            className="text-yellow-500 transition hover:text-yellow-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 
        1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94c6.734-2.476 
        12.957-5.766 18.445-8.986a.75.75 0 0 0 0-1.218C16.435 7.882 
        10.212 4.592 3.478 2.404Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
