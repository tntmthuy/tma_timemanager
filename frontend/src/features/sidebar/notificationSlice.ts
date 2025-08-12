// src/features/sidebar/notificationSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../state/store";
import { api } from "../../api/axios";

export type Notification = {
  id: string;
  title: string;
  content: string;
  targetUrl: string;
  type: string;
  senderName: string;
  senderAvatar: string;
  timeAgo: string;
  createdAt: string; // ISO date string
  read: boolean;
  referenceId: string; // ID của team hoặc task liên quan
  inviteStatus?: "PENDING" | "ACCEPTED" | "DECLINED";
};

type NotificationState = {
  list: Notification[];
  loading: boolean;
};

const initialState: NotificationState = {
  list: [],
  loading: false,
};

export const fetchNotificationsThunk = createAsyncThunk<
  Notification[],
  void,
  { state: RootState }
>("notification/fetch", async (_, { rejectWithValue }) => {
  try {
     const res = await api.get("/api/notifications");
    const data = Array.isArray(res.data.data) ? res.data.data : [];
    return data;
  } catch {
    return rejectWithValue("FAILED_TO_FETCH_NOTIFICATIONS");
  }
});

//mark 1 
export const markNotificationAsRead = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("notification/markAsRead", async (notificationId, { rejectWithValue }) => {
  try {
    await api.post(`/api/notifications/${notificationId}/read`);
    return notificationId;
  } catch {
    return rejectWithValue("FAILED_TO_MARK_AS_READ");
  }
});

// mark all
export const markAllNotificationsAsRead = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("notification/markAllAsRead", async (_, { rejectWithValue }) => {
  try {
    await api.post("/api/notifications/read-all");
  } catch {
    return rejectWithValue("FAILED_TO_MARK_ALL_AS_READ");
  }
});

//delete
export const deleteNotificationThunk = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("notification/delete", async (notificationId, { rejectWithValue }) => {
  try {
    await api.delete(`/api/notifications/${notificationId}`);
    return notificationId;
  } catch {
    return rejectWithValue("FAILED_TO_DELETE_NOTIFICATION");
  }
});

//delete all
export const deleteAllNotificationsThunk = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("notification/deleteAll", async (_, { rejectWithValue }) => {
  try {
    await api.delete("/api/notifications/delete-all");
  } catch {
    return rejectWithValue("FAILED_TO_DELETE_ALL_NOTIFICATIONS");
  }
});

//hệ thống thông báo
export const remindDeadlineThunk = createAsyncThunk<void, void>(
  "notification/remindDeadline",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/api/notifications/test-remind-deadline");
    } catch {
      return rejectWithValue("FAILED_TO_TRIGGER_REMINDER");
    }
  }
);

//Slice
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchNotificationsThunk.rejected, (state) => {
        state.loading = false;
        state.list = [];
      });
    builder.addCase(markNotificationAsRead.fulfilled, (state, action) => {
      const id = action.payload;
      const noti = state.list.find((n) => n.id === id);
      if (noti) {
        noti.read = true;
      }
    });
    builder.addCase(deleteNotificationThunk.fulfilled, (state, action) => {
      const id = action.payload;
      state.list = state.list.filter((n) => n.id !== id);
    });
    builder.addCase(markAllNotificationsAsRead.fulfilled, (state) => {
      state.list.forEach((noti) => {
        noti.read = true;
      });
    });
    builder.addCase(deleteAllNotificationsThunk.fulfilled, (state) => {
      state.list = [];
    });
  },
});

export default notificationSlice.reducer;