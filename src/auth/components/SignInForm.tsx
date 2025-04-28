import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface Props {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  formErrors: Record<string, string>;
  error?: string | null;
}

export default function SignInForm({
  email,
  setEmail,
  password,
  setPassword,
  formErrors,
  error,
}: Props) {
  const getErrorMessage = (field: string) => formErrors[field] || "";

  const renderInputField = (
    id: "email" | "password",
    label: string,
    type: string,
    value: string,
    onChange: (value: string) => void
  ) => {
    const errorMessage = getErrorMessage(id);
    const hasError = error;
    
    return (
      <div className="space-y-2">
        <Label htmlFor={id} className={hasError ? "text-red-500" : ""}>
          {label}
        </Label>
        <div className="relative">
          <Input
            id={id}
            type={type}
            name={id}
            value={value}
            placeholder={label}
            onChange={(e) => onChange(e.target.value)}
            required
            className={hasError ? "border-red-500 pr-10 focus-visible:ring-red-500" : ""}
          />
          {hasError && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {hasError && (
          <p className="text-sm text-red-500 mt-1 flex items-center">{errorMessage}</p>
        )}
      </div>
    );
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 flex items-start mb-4">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
      {renderInputField("email", "Email", "email", email, setEmail)}
      {renderInputField("password", "Password", "password", password, setPassword)}
    </>
  );
}
