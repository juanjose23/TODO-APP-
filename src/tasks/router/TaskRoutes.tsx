import { Routes, Route, Navigate } from 'react-router-dom';
import TaskPage from '../pages/TaskPage';
import TestPage from '../pages/TestPage';
import CalendarPage from '../pages/CalendarPage';
import DashboardPage from '../pages/DashboardPage';
import NotFound from '@/errors/pages/NotFound';
export default function TaskRoutes() {
  return (
    <Routes>
      <Route path='/notfound' element={<NotFound />} />
      <Route path="*" element={<Navigate to="/notfound" />} />
      <Route index element={<TestPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="task" element={<TaskPage />} />
      <Route path="calendar" element={<CalendarPage />} />

    </Routes>
  )
}