// src/router/AppRouter.tsx
import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import AuthRoutes from "@/auth/routes/AuthRoutes";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import TaskRoutes from "@/tasks/router/TaskRoutes";
import TeamRoutes from "@/teams/routes/TeamRoutes";
import AppLayout from "@/layout/AppLayout";
import NotFound from "@/errors/pages/NotFound";

export const AppRouter: FC = () => {
  return (
    <Routes>

      <Route path="*" element={<NotFound />} />
      {/* Public */}
      <Route
        path="/auth/*"
        element={
          <PublicRoute>
            <AuthRoutes />
          </PublicRoute>
        }
      />

      {/* Private */}
      <Route path="/" element={
        <PrivateRoute>
          <AppLayout />
        </PrivateRoute>
      }>
        <Route index element={<TaskRoutes />} />
        <Route path="tasks/*" element={<TaskRoutes />} />
        <Route path="teams/*" element={<TeamRoutes />} />

      </Route>


    </Routes>
  );
};
