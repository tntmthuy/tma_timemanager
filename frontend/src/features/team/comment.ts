//src\features\team\comment.ts
export type Comment = {
  id: number;
  content: string;
  isCollapsed: boolean;
};

export type TaskCommentDTO = {
  id: string;
  content: string;
  createdById: string;
  createdByName: string;
  createdByAvatar: string;
  createdAt: string;
  updatedAt: string;
  visibility: "PUBLIC" | "PRIVATE";
  visibleToUserIds: string[];
  attachments?: AttachedFileDTO[];
};

export type AttachedFileDTO = {
  id: string | null;
  name: string;
  url: string;
  mimeType: string; // ⬅️ đổi từ fileType cho rõ nghĩa
  uiType: "IMAGE" | "PDF" | "WORD" | "EXCEL" | "ARCHIVE" | "OTHER"; // ⬅️ dùng cho icon UI
  type?: "IMAGE" | "PDF" | "WORD" | "EXCEL" | "ARCHIVE" | "OTHER";
  size: number;
  displaySize: string;
  downloadName?: string; // ⬅️ nếu muốn đổi tên khi tải về
  isPreviewable?: boolean; // ⬅️ dùng để kiểm tra có thể hiển thị thumbnail

  uploadedByName: string;         // ✅ mới ➤ tên người upload
  uploadedByAvatar?: string;      // ✅ mới ➤ avatar nếu có
  createdAt: string;              // ✅ mới ➤ ngày gửi file
  taskTitle?: string;             // ✅ mới ➤ nếu muốn hiển thị file thuộc task nào
};
