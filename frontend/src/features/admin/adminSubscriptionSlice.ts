// src/features/admin/adminSubscriptionSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

export type PlanType = "WEEKLY" | "MONTHLY" | "YEARLY";
export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "PENDING";

export type SubscriptionInfoDto = {
  userId: string;
  userName: string;       
  fullName: string;      
  avatarUrl: string;     
  email: string;
  planType: PlanType;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  paymentId: string;
  amount: number;
};

// 🔧 Tính số tiền theo loại gói
const getPlanAmount = (planType: PlanType): number => {
  switch (planType) {
    case "WEEKLY":
      return 1.0;
    case "MONTHLY":
      return 3.0;
    case "YEARLY":
      return 25.0;
    default:
      return 0;
  }
};

export const fetchSubscriptions = createAsyncThunk<
  SubscriptionInfoDto[],
  void,
  { rejectValue: string }
>("admin/fetchSubscriptions", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/api/admin/all-subscription");
console.log("API raw data:", res.data.data);
    // 🚀 Tính amount tại đây
    const withAmount: SubscriptionInfoDto[] = res.data.data.map((s: Omit<SubscriptionInfoDto, "amount">) => ({
      ...s,
      amount: getPlanAmount(s.planType),
    }));

    return withAmount;
  } catch {
    return rejectWithValue("Không thể lấy danh sách giao dịch");
  }
});

type SubscriptionState = {
  list: SubscriptionInfoDto[];
  loading: boolean;
  error: string | null;
};

const initialState: SubscriptionState = {
  list: [],
  loading: false,
  error: null,
};

const adminSubscriptionSlice = createSlice({
  name: "adminSubscription",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Có lỗi xảy ra khi tải giao dịch";
      });
  },
});

export default adminSubscriptionSlice.reducer;