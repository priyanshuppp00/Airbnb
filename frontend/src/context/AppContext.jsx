import React, { createContext, useState, useEffect } from "react";
import { storeAPI, authAPI } from "../service/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ----------------------------
  // THEME HANDLING
  // ----------------------------
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setIsDarkMode(savedTheme === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // ----------------------------
  // AUTH HANDLING
  // ----------------------------
  const fetchCurrentUser = async () => {
    try {
      const sessionData = await authAPI.checkSession();
      if (sessionData.loggedIn && sessionData.user) {
        setUser(sessionData.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to check session", err);
      setUser(null);
    }
  };

  // ----------------------------
  // BOOKINGS
  // ----------------------------
  const refreshBookings = async () => {
    try {
      const res = await storeAPI.getBookings();
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to refresh bookings", err);
    }
  };

  const addBooking = async (homeId) => {
    try {
      const res = await storeAPI.addToBooking(homeId);
      setBookings((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to add booking", err);
    }
  };

  const removeBooking = async (homeId) => {
    try {
      await storeAPI.removeFromBooking(homeId);
      setBookings((prev) => prev.filter((b) => b._id !== homeId));
    } catch (err) {
      console.error("Failed to remove booking", err);
    }
  };

  // ----------------------------
  // FAVOURITES
  // ----------------------------
  const refreshFavourites = async () => {
    try {
      const res = await storeAPI.getFavourites();
      setFavourites(res.data);
    } catch (err) {
      console.error("Failed to refresh favourites", err);
    }
  };

  const addFavourite = async (homeId) => {
    try {
      const res = await storeAPI.addToFavourite(homeId);
      setFavourites((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to add favourite", err);
    }
  };

  const removeFavourite = async (homeId) => {
    try {
      await storeAPI.removeFromFavourite(homeId);
      setFavourites((prev) => prev.filter((f) => f._id !== homeId));
    } catch (err) {
      console.error("Failed to remove favourite", err);
    }
  };

  // ----------------------------
  // PASSWORD TOGGLE
  // ----------------------------
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  // ----------------------------
  // INITIAL LOAD
  // ----------------------------
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (user) {
      refreshBookings();
      refreshFavourites();
    } else {
      setBookings([]);
      setFavourites([]);
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        bookings,
        addBooking,
        removeBooking,
        favourites,
        addFavourite,
        removeFavourite,
        refreshBookings,
        refreshFavourites,
        isDarkMode,
        toggleTheme,
        showPassword,
        toggleShowPassword,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
