import React, { createContext, useState } from "react";
import { signup as apiSignup, login as apiLogin } from "../api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const signup = async (email, password) => {
    const res = await apiSignup(email, password);
    return res;
  };

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    // backend returns { message, data } from Supabase client
    // store minimal user info locally
    setUser({ email });
    navigate("/");
    return res;
  };

  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
