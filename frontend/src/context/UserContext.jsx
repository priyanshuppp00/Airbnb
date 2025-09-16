import React, { createContext, useState, useEffect } from "react";
import { authAPI, storeAPI } from "../service/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState([]);
  const [userFavourites, setUserFavourites] = useState([]);

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

  const fetchUserData = async () => {
    if (user) {
      try {
        const [bookingsRes, favouritesRes] = await Promise.all([
          storeAPI.getBookings(),
          storeAPI.getFavourites(),
        ]);
        if (Array.isArray(bookingsRes.data)) {
          const bookings = bookingsRes.data.map((b) => b._id);
          setUserBookings(bookings);
          localStorage.setItem("userBookings", JSON.stringify(bookings));
        }
        if (Array.isArray(favouritesRes.data)) {
          const favourites = favouritesRes.data.map((f) => f._id);
          setUserFavourites(favourites);
          localStorage.setItem("userFavourites", JSON.stringify(favourites));
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setUserBookings([]);
      setUserFavourites([]);
      localStorage.removeItem("userBookings");
      localStorage.removeItem("userFavourites");
    }
  }, [user]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedBookings = localStorage.getItem("userBookings");
    const savedFavourites = localStorage.getItem("userFavourites");
    if (savedBookings) {
      setUserBookings(JSON.parse(savedBookings));
    }
    if (savedFavourites) {
      setUserFavourites(JSON.parse(savedFavourites));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const clearUserData = () => {
    setUser(null);
    setUserBookings([]);
    setUserFavourites([]);
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
        userBookings,
        setUserBookings,
        userFavourites,
        setUserFavourites,
        login,
        logout,
        fetchUser,
        fetchUserData,
        isAuthenticated,
        clearUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
