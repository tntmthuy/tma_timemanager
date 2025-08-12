//src\features\team\commentSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../api/axios";
import type { AttachedFileDTO, TaskCommentDTO } from "./comment";

type CreateCommentPayload = {
  taskId: string;
  content: string;
  visibility?: "PUBLIC" | "PRIVATE";
  visibleToUserIds?: string[];
  attachments?: AttachedFileDTO[];
};

import { createSelector } from "@reduxjs/toolkit";

export const makeSelectCommentsByTask = (taskId: string) =>
  createSelector(
    [(state) => state.comments.byTask],
    (byTask) => byTask[taskId] ?? []
  );

//comment of task
export const fetchTaskComments = createAsyncThunk(
  "comments/fetchTaskComments",
  async ({ taskId }: { taskId: string }) => {
    const res = await api.get(`/api/comment/task/${taskId}`);
    return res.data.data as TaskCommentDTO[];
  }
);

//create comment
export const createCommentThunk = createAsyncThunk(
  "comments/createComment",
  async (
    payload: CreateCommentPayload,
    { rejectWithValue }
  ) => {
    const {
      taskId,
      content,
      visibility = "PUBLIC",
      visibleToUserIds = [],
      attachments = [],
    } = payload;

     try {
      const res = await api.post("/api/comment/task", {
        taskId,
        content,
        visibility,
        visibleToUserIds,
        attachments,
      });
      return res.data.data as TaskCommentDTO;
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Không thể gửi bình luận";

      return rejectWithValue(message);
    }
  }
);

//xóa
export const deleteCommentThunk = createAsyncThunk(
  "comments/deleteComment",
  async (
    { commentId, taskId }: { commentId: string; taskId: string; },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.delete(`/api/comment/${commentId}`);
      return {
        commentId,
        taskId,
        updatedAttachments: Array.isArray(res.data.data) ? res.data.data : [],
      };

    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Không thể xoá bình luận";

      return rejectWithValue(message);
    }
  }
);

//lấy file nguyên team
export const fetchTeamAttachments = createAsyncThunk(
  "comments/fetchTeamAttachments",
  async ({ teamId }: { teamId: string }) => {
    const res = await api.get(`/api/teams/${teamId}/attachments`);
    return res.data as AttachedFileDTO[];
  }
);

//Slice
const commentSlice = createSlice({
  name: "comments",
  initialState: {
    byTask: {} as Record<string, TaskCommentDTO[]>,
    attachments: [] as AttachedFileDTO[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTaskComments.fulfilled, (state, action) => {
      // console.log("📦 Fetched comments:", action.payload);
      const taskId = action.meta.arg.taskId;
      state.byTask[taskId] = action.payload;
    });
    builder.addCase(createCommentThunk.fulfilled, (state, action) => {
      const newComment = action.payload;
      const taskId = action.meta.arg.taskId;

      // Gút: thêm bình luận mới vào byTask
      if (!state.byTask[taskId]) {
        state.byTask[taskId] = [];
      }
      state.byTask[taskId].unshift(newComment);

      // 👇 Gút thêm: nếu bình luận có attachments thì cập nhật luôn file list
      if (Array.isArray(newComment.attachments) && newComment.attachments.length > 0) {
        state.attachments = [...newComment.attachments, ...state.attachments];
      }
    });
    builder.addCase(deleteCommentThunk.fulfilled, (state, action) => {
      const { commentId, taskId, updatedAttachments } = action.payload;
      
      // 🧹 Xoá bình luận khỏi danh sách hiển thị
      if (state.byTask[taskId]) {
        state.byTask[taskId] = state.byTask[taskId].filter((c) => c.id !== commentId);
      }

      // 🔄 Cập nhật lại danh sách file đính kèm nếu có
      if (Array.isArray(updatedAttachments)) {
        state.attachments = [...updatedAttachments];
      }
    });
    builder.addCase(fetchTeamAttachments.fulfilled, (state, action) => {
      state.attachments = action.payload;
    });

  },
});

export default commentSlice.reducer;