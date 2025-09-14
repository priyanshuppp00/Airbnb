import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://airbnb-backend-9kz8.onrender.com"
).replace(/\/$/, "");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Store API functions
export const storeAPI = {
  getHomes: () => apiClient.get("/api/store/"),
  getHomeDetails: (homeId) => apiClient.get(`/api/store/homes/${homeId}`),
  getHomeRules: (homeId) => apiClient.get(`/api/store/rules/${homeId}`),
  downloadRules: (homeId) =>
    apiClient.get(`/api/store/rules/${homeId}`, { responseType: "blob" }),
  addToBooking: (homeId) => apiClient.post("/api/store/bookings", { homeId }),
  getBookings: () => apiClient.get("/api/store/bookings"),
  removeFromBooking: (homeId) =>
    apiClient.delete(`/api/store/bookings/${homeId}`),
  addToFavourite: (homeId) =>
    apiClient.post("/api/store/favourites", { homeId }),
  getFavourites: () => apiClient.get("/api/store/favourites"),
  removeFromFavourite: (homeId) =>
    apiClient.delete(`/api/store/favourites/${homeId}`),
};

// Auth API functions
export const authAPI = {
  getCurrentUser: () => apiClient.get("/api/auth/current-user"),
  login: (credentials) => apiClient.post("/api/auth/login", credentials),
  signup: (userData) => apiClient.post("/api/auth/signup", userData),
  logout: () => apiClient.post("/api/auth/logout"),
  forgotPassword: (email) =>
    apiClient.post("/api/auth/forgot-password", { email }),
  updateProfile: (profileData) => {
    const formData = new FormData();
    for (const key in profileData) {
      if (key === "profilePic" && profileData[key]) {
        formData.append("profilePic", profileData[key]);
      } else {
        formData.append(key, profileData[key]);
      }
    }
    return apiClient.put("/api/auth/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Host API functions
export const hostAPI = {
  getHostHomes: () => apiClient.get("/api/host/homes"),
  addHome: (homeData) => {
    return apiClient.post("/api/host/homes", homeData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  editHome: (homeId, homeData) => {
    return apiClient.put(`/api/host/homes/${homeId}`, homeData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteHome: (homeId) => apiClient.delete(`/api/host/homes/${homeId}`),
  getBookingRequests: () => apiClient.get("/api/host/booking-requests"),
};
