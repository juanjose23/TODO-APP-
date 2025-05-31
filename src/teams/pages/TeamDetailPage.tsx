// src/teams/pages/TeamDetailPage.tsx
import { useParams, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { TeamServices } from '@/teams/services/TeamServices';
import type { TeamDetails } from '@/teams/types/TeamTypes';
import Dashboard from '../components/team/Dasboard';

export default function TeamDetailPage() {
  // Obtenemos el parámetro 'slug' de la URL
  const { slug } = useParams<{ slug: string }>();
  
  // Estado para guardar los datos del equipo
  const [team, setTeam] = useState<TeamDetails | null>(null);
  
  // Estado para indicar si está cargando
  const [loading, setLoading] = useState(true);
  
  // Estado para controlar si no se encontró el equipo o hubo error
  const [notFound, setNotFound] = useState(false);
  
  // Extraemos el id del slug (asumimos que está al final, separado por guion)
  const idFromSlug = slug ? slug.split("-").pop() : null;

  useEffect(() => {
    // Validamos que el id exista y sea un número válido
    if (!idFromSlug || isNaN(Number(idFromSlug))) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Función asincrónica para obtener detalles del equipo
    async function fetchTeam() {
      try {
        const data = await TeamServices.getTeamDetails(idFromSlug as string);
        
        if (!data) {
          // Si no hay datos, indicamos "no encontrado"
          setNotFound(true);
        } else {
          // Guardamos los datos del equipo en el estado
          setTeam(data);
        }
      } catch (error) {
        // Si hubo un error (p.ej. 403, 404, etc.), marcamos no encontrado
        setNotFound(true);
      } finally {
        // Siempre que termine la petición, indicamos que dejó de cargar
        setLoading(false);
      }
    }

    fetchTeam();
  }, [idFromSlug]);

  // Si no encontró el equipo, redirige a la página 404 personalizada
  if (notFound) return <Navigate to="/notfound" replace />;

  // Mientras carga o no hay equipo, no renderiza nada (puedes cambiar por un loader)
  if (loading || !team) return null;

  // Renderiza el dashboard con los datos del equipo
  return (
    <div>
      <Dashboard rol={team.currentUserRoles} tittle={team.name} teamId={team.id!} />
    </div>
  );
}
