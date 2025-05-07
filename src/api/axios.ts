import axios from 'axios';
import { store } from '@/lib/store/store';
import { logout, setToken } from '@/auth/store/authSlice';
import { Navigate, useNavigate } from 'react-router-dom';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST: Agrega el token de acceso
instance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: any) => void;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });

  failedQueue = [];
};


instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return instance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshToken = store.getState().auth.refreshToken;

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/auth/refresh`,
          null,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        store.dispatch(setToken(data.access_token));
        instance.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
        processQueue(null, data.access_token);
        return instance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        store.dispatch(logout());
        
        const navigate = useNavigate();
        navigate("/login");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
