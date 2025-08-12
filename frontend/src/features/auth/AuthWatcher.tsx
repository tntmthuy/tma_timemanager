import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { logout } from "./authSlice";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const AuthWatcher = () => {
  const { token, user } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
  // 👉 Nếu không có user ➤ logout liền (token mà không có user là sai gu)
  if (!user) {
    dispatch(logout());
    navigate("/login");
    return;
  }

  if (!token) return;

  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    const now = Date.now();

    if (exp * 1000 <= now) {
      dispatch(logout());
      navigate("/login");
    }
  } catch {
    dispatch(logout());
    navigate("/login");
  }
}, [token, user, dispatch, navigate]);



  return null;
};

// import { useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "../../state/hooks";
// import { logout } from "./authSlice";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// export const AuthWatcher = () => {
//   const { token, status } = useAppSelector((state) => state.auth);
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token || status !== "succeeded") return;

//     try {
//       const { exp } = jwtDecode<{ exp: number }>(token);
//       const now = Date.now();

//       if (exp * 1000 <= now) {
//         dispatch(logout());
//         navigate("/login");
//       }
//     } catch {
//       dispatch(logout());
//       navigate("/login");
//     }
//   }, [token, status, dispatch, navigate]);

//   return null;
// };