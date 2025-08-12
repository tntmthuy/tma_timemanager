// src/features/focus/focusSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../state/store";
import { api } from "../../api/axios";

export type FocusSessionResponse = {
  id: number;
  mode: string;
  targetMinutes: number;
  actualMinutes: number;
  status: string;
  startedAt: string;
  endedAt: string | null;
  description: string | null;
  message: string;
};

export type UserFocusStats = {
  userId: string;
  name: string;
  avatar: string | null;
  totalMinutes: number;
};

type DayComparison = {
  today: { minutes: number; count: number };
  yesterday: { minutes: number; count: number };
};

type WeeklyComparison = {
  thisWeek: { [key: string]: number };
  lastWeek: { [key: string]: number };
};

type FocusState = {
  sessions: FocusSessionResponse[];
  loading: boolean;
  weeklyMinutes: number;
  userStats: UserFocusStats[];
  dayComparison: DayComparison | null;
  weeklyComparison: WeeklyComparison | null;
};

const initialState: FocusState = {
  sessions: [],
  loading: false,
  weeklyMinutes: 0,
  userStats: [],
  dayComparison: null,
  weeklyComparison: null,
};

// Lấy toàn bộ phiên đã hoàn thành
export const fetchCompletedSessionsThunk = createAsyncThunk<
  FocusSessionResponse[],
  void,
  { state: RootState }
>("focus/fetchCompleted", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/focus/completed");
    const data = Array.isArray(res.data.data) ? res.data.data : [];
    return data;
  } catch {
    return rejectWithValue("FAILED_TO_FETCH_SESSIONS");
  }
});

// Lấy số phút tập trung tuần này
export const fetchWeeklyMinutesThunk = createAsyncThunk<
  number,
  void,
  { state: RootState }
>("focus/fetchWeeklyMinutes", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/focus/stats/week");
    return typeof res.data.data === "number" ? res.data.data : 0;
  } catch {
    return rejectWithValue("FAILED_TO_FETCH_WEEKLY_MINUTES");
  }
});

// Khởi tạo phiên tập trung mới
export const startSessionThunk = createAsyncThunk<
  FocusSessionResponse,
  { targetMinutes: number; description?: string },
  { state: RootState }
>("focus/startSession", async ({ targetMinutes, description }, { rejectWithValue }) => {
  try {
    const res = await api.post("/api/focus/start", null, {
      params: { targetMinutes, description },
    });
    return res.data.data;
  } catch {
    return rejectWithValue("FAILED_TO_START_SESSION");
  }
});

// Kết thúc phiên tập trung
export const endSessionThunk = createAsyncThunk<
  FocusSessionResponse,
  { sessionId: number; actualMinutes: number },
  { state: RootState }
>("focus/endSession", async ({ sessionId, actualMinutes }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/api/focus/end/${sessionId}`, null, {
      params: { actualMinutes },
    });
    return res.data.data;
  } catch {
    return rejectWithValue("FAILED_TO_END_SESSION");
  }
});

// Xóa phiên tập trung
export const deleteSessionThunk = createAsyncThunk<
  number, // trả về sessionId đã xóa
  number, // input là sessionId
  { state: RootState }
>("focus/deleteSession", async (sessionId, { rejectWithValue }) => {
  try {
    await api.delete(`/api/focus/${sessionId}`);
    return sessionId;
  } catch {
    return rejectWithValue("FAILED_TO_DELETE_SESSION");
  }
});

//focus stats
export const fetchAllUserFocusStatsThunk = createAsyncThunk<
  UserFocusStats[],
  void,
  { state: RootState }
>("focus/fetchAllUserFocusStats", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/focus/stats/all");
    const data = Array.isArray(res.data.data) ? res.data.data : [];
    return data;
  } catch {
    return rejectWithValue("FAILED_TO_FETCH_FOCUS_STATS");
  }
});

//focus stats all users in week
export const fetchWeeklyStatsAllUsersThunk = createAsyncThunk<
  UserFocusStats[],
  void,
  { state: RootState }
>("focus/fetchWeeklyStatsAllUsers", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/focus/stats/week/all");
    const data = Array.isArray(res.data.data) ? res.data.data : [];
    return data;
  } catch {
    return rejectWithValue("FAILED_TO_FETCH_WEEKLY_STATS_ALL_USERS");
  }
});

// focus stasts yesterday and today
export const fetchDayComparisonThunk = createAsyncThunk<
  DayComparison,
  void,
  { state: RootState }
>("focus/fetchDayComparison", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/focus/stats/day-comparison");
    return res.data.data;
  } catch {
    return rejectWithValue("FAILED_TO_FETCH_DAY_COMPARISON");
  }
});

//focus stats this week and last week
export const fetchWeeklyFocusComparisonThunk = createAsyncThunk<
  WeeklyComparison,
  void,
  { state: RootState }
>("focus/fetchWeeklyComparison", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/focus/stats/week/comparison");
    return res.data.data;
  } catch {
    return rejectWithValue("FAILED_TO_FETCH_WEEKLY_COMPARISON");
  }
});

//slice
const focusSlice = createSlice({
  name: "focus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompletedSessionsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompletedSessionsThunk.fulfilled, (state, action) => {
        state.sessions = action.payload;
        state.loading = false;
      })
      .addCase(fetchCompletedSessionsThunk.rejected, (state) => {
        state.loading = false;
        state.sessions = [];
      })
      .addCase(fetchWeeklyMinutesThunk.fulfilled, (state, action) => {
            state.weeklyMinutes = action.payload;
       })
       .addCase(startSessionThunk.fulfilled, (state, action) => {
            // Gửi về phiên vừa tạo → có thể push vào history hoặc không cần
            state.sessions.unshift(action.payload); // hoặc dùng fetch lại toàn bộ nếu muốn
            })
            .addCase(endSessionThunk.fulfilled, (state, action) => {
            const updated = action.payload;
            const index = state.sessions.findIndex((s) => s.id === updated.id);
            if (index !== -1) {
                state.sessions[index] = updated;
            }
        })
      .addCase(deleteSessionThunk.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.sessions = state.sessions.filter((s) => s.id !== deletedId);
      })
      .addCase(fetchAllUserFocusStatsThunk.fulfilled, (state, action) => {
        state.userStats = action.payload;
      })
    .addCase(fetchWeeklyStatsAllUsersThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchWeeklyStatsAllUsersThunk.fulfilled, (state, action) => {
      state.userStats = action.payload;
      state.loading = false;
    })
    .addCase(fetchWeeklyStatsAllUsersThunk.rejected, (state) => {
      state.loading = false;
      state.userStats = [];
    })
    .addCase(fetchDayComparisonThunk.fulfilled, (state, action) => {
      state.dayComparison = action.payload;
    })
    .addCase(fetchWeeklyFocusComparisonThunk.fulfilled, (state, action) => {
      state.weeklyComparison = action.payload;
    })
    ;
      
  },
});

export default focusSlice.reducer;