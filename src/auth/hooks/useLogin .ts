import { useState } from "react";
import { authService } from "@/auth/services/authService";
import { useAuthActions } from "@/auth/hooks/useAuthActions";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const { login } = useAuthActions();
    const navigate = useNavigate();

    const loginUser = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        setFormErrors({});

        try {
            const response = await authService.login({ email, password });
            console.log("Login response:", response);
            if (response?.user && response?.token) {
              
                login(response.user, response.token, response.refresh_token)
            
            } else {
                throw new Error("Credentials not found ");
            }


          
            navigate("/");

        } catch (err: any) {


            if (err?.response?.data?.message === "Invalid credentials") {
                setError("Invalid credentials. Please check your email and password.");
            } else if (err?.response?.data?.errors) {

                const errorData = err.response.data.errors;
                setFormErrors(errorData);
            } else {

                setError(err.message || "An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return { loginUser, loading, error, formErrors };
};
