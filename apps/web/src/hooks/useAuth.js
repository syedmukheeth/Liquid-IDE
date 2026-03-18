import { useState, useEffect, useCallback } from "react";
import { getMe } from "../services/authApi";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("flux_token"));
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (authToken) => {
    try {
      const userData = await getMe(authToken);
      setUser(userData);
      localStorage.setItem("flux_user", JSON.stringify(userData));
    } catch (err) {
      console.error("Session verification failed:", err);
      // Optional: Clear session on invalid token
      // logoutUser(); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const savedUser = localStorage.getItem("flux_user");
      if (savedUser) setUser(JSON.parse(savedUser));
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const loginUser = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("flux_user", JSON.stringify(userData));
    localStorage.setItem("flux_token", accessToken);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("flux_user");
    localStorage.removeItem("flux_token");
  };

  return {
    user,
    token,
    loading,
    loginUser,
    logoutUser,
    isAuthenticated: !!token
  };
}
