import { useResetPassword } from "@/auth/hooks/useResetPassword";
import PasswordReset from "@/auth/components/PasswordReset";
import AuthLayout from "@/auth/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    resetSuccess,
    errorMessage,
    passwordsMatch,
    passwordRequirements,
    handleSubmit,
    isSubmitting,
  } = useResetPassword(); // Usando el hook

  return (
    <AuthLayout
      title="Reset Your Password"
      description="Enter a new password for your account"
      actionText="Don't have an account?"
      actionLink="/auth/register"
      onSubmit={(e) => handleSubmit(e, navigate)} 
      buttonLabel="Reset Password"
      loading={isSubmitting}
      showForgotPassword={false}
      showSocialLogin={false}
    >
      <PasswordReset
        password={password}
        confirmPassword={confirmPassword}
        setPassword={setPassword}
        setConfirmPassword={setConfirmPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        resetSuccess={resetSuccess}
        errorMessage={errorMessage}
        passwordsMatch={passwordsMatch}
        passwordRequirements={passwordRequirements}
      />
    </AuthLayout>
  );
}
