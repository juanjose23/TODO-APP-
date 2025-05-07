// src/auth/types/authTypes.ts

// Tipo para los datos de Login
export interface LoginDto {
    email: string
    password: string
  }
  
  // Tipo para los datos de Registro
  export interface RegisterDto {
    name: string
    email: string
    password: string
    password_confirmation: string
  }
  
  // Respuesta de la API después de un login o registro
  export interface AuthResponse {
    user: {
      id: string
      name: string
      email: string
    }
    token: string
    refresh_token:string
  }

  export interface RootState {
    user: {
      id: string;
      name: string;
      email: string;
  
    };
  }
  

  export interface AuthResetPassword {
    token: string;
    email: string|null;
    password: string;
  
  }

  