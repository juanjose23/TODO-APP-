import { Routes, Route, Navigate } from 'react-router-dom';

import { TeamPage } from '@/teams/pages';
import NotFound from '@/errors/pages/NotFound';
export default function TaskRoutes() {
    return (

        <Routes>
            <Route path='/notfound' element={<NotFound />} />
            <Route path="*" element={<Navigate to="/notfound" />} />
            <Route index element={<TeamPage />} />

        </Routes>
    )
}