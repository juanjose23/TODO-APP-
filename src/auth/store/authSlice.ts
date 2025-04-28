import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  status: 'checking' | 'authenticated' | 'unauthenticated';
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  status: 'checking', 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'authenticated';
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.status = 'unauthenticated';
    },
    setStatus: (state, action: PayloadAction<'checking' | 'authenticated' | 'unauthenticated'>) => {
      state.status = action.payload;
    },
  },
});

export const { login, logout, setStatus } = authSlice.actions;
export default authSlice.reducer;
