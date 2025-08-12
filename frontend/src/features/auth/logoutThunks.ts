import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

export const logoutThunk = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("🚫 Không tìm thấy token trong localStorage, không logout được");
    return;
  }

  try {
    await api.post("/api/auth/logout"); // ✅ không cần headers
    console.log("🚀 Gửi logout với token:", token);
    console.log("✅ Logout backend thành công");
  } catch (err) {
    console.warn("⚠️ Gọi logout không thành công:", err);
  }

  // 🧹 Xoá token khỏi localStorage
  localStorage.removeItem("token");

  // 📦 Reset state auth
  dispatch({ type: "auth/logout" });
});