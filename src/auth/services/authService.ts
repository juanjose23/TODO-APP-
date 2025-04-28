// src/auth/services/authService.ts
import axios from "@/api/axios";
import { LoginDto, RegisterDto, AuthResponse,AuthResetPassword } from "../types/authTypes";

// Tipado de los métodos del servicio
export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    try {
      const res = await axios.post<AuthResponse>("/auth/login", data);
      return res.data;
    } catch (error) {
      throw error; 
    }
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    try {
      const res = await axios.post<AuthResponse>("/auth/register", data);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    const response = await axios.post('/auth/logout'); 
   return response.data;
  },

  redirectToTwitter: () => {
    window.location.href =`${import.meta.env.VITE_API_URL}/auth/twitter`;
  },

  forgotPassword: async (email: string): Promise<void> => {
    try {
      await axios.post("/auth/forgot-password", { email });
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
  
  resetPassword: async (data: AuthResetPassword): Promise<AuthResetPassword> => {
    try {
      const response = await axios.post("/auth/password-reset", data);
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
  

};

