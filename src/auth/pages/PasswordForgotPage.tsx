"use client";

import PasswordForgot from "../components/PasswordForgot";
import AuthLayout from "../layouts/AuthLayout";
import { useForgotPassword } from "@/auth/hooks/useForgotPassword";

export default function PasswordForgotPage() {
  const {
    email,
    setEmail,
    isValidEmail,
    isSubmitting,
    requestSuccess,
    errorMessage,
    handleSubmit,
  } = useForgotPassword();

  return (
    <AuthLayout
      title="Forgot your password?"
      description="Enter your email to receive a reset link"
      actionText="Back to login"
      actionLink="/auth/login"
      onSubmit={handleSubmit}
      buttonLabel="Send Reset Link"
      loading={isSubmitting}
      showForgotPassword={false}
    >
      <PasswordForgot
        email={email}
        setEmail={setEmail}
        isValidEmail={isValidEmail}
        requestSuccess={requestSuccess}
        errorMessage={errorMessage}
      />
    </AuthLayout>
  );
}
