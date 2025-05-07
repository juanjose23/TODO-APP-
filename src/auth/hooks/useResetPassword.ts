import { useState } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

export function useResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const passwordRequirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "At least one uppercase letter", met: /[A-Z]/.test(password) },
    { text: "At least one lowercase letter", met: /[a-z]/.test(password) },
    { text: "At least one number", met: /[0-9]/.test(password) },
    { text: "At least one special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const passwordsMatch = password === confirmPassword && password !== "";
  const allRequirementsMet = passwordRequirements.every((req) => req.met);
  const canSubmit = passwordsMatch && allRequirementsMet && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent, navigate: ReturnType<typeof useNavigate>) => {
    if (!canSubmit) return;
    e.preventDefault();
    setIsSubmitting(true);
    setResetSuccess(null);
    setErrorMessage("");

    const email = new URLSearchParams(window.location.search).get("email");
    const pathParts = window.location.pathname.split('/');
    const token = pathParts[pathParts.length - 1];
    const data = {
        token: token,
        email: email,
        password: password,
      };
    try {
      await authService.resetPassword(data);
      setResetSuccess(true);
      setPassword("");  
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (error) {
      setResetSuccess(false);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword, 
    allRequirementsMet,
    isSubmitting,
    resetSuccess,
    errorMessage,
    handleSubmit,
    passwordsMatch,
    passwordRequirements,
  };
}
