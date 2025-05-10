import { useState, useEffect } from "react";
import { TeamServices } from "../services/TeamServices";
import { Invitation } from "../types/TeamTypes";
import { RootState } from "@/lib/store/store";
import { useSelector } from "react-redux";

export function useInvitationTeam() {
  const [invitationState, setInvitationState] = useState({
    invitation: undefined as Invitation | undefined,
    invitationList: undefined as Invitation[] | undefined,
    invitationLoading: false,
    invitationListLoading: false,
    invitationError: null as string | null,
    invitationListError: null as string | null,
  });

  const currentUser = useSelector((state: RootState) => state.auth.user);

  const loadInvitation = async (token: string) => {
    setInvitationState(prev => ({ ...prev, invitationLoading: true }));
    
    try {
      const userInvitation = await TeamServices.getInvitationByToken(token);
      if (userInvitation.name === "Invitation not found") {
        throw new Error("La invitación no existe o ha expirado.");
      }

      userInvitation.date = userInvitation.date ? new Date(userInvitation.date) : undefined;
      setInvitationState(prev => ({ ...prev, invitation: userInvitation }));
    } catch (error: any) {
      setInvitationState(prev => ({ ...prev, invitationError: error.message }));
    } finally {
      setInvitationState(prev => ({ ...prev, invitationLoading: false }));
    }
  };

  const loadInvitationList = async () => {
    if (!currentUser || !currentUser.id) return;

    setInvitationState(prev => ({ ...prev, invitationListLoading: true }));

    try {
      const userInvitationList = await TeamServices.invitationListTeam(currentUser.id);

      if (Array.isArray(userInvitationList)) {
        userInvitationList.forEach(inv => {
          if (inv.date) inv.date = new Date(inv.date);
           if (inv.update) inv.update = new Date(inv.update);
        });
        setInvitationState(prev => ({ ...prev, invitationList: userInvitationList }));
      } else {
        setInvitationState(prev => ({ ...prev, invitationListError: "No se encontraron invitaciones." }));
      }
    } catch (error: any) {
      setInvitationState(prev => ({ ...prev, invitationListError: "No se pudieron cargar las invitaciones." }));
    } finally {
      setInvitationState(prev => ({ ...prev, invitationListLoading: false }));
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      loadInvitation(token);
    }
  }, []); // Only run once on mount

  useEffect(() => {
    loadInvitationList();
  }, [currentUser]); // Rerun on user change

  const respondToInvitation = async (token: string, status: "accepted" | "declined"): Promise<boolean> => {
    try {
      const success = await TeamServices.invitationResponseStatus({ token, status });
      if (success) {
        setInvitationState(prev => ({
          ...prev,
          invitationList: prev.invitationList?.map(item =>
            item.token === token ? { ...item, status } : item
          ),
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al actualizar el estado de la invitación", error);
      return false;
    }
  };

  return {
    ...invitationState,
    respondToInvitation,
  };
}
