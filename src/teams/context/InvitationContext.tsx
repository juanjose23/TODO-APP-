import React, { createContext, useContext } from "react";
import { Invitation } from "../types/TeamTypes";
import { useInvitationTeam } from "../hooks/useInvitationTeam";

interface InvitationContextProps {
  invitation: Invitation | undefined;
  invitationLoading: boolean;
  invitationError: string | null;
  invitationList: Invitation[] | undefined;
  invitationListLoading: boolean;
  invitationListError: string | null;
  invitationListTeam: Invitation[] | undefined;
  invitationListLoadingTeam: boolean;
  invitationListErrorTeam: string | null;
  respondToInvitation: (token: string, status: "accepted" | "declined") => Promise<boolean>;
}

const InvitationContext = createContext<InvitationContextProps | undefined>(undefined);

export const InvitationProvider = ({ children }: { children: React.ReactNode }) => {
  const {
  invitation,
  invitationLoading,
  invitationError,
  invitationList,
  invitationListLoading,
  invitationListError,
  invitationListTeam,
  invitationListLoadingTeam,
  invitationListErrorTeam,
  respondToInvitation,
} = useInvitationTeam();

  return (
    <InvitationContext.Provider
      value={{ invitationList, invitationListLoading, invitationListError, respondToInvitation, invitation, invitationLoading, invitationError, invitationListTeam, invitationListLoadingTeam, invitationListErrorTeam }}
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
