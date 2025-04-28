import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface PasswordResetProps {
  password: string;
  confirmPassword: string;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
  resetSuccess: boolean | null;
  errorMessage: string;
  passwordsMatch: boolean;
  passwordRequirements: { text: string; met: boolean }[];
}

export default function PasswordReset({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  resetSuccess,
  errorMessage,
  passwordsMatch,
  passwordRequirements,
}: PasswordResetProps) {
  return (
    <>
      {/* Success or error message */}
      {resetSuccess !== null && (
        <div
          className={`rounded-md p-3 flex items-start mb-4 ${resetSuccess
            ? "bg-green-50 border border-green-200 text-green-800"
            : "bg-red-50 border border-red-200 text-red-800"
            }`}
        >
          {resetSuccess ? (
            <svg className="h-5 w-5 mr-2 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
          )}
          <span>{resetSuccess ? "Password reset successfully!" : errorMessage}</span>
        </div>
      )}

      {/* Password Input */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          New Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10"
            placeholder="Enter your new password"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm New Password
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pr-10"
            placeholder="Confirm your new password"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {confirmPassword && !passwordsMatch && <p className="text-sm text-red-500 mt-1">Passwords do not match</p>}
      </div>

      {/* Password Requirements */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Password Requirements:</p>
        <ul className="space-y-1">
          {passwordRequirements.map((req, index) => (
            <li key={index} className="flex items-center text-sm">
              {req.met ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-300 mr-2" />
              )}
              <span className={req.met ? "text-green-700" : "text-gray-500"}>{req.text}</span>
            </li>
          ))}
          <li className="flex items-center text-sm">
            {passwordsMatch && confirmPassword ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-4 w-4 text-gray-300 mr-2" />
            )}
            <span className={passwordsMatch && confirmPassword ? "text-green-700" : "text-gray-500"}>
              Passwords match
            </span>
          </li>
        </ul>
      </div>
    </>
  );
}
