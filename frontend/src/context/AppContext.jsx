import React, { createContext, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const addBooking = (booking) => {
    setBookings((prev) => [...prev, booking]);
  };

  const removeBooking = (bookingId) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  const addFavourite = (item) => {
    setFavourites((prev) => [...prev, item]);
  };

  const removeFavourite = (itemId) => {
    setFavourites((prev) => prev.filter((f) => f.id !== itemId));
  };

  const refreshBookings = async () => {
    try {
      const res = await axios.get("/api/store/bookings", {
        withCredentials: true,
      });
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to refresh bookings", error);
    }
  };

  const refreshFavourites = async () => {
    try {
      const res = await axios.get("/api/store/favourites", {
        withCredentials: true,
      });
      setFavourites(res.data);
    } catch (error) {
      console.error("Failed to refresh favourites", error);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

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
