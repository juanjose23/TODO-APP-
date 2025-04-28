// src/auth/hooks/useAuth.ts

import { authService } from "../services/authService";


export const useAuth = () => {
 
  const loginWithTwitter = () => {
    authService.redirectToTwitter(); 
  };


  return {
    loginWithTwitter,
  };
};
