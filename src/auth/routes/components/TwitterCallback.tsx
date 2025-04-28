import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { authService } from '@/auth/services/authService';
import { useAuthActions } from '@/auth/hooks/useAuthActions';

const TwitterCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthActions();

  useEffect(() => {
    const { token } = queryString.parse(location.search) as { token?: string };
   
    if (!token) {
      setError('Token no proporcionado');
      setLoading(false);
      return;
    }

    const authenticateUser = async () => {
      try {
        sessionStorage.setItem("token", token);
        const response = await authService.getUserFromToken();

        login(response.user, response.token); 

        navigate('/'); 
      } catch (err) {
        console.error('Error al autenticar con Twitter:', err);
        setError('Error al autenticar con Twitter');
      } finally {
        setLoading(false);
      }
    };

    authenticateUser();
  }, [location.search, login, navigate]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return null; 
};

export default TwitterCallback;
