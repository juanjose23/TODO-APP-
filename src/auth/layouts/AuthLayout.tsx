"use client"

import { useAuth } from "../hooks/useAuth";
import type { ReactNode } from "react"
import { Github, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

interface AuthLayoutProps {
  title: string
  description: string
  actionText: string
  actionLink: string
  children: ReactNode
  onSubmit: (e: React.FormEvent) => void
  buttonLabel: string
  loading?: boolean
  showForgotPassword?: boolean
  forgotPasswordLink?: string
  showSocialLogin?: boolean
}

export default function AuthLayout({ children,
  title,
  description,
  actionText,
  actionLink,
  onSubmit,
  buttonLabel,
  loading,
  showForgotPassword = false,
  forgotPasswordLink = "/auth/password-forgot",
  showSocialLogin = true,
}: AuthLayoutProps) {
  const { loginWithTwitter } = useAuth();


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">TODO App</h2>
        </div>

        <div className="mx-auto max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-gray-500 dark:text-gray-400">{description}</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {children}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : buttonLabel}
            </Button>

            {showForgotPassword && (
              <div className="text-center text-sm">
                <Link to={forgotPasswordLink} className="text-blue-500 hover:text-blue-700">
                  Forgot your password?
                </Link>
              </div>
            )}
          </form>
          <div className="text-center text-sm">
            {actionText === "Create account" ? (
              <>
                Already have an account?{" "}
                <Link to={actionLink} className="underline text-blue-500 hover:text-blue-700">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <Link to={actionLink} className="underline text-blue-500 hover:text-blue-700">
                  Sign up
                </Link>
              </>
            )}
          </div>
          {showSocialLogin && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full py-2">
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </Button>
                <Button variant="outline" className="w-full py-2" onClick={loginWithTwitter}>
                  <Twitter className="mr-2 h-5 w-5" />
                  X (Twitter)
                </Button>
              </div>
            </>
          )}





        </div>
      </div>
    </div>
  );
}
