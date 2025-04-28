import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface Props {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  password_confirmation: string;
  setPasswordConfirmation: (value: string) => void;
  formErrors: Record<string, string>;
  apiErrors?: Record<string, string[]>;
}

export default function SignUpForm({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  password_confirmation,
  setPasswordConfirmation,
  formErrors,
  apiErrors,
}: Props) {
  const getErrorMessage = (field: string) =>
    formErrors[field] || apiErrors?.[field]?.[0] || "";

  const renderInputField = (
    id: string,
    label: string,
    type: string,
    value: string,
    onChange: (value: string) => void,
    autoComplete?: string
  ) => {
    const errorMessage = getErrorMessage(id);
    const hasError = !!errorMessage;

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
            autoComplete={autoComplete}
            className={
              hasError ? "border-red-500 pr-10 focus-visible:ring-red-500" : ""
            }
          />
          {hasError && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {hasError && (
          <p className="text-sm text-red-500 mt-1 flex items-center">
            {errorMessage}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      {renderInputField("name", "Name", "text", name, setName)}
      {renderInputField("email", "Email", "email", email, setEmail)}
      {renderInputField("password", "Password", "password", password, setPassword, "new-password")}
      {renderInputField(
        "password_confirmation",
        "Confirm Password",
        "password",
        password_confirmation,
        setPasswordConfirmation,
        "new-password"
      )}
    </>
  );
}
