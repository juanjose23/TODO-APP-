import { useState, useEffect, useCallback } from "react";
import { TeamServices } from "../services/TeamServices";
import { Invitation } from "../types/TeamTypes";
import { RootState } from "@/lib/store/store";
import { useSelector } from "react-redux";
import { useSlugFromUrl } from "@/lib/slug";

type InvitationState = {
  invitation?: Invitation;
  invitationList?: Invitation[];
  invitationListTeam?: Invitation[];
  invitationListLoadingTeam: boolean;
  invitationLoading: boolean;
  invitationListLoading: boolean;
  invitationError: string | null;
  invitationListError: string | null;
  invitationListErrorTeam: string | null;
};

export function useInvitationTeam() {
  const [state, setState] = useState<InvitationState>({
    invitation: undefined,
    invitationList: undefined,
    invitationListTeam: undefined,
    invitationListLoadingTeam: false,
    invitationLoading: false,
    invitationListLoading: false,
    invitationError: null,
    invitationListError: null,
    invitationListErrorTeam: null,
  });

  const slug = useSlugFromUrl();
  const idFromSlug = slug ? slug.split("-").pop() ?? null : null;

  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Helper para actualizar estado parcial
  const updateState = (partial: Partial<InvitationState>) => {
    setState(prev => ({ ...prev, ...partial }));
  };

  const loadInvitationListTeam = useCallback(async (teamId: string | null) => {
    if (!teamId) return; 

    updateState({ invitationListLoadingTeam: true, invitationListErrorTeam: null });

    try {
      const invitations = await TeamServices.getInvitationsByTeamId(teamId);

      if (Array.isArray(invitations)) {
        invitations.forEach(inv => {
          if (inv.date) inv.date = new Date(inv.date);
          if (inv.update) inv.update = new Date(inv.update);
        });
        updateState({ invitationListTeam: invitations });
      } else {
        updateState({ invitationListErrorTeam: "No se encontraron invitaciones." });
      }
    } catch {
      updateState({ invitationListErrorTeam: "No se pudieron cargar las invitaciones." });
    } finally {
      updateState({ invitationListLoadingTeam: false });
    }
  }, []);

  const loadInvitation = useCallback(async (token: string) => {
    updateState({ invitationLoading: true, invitationError: null });

    try {
      const invitation = await TeamServices.getInvitationByToken(token);

      if (invitation.name === "Invitation not found") {
        throw new Error("La invitación no existe o ha expirado.");
      }

      invitation.date = invitation.date ? new Date(invitation.date) : undefined;
      updateState({ invitation });
    } catch (error: any) {
      updateState({ invitationError: error.message });
    } finally {
      updateState({ invitationLoading: false });
    }
  }, []);

  const loadInvitationList = useCallback(async () => {
    if (!currentUser?.id) return;

    updateState({ invitationListLoading: true, invitationListError: null });

    try {
      const invitations = await TeamServices.getInvitationsByUserId(currentUser.id);

      if (Array.isArray(invitations)) {
        invitations.forEach(inv => {
          if (inv.date) inv.date = new Date(inv.date);
          if (inv.update) inv.update = new Date(inv.update);
        });
        updateState({ invitationList: invitations });
      } else {
        updateState({ invitationListError: "No se encontraron invitaciones." });
      }
    } catch {
      updateState({ invitationListError: "No se pudieron cargar las invitaciones." });
    } finally {
      updateState({ invitationListLoading: false });
    }
  }, [currentUser?.id]);

  // Carga invitación por token en query params solo una vez al montar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      loadInvitation(token);
    }
  }, [loadInvitation]);

  // Carga invitaciones del equipo cuando cambia el slug y tenemos id válido
  useEffect(() => {
    if (idFromSlug) {
      loadInvitationListTeam(idFromSlug);
    }
  }, [idFromSlug, loadInvitationListTeam]);

  // Carga lista de invitaciones para usuario logueado
  useEffect(() => {
    loadInvitationList();
  }, [loadInvitationList]);

  const respondToInvitation = useCallback(async (token: string, status: "accepted" | "declined"): Promise<boolean> => {
    try {
      const success = await TeamServices.invitationResponseStatus({ token, status });
      if (success) {
        setState(prev => ({
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
  }, []);

  return {
    ...state,
    respondToInvitation,
  };
}
