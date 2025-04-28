import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPages';
import RegisterPage from '../pages/RegisterPage';
import NotFound from '@/errors/pages/NotFound';
import TwitterCallback from "./components/TwitterCallback";
import PasswordForgotPage from '../pages/PasswordForgotPage';
import ResetPasswordPage from '../pages/PasswordResetPage';
export default function AuthRoutes() {
  return (
    <Routes>
      <Route path='login' element={<LoginPage />} />
      <Route path='register' element={<RegisterPage />} />
      <Route path="/callback" element={<TwitterCallback />} />
      <Route path="/password-forgot" element={<PasswordForgotPage />} />
      <Route path="/reset-password/:token" element={< ResetPasswordPage/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}