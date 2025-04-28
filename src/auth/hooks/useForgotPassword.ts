// src/auth/hooks/useForgotPassword.ts
import { useState } from "react";
import { authService } from "@/auth/services/authService";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canSubmit = isValidEmail(email) && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) return;

    setIsSubmitting(true);
    setRequestSuccess(null);
    setErrorMessage("");

    try {
      await authService.forgotPassword(email);
      setRequestSuccess(true);
    } catch (error) {
      setRequestSuccess(false);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    isSubmitting,
    requestSuccess,
    errorMessage,
    canSubmit,
    handleSubmit,
    isValidEmail, 
  };
}
