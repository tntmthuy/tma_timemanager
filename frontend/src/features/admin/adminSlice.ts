// src/features/admin/adminSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios";
import type { TeamMemberDTO } from "../team/member";

export type Role = "FREE" | "PREMIUM" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED";

export type TeamSummaryDto = {
  teamId: string;
  teamName: string;
  description: string;
  createdBy: string | null;
  createdByAvatarUrl: string | null;
  ownerFullName: string | null;
  ownerAvatarUrl: string | null;
  createdAt: string;
  members: TeamMemberDTO[];
  totalFiles: number;
  totalComments: number;
  totalTasks: number;
};

export type UserSummaryDto = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
};

// ✅ DTO lọc người dùng nâng cấp
export type SearchRequestDto = {
  keyword?: string;
  role?: Role;
  createdFrom?: string;
  createdTo?: string;
};

// 🔎 Thunk tìm kiếm theo từ khoá đơn giản
export const searchUsersByKeyword = createAsyncThunk<
  UserSummaryDto[],
  string,
  { rejectValue: string }
>("admin/searchUsersByKeyword", async (keyword, { rejectWithValue }) => {
  try {
    const res = await api.post("/api/admin/users/search", {
      firstname: keyword,
      lastname: keyword,
      email: keyword,
    });
    return res.data.data;
  } catch {
    return rejectWithValue("Không thể tìm kiếm người dùng");
  }
});

// 🔍 Thunk tìm kiếm nâng cao (theo nhiều tiêu chí)
export const searchUsersByCriteria = createAsyncThunk<
  UserSummaryDto[],
  SearchRequestDto,
  { rejectValue: string }
>("admin/searchUsersByCriteria", async (filters, { rejectWithValue }) => {
  try {
    const res = await api.post("/api/admin/users/search", filters);
    return res.data.data;
  } catch {
    return rejectWithValue("Không thể lọc người dùng");
  }
});

// 📋 Lấy danh sách người dùng toàn bộ
export const fetchUserList = createAsyncThunk<
  UserSummaryDto[],
  void,
  { rejectValue: string }
>("admin/fetchUserList", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/admin/users");
    return res.data.data;
  } catch {
    return rejectWithValue("Không thể lấy danh sách người dùng");
  }
});

// 🔄 Cập nhật vai trò người dùng
export const updateUserRole = createAsyncThunk<
  { id: string; role: Role },
  { id: string; role: Role },
  { rejectValue: string }
>("admin/updateUserRole", async ({ id, role }, { rejectWithValue }) => {
  try {
    await api.put(`/api/admin/users/${id}/role`, { role });
    return { id, role };
  } catch {
    return rejectWithValue("Không thể cập nhật vai trò");
  }
});

// 🗑️ Xoá người dùng
export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("admin/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/admin/users/${id}`);
    return id;
  } catch {
    return rejectWithValue("Không thể xoá người dùng");
  }
});

// 📂 Lấy danh sách nhóm
export const fetchTeamSummaryList = createAsyncThunk<
  TeamSummaryDto[],
  void,
  { rejectValue: string }
>("admin/fetchTeamSummaryList", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/admin/teams");
    return res.data;
  } catch {
    return rejectWithValue("Không thể lấy danh sách nhóm");
  }
});

//xóa nhóm
export const deleteTeamById = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("admin/deleteTeamById", async (teamId, { rejectWithValue }) => {
  try {
    await api.delete(`/api/admin/teams/${teamId}`);
    return teamId;
  } catch {
    return rejectWithValue("Không thể xoá nhóm");
  }
});

// 🧩 Slice state
type AdminState = {
  users: UserSummaryDto[];
  loadingUsers: boolean;
  errorUsers: string | null;
  deletingUserId: string | null;
  teams: TeamSummaryDto[];
  loadingTeams: boolean;
  errorTeams: string | null;
  deletingTeamId: string | null;
};

const initialState: AdminState = {
  users: [],
  loadingUsers: false,
  errorUsers: null,
  deletingUserId: null,
  teams: [],
  loadingTeams: false,
  errorTeams: null,
  deletingTeamId: null,
};

// 🍰 Slice
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearErrorUsers(state) {
      state.errorUsers = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🧾 Fetch users
      .addCase(fetchUserList.pending, (state) => {
        state.loadingUsers = true;
        state.errorUsers = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.users = action.payload;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loadingUsers = false;
        state.errorUsers = action.payload ?? "Có lỗi xảy ra";
      })

      // 🔄 Update role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const { id, role } = action.payload;
        const user = state.users.find((u) => u.id === id);
        if (user) {
          user.role = role;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.errorUsers = action.payload ?? "Có lỗi khi cập nhật vai trò";
      })

      // 🗑 Delete user
      .addCase(deleteUser.pending, (state, action) => {
        state.deletingUserId = action.meta.arg;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.deletingUserId = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.errorUsers = action.payload ?? "Có lỗi khi xoá người dùng";
        state.deletingUserId = null;
      })

      // 📂 Fetch teams
      .addCase(fetchTeamSummaryList.pending, (state) => {
        state.loadingTeams = true;
        state.errorTeams = null;
      })
      .addCase(fetchTeamSummaryList.fulfilled, (state, action) => {
        state.loadingTeams = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeamSummaryList.rejected, (state, action) => {
        state.loadingTeams = false;
        state.errorTeams = action.payload ?? "Có lỗi khi lấy danh sách nhóm";
      })

      // 🔍 Search by keyword
      .addCase(searchUsersByKeyword.pending, (state) => {
        state.loadingUsers = true;
        state.errorUsers = null;
      })
      .addCase(searchUsersByKeyword.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.users = action.payload;
      })
      .addCase(searchUsersByKeyword.rejected, (state, action) => {
        state.loadingUsers = false;
        state.errorUsers = action.payload ?? "Lỗi khi tìm kiếm";
      })

      // 🔎 Search by criteria
      .addCase(searchUsersByCriteria.pending, (state) => {
        state.loadingUsers = true;
        state.errorUsers = null;
      })
      .addCase(searchUsersByCriteria.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.users = action.payload;
      })
      .addCase(searchUsersByCriteria.rejected, (state, action) => {
        state.loadingUsers = false;
        state.errorUsers = action.payload ?? "Lỗi khi lọc người dùng";
      })
      // Delete team
      .addCase(deleteTeamById.pending, (state, action) => {
        state.deletingTeamId = action.meta.arg;
      })
      .addCase(deleteTeamById.fulfilled, (state, action) => {
        state.teams = state.teams.filter((t) => t.teamId !== action.payload);
        state.deletingTeamId = null;
      })
      .addCase(deleteTeamById.rejected, (state, action) => {
        state.errorTeams = action.payload ?? "Có lỗi khi xoá nhóm";
        state.deletingTeamId = null;
      })
      ;
  },
});

export const { clearErrorUsers } = adminSlice.actions;
export default adminSlice.reducer;