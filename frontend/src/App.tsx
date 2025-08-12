import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./features/landing/pages/LandingPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { VerifyCodePage } from "./features/auth/pages/VerifyCodePage";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";
import { AuthWatcher } from "./features/auth/AuthWatcher";
import { MainPage } from "./features/landing/pages/MainPage";
import { FocusPage } from "./features/focus/pages/FocusPage";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";
import { TeamDetailPage } from "./features/team/pages/TeamDetailPage";
import { Toaster } from "react-hot-toast";
import { useAppDispatch } from "./state/hooks";
import { fetchUserProfileThunk } from "./features/auth/authSlice";
import { useEffect } from "react";
import { NotificationPage } from "./features/sidebar/pages/NotificationPage";
import { UpgradePage } from "./features/subscription/pages/UpgradePage";
import { ProtectedAdminRoute } from "./features/admin/components/ProtectedAdminRoute";
import { AdminPage } from "./features/admin/pages/AdminPage";
import { Dashboard } from "./features/admin/components/Dashboard";
import { Users } from "./features/admin/components/Users";
import { Teams } from "./features/admin/components/Teams";
import PaymentsLite from "./features/admin/components/Payment"; 

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) dispatch(fetchUserProfileThunk());
  }, [dispatch]);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#334155",
            color: "#f1f5f9",
            padding: "14px 18px",
            borderRadius: "10px",
            fontWeight: 500,
            fontSize: "14px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          },
          success: {
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#4ade80"
                viewBox="0 0 24 24"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75
                  9.75-9.75s9.75 4.365 9.75 9.75-4.365
                  9.75-9.75 9.75S2.25 17.385 2.25
                  12Zm13.36-1.814a.75.75 0 1
                  0-1.22-.872l-3.236 4.53L9.53
                  12.22a.75.75 0 0 0-1.06
                  1.06l2.25 2.25a.75.75 0 0 0
                  1.14-.094l3.75-5.25Z"
                />
              </svg>
            ),
            style: {
              background: "#dcfce7",
              color: "#166534",
            },
          },
          error: {
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#f87171"
                viewBox="0 0 24 24"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75
                  4.365-9.75 9.75s4.365 9.75 9.75
                  9.75 9.75-4.365 9.75-9.75S17.385
                  2.25 12 2.25Zm-1.72 6.97a.75.75
                  0 1 0-1.06 1.06L10.94 12l-1.72
                  1.72a.75.75 0 1 0 1.06 1.06L12
                  13.06l1.72 1.72a.75.75 0 1 0
                  1.06-1.06L13.06 12l1.72-1.72a.75.75
                  0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                />
              </svg>
            ),
            style: {
              background: "#fee2e2",
              color: "#991b1b",
            },
          },
        }}
      />

      <Routes>
        {/* 🟢 Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyCodePage />} />

        {/* 🔐 User Protected */}
        <Route
          path="/mainpage"
          element={
            <ProtectedRoute>
              <>
                <AuthWatcher />
                <MainPage />
              </>
            </ProtectedRoute>
          }
        >
          <Route index element={<FocusPage />} />
          <Route path="focus" element={<FocusPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="upgrade" element={<UpgradePage />} />
          <Route path="team/:id" element={<TeamDetailPage />} />
        </Route>

        {/* 🔐 Admin Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminPage />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="teams" element={<Teams />} />
          <Route path="payments" element={<PaymentsLite />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
