
// src/auth/services/authService.ts
import axios from "@/api/axios";
import { Invitation, Team, TeamDetails } from "../types/TeamTypes";

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

    interface InvitationPayload {
        teamId: number;
        members: {
            value: string;  // userId
            label: string;
            role: string;   // admin, editor, viewer, etc.
        }[];
    }

export type TeamFormData = Omit<Team, 'id'>;
export const TeamServices = {

    GetListUser: async (currentUser: { id: string }): Promise<{ value: string; label: string; email: string; avatar: string }[]> => {
        try {
            const response = await axios.get<User[]>("/users");
            const users = response.data;
            return users
                .filter((user) => user.id !== currentUser.id)
                .map((user) => ({
                    value: String(user.id),
                    label: user.name,
                    email: user.email,
                    avatar: user.avatar,
                }));

        } catch (error: any) {
            if (error.response) {
                console.error('Server responded with error:', error.response.data);
                throw error.response.data;
            } else {
                console.error('Error connecting to server:', error);
                throw { message: 'Connection error' };
            }
        }
    },

    GetListUserByTeam: async (params: { id: number }): Promise<{ value: string; label: string; email: string; avatar: string }[]> => {
        try {
            const { id } = params;
            const response = await axios.get<User[]>(`/teams/teams/${id}/available-users`);
            const users = response.data;
            return users.map(user => ({
                value: String(user.id),
                label: user.name,
                email: user.email,
                avatar: user.avatar,
            }));
        } catch (error: any) {
            if (error.response) {
                console.error('Server responded with error:', error.response.data);
                throw error.response.data;
            } else {
                console.error('Error connecting to server:', error);
                throw { message: 'Connection error' };
            }
        }
    },



    CreateTeam: async (data: TeamFormData): Promise<Team> => {
        try {
            const response = await axios.post("/teams/create", data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.error('Server responded with error:', error.response.data);
                throw error.response.data;
            } else {
                console.error('Error connecting to server.');
                throw { message: 'Connection error' };
            }
        }
    },

    getUserTeams: async (): Promise<Team[]> => {
        try {
            const response = await axios.get('teams/teams');
            return response.data.data;
        } catch (error: any) {
            if (error.response) {
                console.error('Server responded with error:', error.response.data);
                throw error.response.data;
            } else {
                console.error('Error connecting to server.');
                throw { message: 'Connection error' };
            }
        }
    },


    getTeamDetails: async (teamId: string): Promise<TeamDetails> => {
        try {
            const response = await axios.get(`/teams/getTeamById/${teamId}`);
            return response.data as TeamDetails;
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 403) {
                    console.error('Access denied: You do not have permission to view this team.');
                    throw { message: 'Access denied: You do not have permission to view this team.', status: 403 };
                }
                console.error('Server responded with error:', error.response.data);
                throw error.response.data;
            } else {
                console.error('Error connecting to server.');
                throw { message: 'Connection error' };
            }
        }
    },

    deleteTeam: async (teamId: string): Promise<void> => {
        try {
            await axios.delete(`/teams/${teamId}`);
        } catch (error: any) {
            if (error.response) {
                console.error('Server responded with error:', error.response.data);
                throw error.response.data;
            } else {
                console.error('Error connecting to server.');
                throw { message: 'Connection error' };
            }
        }
    },



    // Obtiene la lista de invitaciones para un equipo específico
    getInvitationsByTeamId: async (teamId: string): Promise<Invitation[]> => {
        try {
            if (!teamId) {
                throw new Error("Team ID is required");
            }
            const response = await axios.get(`/teams/listInvitationteam/${teamId}`);
            return response.data.original;
        } catch (error: any) {
            if (error.response) {
                console.error('server responded with error:', error.response.data);
                throw error.response.data;
            } else {
                console.error('Error connecting to server');
                throw { message: 'Connection error' };
            }
        }
    },

    // Obtiene la lista de invitaciones para un usuario específico
    getInvitationsByUserId: async (userId: string): Promise<Invitation[]> => {
        try {
            const response = await axios.get(`/teams/listInvitation/${userId}`);
            return response.data.original;
        } catch (error: any) {
            if (error.response) {
                console.error('server responded with error:', error.response.data);
                throw error.response.data;
            } else {
                console.error('Error connecting to server');
                throw { message: 'Connection error' };
            }
        }
    },

    getInvitationByToken: async (token: string): Promise<Invitation> => {
        try {
            const response = await axios.get(`/teams/getInvitationByToken/${token}`);
            return response.data.original;


        } catch (error: any) {
            if (error.response) {
                console.error('server responded with error:', error.response.data);
                throw error.response.data;
            } else {
                console.error('Error connecting to server');
                throw { message: 'Connection error' }
            }

        }
    },
    invitationMemberTeam: async (InvitationPayload: InvitationPayload): Promise<boolean> => {
        try {
            const response = await axios.post('/teams/addMemberToTeam', InvitationPayload);

            return response.status === 200;
        } catch (error: any) {
            return false;
        }
    },
    invitationResponseStatus: async ({ token, status }: { token: string; status: string }): Promise<boolean> => {
        try {
            const response = await axios.post('/teams/invitationResponse', { token, status });

            return response.status === 200;
        } catch (error: any) {
            return false;
        }
    }

}

