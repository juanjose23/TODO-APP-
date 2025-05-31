import { Routes, Route, Navigate } from 'react-router-dom';
import { TeamPage, InvitationDetailPage, InvitationList, TeamDetailPage } from '@/teams/pages';
import NotFound from '@/errors/pages/NotFound';
export default function TaskRoutes() {
    return (

        <Routes>
            <Route index element={<TeamPage />} />
            <Route path=":slug" element={<TeamDetailPage />} />  

            {/* Rutas de invitaciones */}
            <Route path="/invite" element={<InvitationDetailPage />} />
            <Route path="/invite/list" element={<InvitationList />} />

            {/* Página de error personalizada */}
            <Route path="/notfound" element={<NotFound />} />

            {/* Redirección para rutas no encontradas */}
            <Route path="*" element={<Navigate to="/notfound" replace />} />
        </Routes>

    )
}