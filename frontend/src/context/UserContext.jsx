import React, { createContext, useState, useEffect } from "react";
import { authAPI } from "../service/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await authAPI.getCurrentUser();
      setUser(res.data.user || null);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const clearUserData = () => {
    setUser(null);
    // You can clear more user-related states here if you store them in this context
    // For example: setFavorites([]), setBookings([]), etc.
  };

  const logout = async () => {
    try {
      const res = await authAPI.logout();
      if (res.status === 200) {
        clearUserData();
      }
    } catch (err) {
      console.error("Logout failed:", err);
      clearUserData(); // Still clear locally even if API fails
    }
  };

  const isAuthenticated = !!user;

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        fetchUser,
        isAuthenticated,
        clearUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
