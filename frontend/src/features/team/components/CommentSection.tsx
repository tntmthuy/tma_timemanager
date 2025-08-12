import { useState } from "react";
import CommentList from "./CommentList"; // ✅ import đúng
import type { TaskCommentDTO } from "../comment";

type CommentSectionProps = {
  isCollapsed?: boolean;
  hideInput?: boolean;
  comments: TaskCommentDTO[];
  input?: string;
  onChangeInput?: (text: string) => void;
  onSubmit?: () => void;
  taskId: string;
  token: string;
};

export const CommentSection = ({
  isCollapsed = false,
  comments,
  taskId,
  token,
}: CommentSectionProps) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {!isCollapsed && (
        <div className="space-y-2 pr-1">
          <CommentList
            comments={comments}
            activeMenuId={activeMenuId}
            setActiveMenuId={setActiveMenuId}
            taskId={taskId} 
            token={token}
          />
        </div>
      )}
    </div>
  );
};