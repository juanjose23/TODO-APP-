
// src/auth/services/authService.ts
import axios from "@/api/axios";
import { Invitation, Team } from "../types/TeamTypes";

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

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


    CreateTeam: async (data: Team): Promise<Team> => {
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

    invitationListTeam: async (userId: string): Promise<Invitation[]> => {
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

    invitationResponseStatus: async ({ token, status }: { token: string; status: string }): Promise<boolean> => {
        try {
            const response = await axios.post('/teams/invitationResponse', { token, status });
            console.log(response.status === 200);
            return response.status === 200;
        } catch (error: any) {
            return false;
        }
    }

}

