"use client";

import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";

import { AlertCircle } from "lucide-react";

interface PasswordForgotProps {
  email: string;
  setEmail: (value: string) => void;
  isValidEmail: (email: string) => boolean;
  requestSuccess: boolean | null;
  errorMessage: string;
}

export default function PasswordForgot({
  email,
  setEmail,
  isValidEmail,
  requestSuccess,
  errorMessage,
}: PasswordForgotProps) {
  return (
    <>
      {requestSuccess !== null && (
        <div
          className={`rounded-md p-3 flex items-start mb-4 ${requestSuccess
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
            }`}
        >
          {requestSuccess ? (
            <svg className="h-5 w-5 mr-2 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
          )}
          <span>{requestSuccess ? "Email sent successfully!" : errorMessage}</span>
        </div>
      )}


      {/* Agregar margen superior al input si hay alerta */}
      <div className={requestSuccess || errorMessage ? "mt-4" : ""}>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className={errorMessage ? "text-red-500" : "text-sm font-medium"}
          >
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errorMessage ? "border-red-500 pr-10 focus-visible:ring-red-500 pl-10" : "pr-10 focus-visible:ring-blue-500 pl-10"}
              placeholder="name@example.com"
              required
            />
          </div>
          {email && !isValidEmail(email) && (
            <p className="text-sm text-red-500 mt-1">
              Please enter a valid email address
            </p>
          )}
        </div>
      </div>
    </>
  );
}
