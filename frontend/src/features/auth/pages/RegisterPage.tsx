import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { registerThunk } from "../authSlice";
import { logoutThunk } from "../logoutThunks";

export const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    mfaEnabled: true, // ✅ Luôn bật xác thực 2 lớp
  });

  const [formError, setFormError] = useState("");
  const { status, error, mfaEnabled, secretImageUri, email } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
  const resetSession = async () => {
    await dispatch(logoutThunk());
    navigate("/register"); // ✅ đảm bảo session bị đá rồi quay lại đúng route
  };
  resetSession();
}, [dispatch, navigate]);

  useEffect(() => {
    if (status === "succeeded" && !mfaEnabled) {
      navigate("/login");
    } else if (status === "mfa_required") {
      navigate("/verify", { state: { email, secretImageUri } });
    }
  }, [status, mfaEnabled, secretImageUri, email, navigate]);

  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstname || !form.email || !form.password) {
      setFormError("Vui lòng điền đầy đủ các thông tin bắt buộc.");
      return;
    }
    setFormError("");
    dispatch(registerThunk(form));
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#FFDE70] px-4">
      <div className="border border-black w-full max-w-lg space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-black">Register New Account</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstname" className="mb-1 block text-sm font-medium text-black">
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                placeholder="Your firstname"
                value={form.firstname}
                onChange={handleChange}
                className="w-full rounded border border-black px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="lastname" className="mb-1 block text-sm font-medium text-black">
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                placeholder="Your lastname"
                value={form.lastname}
                onChange={handleChange}
                className="w-full rounded border border-black px-4 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-black">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded border border-black px-4 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-black">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded border border-black px-4 py-2 text-sm"
            />
          </div>

          {/* Ẩn checkbox vì mặc định bật MFA */}
          <input type="hidden" name="mfaEnabled" value="true" />

          {formError && (
            <p className="rounded bg-red-100 border border-red-300 text-red-700 px-4 py-2 text-sm">
              {formError}
            </p>
          )}
          {status === "loading" && <p className="text-sm text-gray-500">Đang xử lý...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full border border-black rounded bg-[#FFDE70] px-6 py-2 font-medium text-black hover:bg-black hover:text-white"
            disabled={status === "loading"}
          >
            Next Step
          </button>
        </form>

        <hr className="my-4" />
        <p className="text-sm text-[#B3B1B0] text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-black hover:text-[#FFDE70]">
            Log in
          </Link>
        </p>
        <div className="mt-4 flex justify-between text-sm text-gray-400">
  <button onClick={() => window.history.back()} className="hover:text-[#FFDE70]">
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