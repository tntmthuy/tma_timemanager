import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { verifyCodeThunk, clearToken } from "../authSlice";

export const VerifyCodePage = () => {
  const [code, setCode] = useState(Array(6).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { email, secretImageUri, status, error } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (!email) navigate("/register");
  }, [email, navigate]);

  useEffect(() => {
    if (status === "succeeded") {
      dispatch(clearToken()); // chỉ xoá token, không reset state
      navigate("/login");
    }
  }, [status, dispatch, navigate]);

  useEffect(() => {
    if (status === "failed") {
      const timer = setTimeout(() => {
        setCode(Array(6).fill(""));
        inputsRef.current[0]?.focus();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6 || status === "loading") return;
    dispatch(verifyCodeThunk({ email, code: fullCode }));
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-black">
          Verify Two-Factor Authentication
        </h2>

        {secretImageUri && (
          <div className="flex justify-center">
            <img
              src={secretImageUri}
              alt="QR code"
              className="mb-4 w-48 rounded"
              loading="lazy"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {code.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                ref={(el) => {
                  if (el) inputsRef.current[idx] = el;
                }}
                className="h-12 w-12 rounded border border-black text-center text-xl focus:ring-1 focus:ring-black"
              />
            ))}
          </div>

          {status === "loading" && (
            <p className="text-center text-gray-500">Đang xác thực...</p>
          )}
          {error && <p className="text-center text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={code.join("").length < 6 || status === "loading"}
            className="w-full rounded bg-[#FFDE70] px-6 py-2 font-medium text-black transition hover:bg-black hover:text-white"
          >
            Verify Code
          </button>
        </form>

        <div className="flex justify-between text-sm text-[#B3B1B0]">
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
            </svg>{" "}
            Home
          </Link>
        </div>
      </div>
    </section>
  );
};
