// src/providers/AppProviders.tsx
import { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/lib/store/store";
import { InvitationProvider } from "@/teams/context/InvitationContext"; 

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <InvitationProvider>
        {children}
      </InvitationProvider>
    </ReduxProvider>
  );
}
