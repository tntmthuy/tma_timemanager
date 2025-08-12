//src\features\team\teamSlice.ts

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { MemberInvite, TeamMemberDTO, TeamResponse } from "./member";
import type { RootState } from "../../state/store";
import { api } from "../../api/axios";

// 🏢 Cấu trúc team
export type Team = {
  id: string;
  teamName: string;
  members: TeamMemberDTO[];
};

export type CalendarDay = {
  date: string;        // ngày theo format "2025-07-24"
  taskCount: number;   // số lượng task trong ngày đó
};

type TeamState = {
  teamDetail: TeamResponse | null;
  teams: Team[];
  teamRole: "OWNER" | "MEMBER" | null;
  searchResults: TeamMemberDTO[]; // 👈 lưu thành viên từ BE
  assignees: TeamMemberDTO[];
  searchError: string | null;
  newTeamSuggestions: TeamMemberDTO[];
  calendar: CalendarDay[];
};

const initialState: TeamState = {
  teamDetail: null,
  teams: [],
  teamRole: null,
  searchResults: [], 
  assignees: [],
  searchError: null, 
  newTeamSuggestions: [],
  calendar: [],
};

//lịch nhóm
export const fetchTeamCalendarThunk = createAsyncThunk(
  "team/fetchCalendar",
  async (teamId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/teams/${teamId}/calendar`);
      return res.data.days; // 👈 chỉ lấy phần days[]
    } catch {
      return rejectWithValue("Không lấy được dữ liệu lịch nhóm");
    }
  }
);


//tạo nhóm
export const createTeamThunk = createAsyncThunk<
  TeamResponse,
  {
    teamName: string;
    description: string;
    invites?: MemberInvite[]; // ✅ thêm vào để chấp nhận danh sách mời
  },
  { state: RootState }
>(
  "team/createTeam",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/teams", payload);
      return res.data.data;
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.message;
      if (msg === "TEAM_CREATE_LIMIT_FOR_FREE_USER") {
        return rejectWithValue("TEAM_LIMIT");
      }
      return rejectWithValue("CREATE_FAILED");
    }
  }
);

//kiếm toàn bộ
export const searchNewTeamMembersThunk = createAsyncThunk(
  "team/searchNewTeamMembers",
    async (keyword: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/user/search-new-team`, {
        params: { keyword },
      });

      return res.data.data; // 👈 lấy toàn bộ
    } catch {
      return rejectWithValue("SEARCH_FAILED");
    }
  }
);

export const searchMembersInTeamThunk = createAsyncThunk(
  "team/searchMembers",
  async (
    { teamId, keyword }: { teamId: string; keyword: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get(`/api/teams/${teamId}/members/search`, {
        params: { keyword },
      });
      return res.data.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        return rejectWithValue("UNAUTHORIZED");
      }
      return rejectWithValue("SEARCH_FAILED");
    }
  }
);

//tìm assignees
export const fetchAssigneesOfTaskThunk = createAsyncThunk(
  "team/fetchAssignees",
  async (taskId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/kanban/task/${taskId}/assignees`);
      return res.data.data; // 👈 mảng assignee
    } catch {
      return rejectWithValue("FAILED_TO_FETCH_ASSIGNEES");
    }
  }
);

//gán task 
export const assignMemberToTaskThunk = createAsyncThunk(
  "task/assignMember",
  async (
    { taskId, memberId }: { taskId: string; memberId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(
        `/api/kanban/task/${taskId}/assign`,
        { memberIds: [memberId] },        
      );
      return res.data.data; // ✅ Task sau khi gán xong
    } catch {
      return rejectWithValue("ASSIGN_FAILED");
    }
  }
);

//hủy assign
export const unassignMemberFromTaskThunk = createAsyncThunk(
  "task/unassignMember",
  async (
    { taskId, memberId }: { taskId: string; memberId: string },
    {  rejectWithValue }
  ) => {
    try {
      const res = await api.put(
        `/api/kanban/task/${taskId}/unassign`,
        { memberIds: [memberId] },
      );
      return res.data.data; // ✅ Updated Task
    } catch {
      return rejectWithValue("UNASSIGN_FAILED");
    }
  }
);

//lấy danh sách nhóm đang tham gia
// teamSlice.ts
export const fetchAllTeamsThunk = createAsyncThunk(
  "team/fetchAllTeams",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/teams");
      const list = Array.isArray(res.data.data) ? res.data.data : [];
      return list;
    } catch {
      return rejectWithValue("FAILED_TO_FETCH_TEAMS");
    }
  }
);

// danh sách member
export const fetchTeamDetailThunk = createAsyncThunk(
  "team/fetchTeamDetail",
  async (teamId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/teams/${teamId}`);      
      return res.data.data; // ✅ Trả về kiểu TeamResponse
    } catch {
      return rejectWithValue("FAILED_TO_FETCH_TEAM_DETAIL");
    }
  }
);

//gửi lời mời
export const inviteMemberToTeamThunk = createAsyncThunk<
  string,
  { teamId: string; email: string },
  { state: RootState }
>(
  "team/inviteMember",
  async ({ teamId, email }, { rejectWithValue }) => {
    try {
      await api.post(
        `/api/teams/${teamId}/members`,
        [{ email }],        
      );
      return "Invitation sent successfully. Awaiting confirmation.";
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        return rejectWithValue("FORBIDDEN_INVITE"); // ✅ báo lỗi quyền
      }
      return rejectWithValue("ALREADY_INVITED");
    }
  }
);

//nhượng quyền
export const transferOwnershipThunk = createAsyncThunk<
  string,
  { teamId: string; userId: string }
>(
  "team/transferOwnership",
  async ({ teamId, userId }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/teams/${teamId}/members/${userId}/role`, {
        newRole: "OWNER",
      });

      return res.data.message || "Cập nhật vai trò thành công!";
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to transfer ownership.";

      return rejectWithValue(msg);
    }
  }
);

//kick khỏi nhóm
export const removeTeamMemberThunk = createAsyncThunk<
  string,
  { teamId: string; userId: string },
  { state: RootState }
>(
  "team/removeMember",
  async ({ teamId, userId }, { rejectWithValue }) => {

    try {
      const res = await api.delete(`/api/teams/${teamId}/members/${userId}`);
      return res.data.message || "Member removed!";
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const msg = err.response?.data?.message || "Lỗi từ server";
          return rejectWithValue(msg);
        }
        return rejectWithValue("Lỗi không xác định");
      }
  }
);

//xóa nhóm
export const deleteTeamThunk = createAsyncThunk<
  string, // trả về message
  string, // teamId
  { state: RootState }
>("team/deleteTeam", async (teamId, { rejectWithValue }) => {
  try {
    await api.delete(`/api/teams/${teamId}`);
    return "Team deleted successfully."; 
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 403) {
      return rejectWithValue("FORBIDDEN_DELETE");
    }
    return rejectWithValue("FAILED_TO_DELETE_TEAM");
  }
});

//leave team
export const leaveTeamThunk = createAsyncThunk<
  string, // trả về message
  string, // teamId
  { state: RootState }
>(
  "team/leaveTeam",
  async (teamId, { rejectWithValue }) => {

    try {
      const res = await api.delete(`/api/teams/${teamId}/leave`);
      return res.data.message || "You’ve left the team.";
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        return rejectWithValue("FORBIDDEN_LEAVE");
      }

      return rejectWithValue("FAILED_TO_LEAVE_TEAM");
    }
  }
);

//Slice
const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    // 👨‍👩‍👧‍👦 Set danh sách team
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
    },

    // ✏️ Cập nhật tên team
    updateTeamName: (
      state,
      action: PayloadAction<{ id: string; newName: string }>
    ) => {
      const team = state.teams.find((t) => t.id === action.payload.id);
      if (team) {
        team.teamName = action.payload.newName;
      }
    },

    // 👑 Set quyền hiện tại (OWNER | MEMBER)
    setTeamRole: (state, action: PayloadAction<"OWNER" | "MEMBER">) => {
      state.teamRole = action.payload;
    },
  },
  extraReducers: (builder) => {
  builder
    .addCase(fetchTeamCalendarThunk.fulfilled, (state, action) => {
      state.calendar = action.payload;
    })
    .addCase(fetchTeamCalendarThunk.rejected, (state) => {
      state.calendar = []; // hoặc giữ nguyên nếu muốn preserve
    })

    .addCase(searchMembersInTeamThunk.fulfilled, (state, action) => {
      state.searchResults = action.payload;
      state.searchError = null;
    })
    .addCase(searchMembersInTeamThunk.rejected, (state, action) => {
      state.searchResults = [];
      state.searchError = action.payload as string;
    })
    .addCase(fetchAssigneesOfTaskThunk.fulfilled, (state, action) => {
      state.assignees = action.payload;
    })
    .addCase(assignMemberToTaskThunk.fulfilled, (state, action) => {
      state.assignees = action.payload.assignees; // ✅ cập nhật danh sách người được giao
    });
    builder.addCase(fetchAllTeamsThunk.fulfilled, (state, action) => {
      state.teams = action.payload;
    });
    builder.addCase(fetchTeamDetailThunk.fulfilled, (state, action) => {
      state.teamDetail = action.payload;
    });
    builder.addCase(searchNewTeamMembersThunk.fulfilled, (state, action) => {
      state.newTeamSuggestions = action.payload;
    });
    builder.addCase(createTeamThunk.fulfilled, (state, action) => {
      state.teams.push(action.payload); // ✅ thêm team mới vào danh sách
    });
    builder.addCase(deleteTeamThunk.fulfilled, (state, action) => {
      // `action.meta.arg` chính là `teamId` mà bạn đã truyền khi dispatch
      state.teams = state.teams.filter((team) => team.id !== action.meta.arg);
    });
    builder.addCase(leaveTeamThunk.fulfilled, (state, action) => {
      state.teams = state.teams.filter((t) => t.id !== action.meta.arg);
    });
    
}
});

// Selector trả về mảng thành viên
export const selectTeamMembers = createSelector(
  (state: RootState) => state.team.teamDetail,
  (teamDetail) => teamDetail?.members || []
);

export const { setTeams, updateTeamName, setTeamRole } = teamSlice.actions;
export default teamSlice.reducer;