import React, { createContext, useContext } from "react";
import { Invitation } from "../types/TeamTypes";
import { useInvitationTeam } from "../hooks/useInvitationTeam";

interface InvitationContextProps {
  invitationList: Invitation[] | undefined;
  invitationListLoading: boolean;
  invitationListError: string | null;
   respondToInvitation: (token: string, status: "accepted" | "declined") => Promise<boolean>;
}

const InvitationContext = createContext<InvitationContextProps | undefined>(undefined);

export const InvitationProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    invitationList,
    invitationListLoading,
    invitationListError,
    respondToInvitation,
  } = useInvitationTeam();

  return (
    <InvitationContext.Provider
      value={{ invitationList, invitationListLoading, invitationListError, respondToInvitation }}
    >
      {children}
    </InvitationContext.Provider>
  );
};

export const useInvitationContext = () => {
  const context = useContext(InvitationContext);
  if (!context) throw new Error("useInvitationContext must be used within InvitationProvider");
  return context;
};
