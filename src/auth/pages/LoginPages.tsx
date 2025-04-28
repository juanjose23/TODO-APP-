// src/auth/pages/LoginPage.tsx

import AuthLayout from "@/auth/layouts/AuthLayout"
import SignInForm from "@/auth/components/SignInForm"
import { useLogin } from "@/auth/hooks/useLogin "
import { useState } from "react"

export default function LoginPage() {
  const { loginUser, loading, error, formErrors } = useLogin()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginUser(email, password)
  }

  return (
    <AuthLayout
      title="Sign in to your account"
      description="Enter your email and password"
      actionText="Sign in"
      actionLink="/auth/register"
      onSubmit={handleSubmit}
      buttonLabel="Log In"
      loading={loading}
      showForgotPassword={true}
    >
      <SignInForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        formErrors={formErrors}
        error={error ?? undefined}
      />
    </AuthLayout>
  )
}
