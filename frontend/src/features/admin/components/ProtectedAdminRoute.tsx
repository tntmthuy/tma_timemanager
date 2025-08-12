import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../state/hooks";
import type { JSX } from "react";

export const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user || !user.isAdmin) return <Navigate to="/mainpage" replace />;
  return children;
};