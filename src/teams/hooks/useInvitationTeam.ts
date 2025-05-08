// useInvitationTeam.ts
import { useState, useEffect } from "react";
import { TeamServices } from "../services/TeamServices";
import { Invitation } from "../types/TeamTypes";

export function useInvitationTeam() {
    const [invitation, setInvitation] = useState<Invitation | undefined>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadInvitation = async () => {
            setLoading(true);
            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");

            if (!token) {
                setError("Token de invitación no encontrado.");
                return;
            }

            try {
                const userInvitation: any = await TeamServices.invitationTeam(token);
                if (userInvitation && userInvitation.message === 'Invitation not found') {
                    setError("La invitación no existe o ha expirado.");
                    return;
                }
                if (userInvitation.date) {
                    userInvitation.date = new Date(userInvitation.date);
                }

                setInvitation(userInvitation);
               
            } catch (error: any) {
                console.error("Error loading invitation:", error);
                setError("La invitación no existe o ha expirado.");
            } finally {
                setLoading(false);
            }
        };

        loadInvitation();
    }, []);

    return { invitation, error, loading };
}
