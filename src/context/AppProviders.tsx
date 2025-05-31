  // src/providers/AppProviders.tsx
  import { ReactNode } from "react";
  import { Provider as ReduxProvider } from "react-redux";
  import { store } from "@/lib/store/store";
  import { InvitationProvider } from "@/teams/context/InvitationContext";
  import { TeamProvider } from "@/teams/context/TeamContext";

  export function AppProviders({ children }: { children: ReactNode }) {
    return (
      <ReduxProvider store={store}>
        <TeamProvider>


          <InvitationProvider>
            {children}
          </InvitationProvider>
        </TeamProvider>
      </ReduxProvider>
    );
  }
