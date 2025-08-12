import CommentItem from "./CommentItem";
import type { TaskCommentDTO } from "../comment";

type Props = {
  comments: TaskCommentDTO[];
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  taskId: string; // Thêm taskId để truyền xuống CommentItem
  token: string; 
};

const CommentList = ({ comments, activeMenuId, setActiveMenuId, taskId, token }: Props) => {
  if (comments.length === 0) {
    return <p className="text-[12px] text-gray-500 italic">No comment yet.</p>;
  }

  return (
    <>
      {comments.map((c) => (
        <CommentItem
          key={c.id}
          content={c.content}
          authorName={c.createdByName}
          avatarUrl={c.createdByAvatar}
          activeMenuId={activeMenuId}
          setActiveMenuId={setActiveMenuId}
          commentId={c.id}
          visibility={c.visibility}
          createdAt={c.createdAt}
          attachments={c.attachments}
          taskId={taskId}
          token={token}
        />
      ))}
    </>
  );
};

export default CommentList;