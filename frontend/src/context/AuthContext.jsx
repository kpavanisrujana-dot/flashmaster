import { createContext, useContext, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("flashmaster_user");
    if (!saved) {
      return null;
    }
    const parsed = JSON.parse(saved);
    return { role: "user", ...parsed };
  });

  const [loading, setLoading] = useState(false);

  const persistAuth = (authData) => {
    const nextUser = { role: "user", ...authData.user };
    localStorage.setItem("flashmaster_token", authData.token);
    localStorage.setItem("flashmaster_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", payload);
      persistAuth(data);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      persistAuth(data);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("flashmaster_token");
    localStorage.removeItem("flashmaster_user");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
