// src/router/PublicRoute.tsx
import { FC } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

interface Props {
    children: React.ReactNode;
    }

export const PublicRoute: FC<Props> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return isAuthenticated ? <Navigate to="/" /> : children;
};
