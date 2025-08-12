// src/features/auth/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { fetchUserProfileThunk, loginThunk } from "../authSlice";
import { store } from "../../../state/store";

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const { status } = useAppSelector((state) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [formError, setFormError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginThunk(form));

      if (result.meta.requestStatus === "fulfilled") {
        await dispatch(fetchUserProfileThunk());
        const user = store.getState().auth.user;

        if (user?.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/mainpage");
        }
      }
    } catch (err) {
      if (err === "MFA_REQUIRED") {
        navigate("/verify", { state: { email: form.email } });
      } else {
        console.warn("⛔️ Login thất bại:", err);
        if (form.email.includes("@") && form.password.length >= 6) {
          setFormError("Email or password is incorrect.");
        } else {
          setFormError("Please check your login details.");
        }
      }
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#FFDE70] px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-black bg-white p-8 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-black">
          Welcome Back
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-black"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full rounded border border-black px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
            />
            {formError && (
              <p className="mt-1 text-sm text-red-500">{formError}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-black"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded border border-black px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
            />
            <div className="mt-2 text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-[#B3B1B0] hover:text-[#5d512c]"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {status === "loading" && (
            <p className="text-sm text-gray-500">Đang đăng nhập...</p>
          )}
          {/* {error && status !== "mfa_required" && (
            <p className="text-sm text-red-500">{error}</p>
          )} */}

          <button
            type="submit"
            className="w-full rounded border border-black bg-[#FFDE70] px-6 py-2 font-medium text-black transition hover:bg-black hover:text-white"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Đang xử lý..." : "Log In"}
          </button>
        </form>

        <hr className="my-4 border-t border-[#D1D5DB]" />

        <p className="text-center text-sm text-[#B3B1B0]">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-black hover:text-[#5d512c]"
          >
            Register
          </Link>
        </p>
        <div className="mt-4 flex justify-between text-sm text-gray-400">
          <button
            onClick={() => window.history.back()}
            className="hover:text-[#FFDE70]"
          >
            ← Back
          </button>
          <Link
            to="/"
            className="flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-[#FFDE70]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 
      .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 
      1.125-1.125h2.25c.621 0 1.125.504 
      1.125 1.125V21h4.125c.621 0 1.125-.504 
      1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Home
          </Link>
        </div>
      </div>
    </section>
  );
};
