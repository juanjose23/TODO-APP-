import { Routes, Route } from 'react-router-dom';
import NotFound from '@/errors/pages/NotFound';
import TaskLayout from '../layout/TaskLayout';
import TaskPage from '../pages/TaskPage';
import TestPage from '../pages/TestPage';
import CalendarPage from '../pages/CalendarPage';
import DashboardPage from '../pages/DashboardPage';
export default function TaskRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TaskLayout />}>
      
        <Route index element={<TestPage />} />
        <Route path='dashboard' element={<DashboardPage />} />
        <Route path='task' element={<TaskPage />} />
        <Route path='calendar' element={<CalendarPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}