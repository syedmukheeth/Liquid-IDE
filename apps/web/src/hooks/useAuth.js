import { useState, useEffect, useCallback } from "react";
import { getMe } from "../services/authApi";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("sam_token"));
  const [loading, setLoading] = useState(true);

  const logoutUser = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("sam_user");
    localStorage.removeItem("sam_token");
  }, []);

  const loginUser = useCallback((userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("sam_user", JSON.stringify(userData));
    localStorage.setItem("sam_token", accessToken);
  }, []);

  const fetchUser = useCallback(async (authToken) => {
    try {
      const userData = await getMe(authToken);
      setUser(userData);
      localStorage.setItem("sam_user", JSON.stringify(userData));
    } catch (err) {
      console.error("Session verification failed:", err);
      if (err.response?.status === 401) {
        logoutUser();
      }
    } finally {
      setLoading(false);
    }
  }, [logoutUser]);

  useEffect(() => {
    // PRIME MODE: Immediate OAuth token detection from URL
    const searchParams = new URLSearchParams(window.location.search);
    const oauthToken = searchParams.get("token");
    
    if (oauthToken) {
      // 1. Immediately persist to state and storage
      setToken(oauthToken);
      localStorage.setItem("sam_token", oauthToken);
      
      // 2. High-Fidelity URL Cleaning: Remove ONLY the token, leave other params (like session)
      searchParams.delete("token");
      const newSearch = searchParams.toString();
      const newRelativePathQuery = window.location.pathname + (newSearch ? `?${newSearch}` : "");
      window.history.replaceState({}, document.title, newRelativePathQuery);
    }
  }, []);


  useEffect(() => {
    if (token) {
      const savedUser = localStorage.getItem("sam_user");
      if (savedUser) setUser(JSON.parse(savedUser));
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  return {
    user,
    token,
    loading,
    loginUser,
    logoutUser,
    isAuthenticated: !!token
  };
}
