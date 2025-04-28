import { useState } from "react";
import { useRegister } from "@/auth/hooks/useRegister";
import { RegisterDto } from "@/auth/types/authTypes";
import AuthLayout from "@/auth/layouts/AuthLayout";
import SignUpForm from "@/auth/components/SignUpForm";

export default function RegisterPage() {
  const { register, loading, errors } = useRegister();  // Aquí recibimos los errores de la API
  const [formData, setFormData] = useState<RegisterDto>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar el error local cuando el usuario empieza a corregir el campo
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset form errors
    setFormErrors({});

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.password_confirmation) {
      setFormErrors({
        password_confirmation: "Passwords do not match",
      });
      return;
    }

    // Realizar la solicitud de registro
    register(formData);
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your email below to create your account"
      actionText="Create account"
      actionLink="/auth/login"
      onSubmit={handleSubmit}
      buttonLabel="Register"
      loading={loading}
      showForgotPassword={false}
    >
      <SignUpForm
        name={formData.name}
        setName={(value: string) => handleChange({ target: { name: "name", value } } as any)}
        email={formData.email}
        setEmail={(value: string) => handleChange({ target: { name: "email", value } } as any)}
        password={formData.password}
        setPassword={(value: string) => handleChange({ target: { name: "password", value } } as any)}
        password_confirmation={formData.password_confirmation}
        setPasswordConfirmation={(value: string) =>
          handleChange({ target: { name: "password_confirmation", value } } as any)
        }
        formErrors={formErrors} 
        apiErrors={errors}     
      />
    </AuthLayout>
  );
}
