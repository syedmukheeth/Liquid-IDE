import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("flux_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("flux_user");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

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
