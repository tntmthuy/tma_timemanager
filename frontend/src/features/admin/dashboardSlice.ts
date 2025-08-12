import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

// 🎯 Thunk: lấy số liệu tổng quan
export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchSummary",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/api/admin/summary");
      return res.data.data;
    } catch {
      return thunkAPI.rejectWithValue("Không thể lấy dữ liệu tổng quan");
    }
  }
);

// 🎯 Thunk: lấy dữ liệu biểu đồ tổng quan
export const fetchChartData = createAsyncThunk(
  "dashboard/fetchChartData",
  async (params: ChartParams, thunkAPI) => {
    try {
      const res = await api.get("/api/admin/chart", { params });
      return res.data.data;
    } catch {
      return thunkAPI.rejectWithValue("Không thể lấy dữ liệu biểu đồ");
    }
  }
);

// 🎯 Thunk: lấy dữ liệu biểu đồ giao dịch
export const fetchPaymentChart = createAsyncThunk(
  "dashboard/fetchPaymentChart",
  async (params: ChartParams, thunkAPI) => {
    try {
      const res = await api.get("/api/admin/payments/chart", { params });
      return res.data.data as PaymentChartPoint[];
    } catch {
      return thunkAPI.rejectWithValue("Không thể lấy biểu đồ giao dịch");
    }
  }
);

// 🧩 Type params chung cho tất cả chart
interface ChartParams {
  range?: string;
  fromDate?: string;
  toDate?: string;
  month?: number;
  year?: number;
}

// 🧩 Type dữ liệu biểu đồ
type ChartPoint = {
  date: string;
  totalUsers: number;
  totalTeams: number;
  totalFocusSessions: number;
};

type PaymentChartPoint = {
  date: string;
  count: number;
  totalAmount: number;
};

// 🧩 State toàn cục
type DashboardState = {
  totalUsers: number;
  totalTeams: number;
  totalFocusSessions: number;
  chartData: ChartPoint[];
  paymentChartData: PaymentChartPoint[];
  loadingSummary: boolean;
  loadingChart: boolean;
  loadingPaymentChart: boolean;
  error: string | null;
};

// 🔰 Khởi tạo state ban đầu
const initialState: DashboardState = {
  totalUsers: 0,
  totalTeams: 0,
  totalFocusSessions: 0,
  chartData: [],
  paymentChartData: [],
  loadingSummary: false,
  loadingChart: false,
  loadingPaymentChart: false,
  error: null,
};

// 🍰 Slice chính
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ⚙️ Tổng quan
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loadingSummary = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action: PayloadAction<DashboardState>) => {
        state.totalUsers = action.payload.totalUsers;
        state.totalTeams = action.payload.totalTeams;
        state.totalFocusSessions = action.payload.totalFocusSessions;
        state.loadingSummary = false;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loadingSummary = false;
        state.error = action.payload as string;
      })

      // ⚙️ Biểu đồ tổng quan
      .addCase(fetchChartData.pending, (state) => {
        state.loadingChart = true;
        state.error = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action: PayloadAction<ChartPoint[]>) => {
        state.chartData = action.payload;
        state.loadingChart = false;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.loadingChart = false;
        state.error = action.payload as string;
      })

      // ⚙️ Biểu đồ giao dịch
      .addCase(fetchPaymentChart.pending, (state) => {
        state.loadingPaymentChart = true;
        state.error = null;
      })
      .addCase(fetchPaymentChart.fulfilled, (state, action: PayloadAction<PaymentChartPoint[]>) => {
        state.paymentChartData = action.payload;
        state.loadingPaymentChart = false;
      })
      .addCase(fetchPaymentChart.rejected, (state, action) => {
        state.loadingPaymentChart = false;
        state.error = action.payload as string;
      });
  }
});

export default dashboardSlice.reducer;