
// src/auth/services/authService.ts
import axios from "@/api/axios";
import { Team } from "../types/TeamTypes";

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

}

