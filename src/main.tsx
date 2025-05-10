// src/main.tsx o src/index.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Todo } from "./Todo";
import { AppProviders } from "./context/AppProviders"; // Ruta según tu proyecto
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProviders>
        <Todo />
        <Toaster richColors position="top-right" closeButton />
      </AppProviders>
    </BrowserRouter>
  </StrictMode>
);
