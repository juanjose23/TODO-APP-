import { useDispatch } from "react-redux";
import { login, logout } from "@/auth/store/authSlice";

export const useAuthActions = () => {
  const dispatch = useDispatch();

  return {
    login: (user: { id: string; name: string; email: string }, token: string) => {
      dispatch(login({ user, token }));
    },
    logout: () => {
      dispatch(logout());
    }
  };
};
