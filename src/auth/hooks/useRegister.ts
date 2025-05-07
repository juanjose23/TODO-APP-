import { useState } from "react"
import { authService } from "@/auth/services/authService"
import { RegisterDto } from "@/auth/types/authTypes"
import { useAuthActions } from "./useAuthActions"
import { useNavigate } from "react-router-dom"


export const useRegister = () => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})  
  const { login } = useAuthActions()
  const navigate = useNavigate()

  const register = async (data: RegisterDto) => {
    setLoading(true)
    setErrors({})

    try {
      const res = await authService.register(data)


      login(res.user, res.token,res.refresh_token)
      navigate("/") 
    } catch (err: any) {
      console.log("Error de validación:", err?.response?.data);
      if (err?.response?.data?.errors) {
        setErrors(err.response.data.errors)
      } else {
        setErrors({ general: err.message || "Error during registration" })
      }
    } finally {
      setLoading(false)
    }
  }

  return { register, loading, errors }
}
