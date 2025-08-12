import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

// 📦 Gói đăng ký
export interface SubscriptionInfo {
  planType: "WEEKLY" | "MONTHLY" | "YEARLY";
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  startDate: string;
  endDate: string;
}

export interface SubscriptionPlan {
  type: "WEEKLY" | "MONTHLY" | "YEARLY";
  price: number;
  currency: string;
  displayName: string;
}

// 🎯 Lấy danh sách gói (UpgradePage dùng)
export const fetchPlansThunk = createAsyncThunk<
  SubscriptionPlan[],
  void,
  { rejectValue: string }
>("subscription/fetchPlans", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/plans");
    return res.data as SubscriptionPlan[];
  } catch {
    return rejectWithValue("Không thể tải danh sách gói");
  }
});

// 🎯 Lấy thông tin gói của user
export const fetchUserSubscriptionThunk = createAsyncThunk<
  SubscriptionInfo[], // vì data là mảng
  void,
  { rejectValue: string }
>("subscription/fetchInfo", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/plans/subscription/me");
    return res.data.data as SubscriptionInfo[];
  } catch {
    return rejectWithValue("Không thể tải thông tin gói đăng ký");
  }
});

// ✅ State & Slice
interface SubscriptionState {
  plans: SubscriptionPlan[];
  infoList: SubscriptionInfo[]; 
  info: SubscriptionInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  plans: [],
  infoList: [],
  info: null,
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ⬇️ getPlans
      .addCase(fetchPlansThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlansThunk.fulfilled, (state, action: PayloadAction<SubscriptionPlan[]>) => {
        state.plans = action.payload;
        state.loading = false;
      })
      .addCase(fetchPlansThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Không thể tải danh sách gói";
      })

      // ⬇️ getUser subscription
      .addCase(fetchUserSubscriptionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSubscriptionThunk.fulfilled, (state, action: PayloadAction<SubscriptionInfo[]>) => {
        state.infoList = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserSubscriptionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Không thể tải thông tin đăng ký";
      });
  },
});

export default subscriptionSlice.reducer;