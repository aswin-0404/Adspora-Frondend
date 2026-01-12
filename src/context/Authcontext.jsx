import { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const BASE_URL = "http://127.0.0.1:8000/api";



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const navigate=useNavigate()
  
  const register = async (formData) => {
    try {
      const res = await axios.post(`${BASE_URL}/register/`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        password: formData.password,
        confirmpassword: formData.confirmPassword,
      });

      return  res.data

    } catch (error) {
    console.log("REGISTER ERROR:", error.response.data); // 👈 ADD THIS
    return error.response.data;
  }
  };

  const login = async (formData) => {
    try {
      const res = await axios.post(`${BASE_URL}/login/`, {
        email: formData.email,
        password: formData.password,
      });

      setUser(res.data.user); 

      localStorage.setItem("access",res.data.token.access);
      localStorage.setItem("refresh",res.data.token.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));



      return { 
        success: true,
        role:res.data.user.role,
        message:res.data.message,

      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Invalid credentials",
      };
    }
  };

  const logout=()=>{
    setUser(null)
    localStorage.removeItem("refresh")
    localStorage.removeItem("access")
    localStorage.removeItem("user")
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, register, login ,logout}}>
      {children}
    </AuthContext.Provider>
  );
};



