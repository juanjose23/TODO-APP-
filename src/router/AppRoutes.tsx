// src/router/AppRouter.tsx
import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import AuthRoutes from "@/auth/routes/AuthRoutes";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import TaskRoutes from "@/tasks/router/TaskRoutes";

export const AppRouter: FC = () => {

  return (
    <Routes>

      <Route
        path="/auth/*"
        element={
          <PublicRoute>
            <AuthRoutes />
          </PublicRoute>
        }
      />


      <Route
        path="/*"
        element={
          <PrivateRoute>
            <TaskRoutes />
          </PrivateRoute>
        }
      />

    
    </Routes>
  );
};
