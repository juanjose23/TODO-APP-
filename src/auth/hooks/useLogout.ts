import { useDispatch } from "react-redux"
import { logout } from "@/auth/store/authSlice"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/authService";

export const useLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutUser = async () => {
    try {
      
      const response =authService.logout();
      dispatch(logout())
      navigate("/auth/login")
      console.log(response)
    } catch (error) {
 
      console.error("Error durante el logout", error)
    }
  }

  return logoutUser
}
