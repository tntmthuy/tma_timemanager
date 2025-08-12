// src/features/team/subtaskSlice.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios";
import axios from "axios";

export const updateSubtaskThunk = createAsyncThunk(
  "subtask/update",
  async ({ id, title }: { id: string; title: string }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/kanban/task/subtask/${id}`, { title });
      return res.data.data; // hoặc res.data nếu BE không bọc trong .data
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Không thể cập nhật subtask";

      return rejectWithValue(message);
    }
  }
);
