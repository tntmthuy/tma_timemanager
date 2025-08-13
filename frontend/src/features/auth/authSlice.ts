//src\features\auth\authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../api/axios";

// 🧾 Kiểu user
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  gender: "male" | "female" | "unsure";
  avatarUrl: string | null;
  role: "FREE" | "PREMIUM" | "ADMIN"; // 👑 từ BE
  isPremium: boolean;
  isAdmin: boolean;
}

// 💾 Kiểu state auth
interface AuthState {
  token: string | null;
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed" | "mfa_required" | "verified";
  error: string | null;
  mfaEnabled: boolean;
  secretImageUri: string;
  email: string;
}

// 🧱 State khởi tạo
const initialState: AuthState = {
  token: null,
  user: null,
  status: "idle",
  error: null,
  mfaEnabled: false,
  secretImageUri: "",
  email: "",
};

// 🚀 Thunk: login
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/authenticate", payload);
      const token = res.data.access_token;
      localStorage.setItem("token", token);
      return { token }; // ✅ chỉ trả token
    } catch (err) {
      if (axios.isAxiosError(err)) {
  const backendMessage = err.response?.data?.message;

  if (backendMessage === "MFA_REQUIRED") {
    return rejectWithValue("MFA_REQUIRED");
  }

  // ✅ FE có thể bắt được lỗi này rõ ràng
  return rejectWithValue("Invalid credentials or account not found.");
}

// ❌ Nếu không phải Axios error
return rejectWithValue("Something went wrong. Please try again.");
    }
  }
);

// 🚀 Thunk: register
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (
    form: { firstname: string; lastname: string; email: string; password: string; mfaEnabled: boolean },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/api/auth/register", form);
      return {
        secretImageUri: res.data.secretImageUri,
        mfaEnabled: res.data.mfaEnabled,
        email: form.email,
      };
    } catch {
      return rejectWithValue("Đăng ký thất bại");
    }
  }
);

// 🚀 Thunk: verify OTP
export const verifyCodeThunk = createAsyncThunk(
  "auth/verifyCode",
  async (payload: { email: string; code: string }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/verify", payload);
      const token = res.data.access_token;
      const user = res.data.user; // ✅ Nếu server trả user sau xác thực
      localStorage.setItem("token", token);
      return { token, user: user ?? null }; // trả về object
    } catch {
      return rejectWithValue("Mã xác thực không hợp lệ");
    }
  }
);


//Profile
export const fetchUserProfileThunk = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/user/profile");
      return res.data.data;
    } catch {
      return rejectWithValue("Không lấy được thông tin người dùng");
    }
  }
);

// up lên cloud + patch avatar
export const updateAvatarThunk = createAsyncThunk(
  "auth/updateAvatar",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await api.post("/api/upload?folder=avatars", formData);
      const url = uploadRes.data.url;

      const patchRes = await api.patch("/api/user/avatar", { avatarUrl: url });
      return patchRes.data.data;
    } catch {
      return rejectWithValue("Không cập nhật được avatar");
    }
  }
);

type ProfileInfoPayload = {
  firstname: string;
  lastname: string;
  gender: "MALE" | "FEMALE" | "UNSURE";
};


//update info
export const updateProfileInfoThunk = createAsyncThunk<
  Partial<User>, // ✅ Cho phép thiếu các field như id, email
  ProfileInfoPayload
>(
  "auth/updateProfileInfo",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.patch("/api/user/profile", payload);
      return res.data.data;
    } catch {
      return rejectWithValue("Không cập nhật được thông tin cá nhân");
    }
  }
);

//change password
type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmationPassword: string;
};

export const changePasswordThunk = createAsyncThunk<
  string, // hoặc kiểu trả về bạn muốn
  ChangePasswordPayload
>(
  "auth/changePassword",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.patch("/api/user/change-password", payload);
      return res.data.message;
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || "Password change failed."
        : "Unknown error.";
      return rejectWithValue(msg);
    }
  }
);

// 🧩 Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      Object.assign(state, initialState);
    },
    clearToken: (state) => {
      localStorage.removeItem("token");
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Login
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = action.payload === "MFA_REQUIRED" ? "mfa_required" : "failed";
        state.error = typeof action.payload === "string" ? action.payload : null;
      })

      // ✅ Register
      .addCase(registerThunk.fulfilled, (state, action) => {
        if (action.payload.mfaEnabled) {
          state.status = "mfa_required";
          state.secretImageUri = action.payload.secretImageUri;
          state.mfaEnabled = true;
          state.email = action.payload.email;
        } else {
          state.status = "idle";
        }
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = typeof action.payload === "string" ? action.payload : null;
      })

      // ✅ Verify MFA
      .addCase(verifyCodeThunk.fulfilled, (state, action) => {
        state.status = "succeeded"; // ✅ dùng chung status login
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(verifyCodeThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = typeof action.payload === "string" ? action.payload : null;
      })
      .addCase(fetchUserProfileThunk.fulfilled, (state, action) => {
        state.user = {
          id: action.payload.id,
          firstname: action.payload.firstname,
          lastname: action.payload.lastname,
          email: action.payload.email,
          gender: action.payload.gender,
          avatarUrl: action.payload.avatarUrl,
          role: action.payload.role,                // 👑 thêm role
          isPremium: action.payload.role === "PREMIUM", // ✅ logic fallback
          isAdmin: action.payload.role === "ADMIN", 
        };
      })
      .addCase(updateAvatarThunk.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      })
      .addCase(updateProfileInfoThunk.fulfilled, (state, action) => {
  if (state.user) {
    state.user = { ...state.user, ...action.payload }; // ✅ kiểu hợp lệ
  }
})
      .addCase(fetchUserProfileThunk.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.status = "failed";
        localStorage.removeItem("token");
      })
      ;
  },
});

export const { logout, clearToken } = authSlice.actions;
export default authSlice.reducer;