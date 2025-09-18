import axios from "axios";

// Remove trailing slash from env URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

// If not provided, fallback smartly
const baseURL =
  API_BASE_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : window.location.origin);

const apiClient = axios.create({
  baseURL,
  withCredentials: true, // allow cookies/sessions
});

// -------------------- Store API -------------------- //
export const storeAPI = {
  getHomes: (page = 1, limit = 10) =>
    apiClient.get(`/api/store/?page=${page}&limit=${limit}`),
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

// -------------------- Auth API -------------------- //
export const authAPI = {
  checkSession: () => apiClient.get("/api/auth/current-user"),
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
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// -------------------- Host API -------------------- //
export const hostAPI = {
  getHostHomes: () => apiClient.get("/api/host/homes"),
  addHome: (homeData) =>
    apiClient.post("/api/host/homes", homeData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  editHome: (homeId, homeData) =>
    apiClient.put(`/api/host/homes/${homeId}`, homeData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteHome: (homeId) => apiClient.delete(`/api/host/homes/${homeId}`),
  getBookingRequests: () => apiClient.get("/api/host/booking-requests"),
};
