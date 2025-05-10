import { Routes, Route, Navigate } from 'react-router-dom';

import { TeamPage,InvitationDetailPage, InvitationList } from '@/teams/pages';
import NotFound from '@/errors/pages/NotFound';
export default function TaskRoutes() {
    return (

        <Routes>
            <Route path='/notfound' element={<NotFound />} />
            <Route path="*" element={<Navigate to="/notfound" />} />
            <Route index element={<TeamPage />} />
            <Route path='/invite' element={<InvitationDetailPage/>} />
            <Route path='/invite/list' element={<InvitationList/>} />
        </Routes>
    )
}