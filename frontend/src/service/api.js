import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Store API functions
export const storeAPI = {
  // Get all homes
  getHomes: () => apiClient.get("/store/"),

  // Get home details by ID
  getHomeDetails: (homeId) => apiClient.get(`/store/homes/${homeId}`),

  // Get home rules by ID
  getHomeRules: (homeId) => apiClient.get(`/store/rules/${homeId}`),

  // Download rules PDF
  downloadRules: (homeId) =>
    apiClient.get(`/api/store/rules/${homeId}`, { responseType: "blob" }),

  // Add home to bookings
  addToBooking: (homeId) => apiClient.post("/api/store/bookings", { homeId }),

  // Get bookings list
  getBookings: () => apiClient.get("/store/bookings"),

  // Remove home from bookings
  removeFromBooking: (homeId) => apiClient.delete(`/store/bookings/${homeId}`),

  // Add home to favourites
  addToFavourite: (homeId) => apiClient.post("/store/favourites", { homeId }),

  // Get favourites list
  getFavourites: () => apiClient.get("/store/favourites"),

  // Remove home from favourites
  removeFromFavourite: (homeId) =>
    apiClient.delete(`/store/favourites/${homeId}`),
};

// Auth API functions
export const authAPI = {
  // Get current user
  getCurrentUser: () => apiClient.get("/auth/current-user"),

  // User login
  login: (credentials) => apiClient.post("/auth/login", credentials),

  // User signup
  signup: (userData) => apiClient.post("/auth/signup", userData),

  // User logout
  logout: () => apiClient.post("/auth/logout"),

  // Forgot password
  forgotPassword: (email) => apiClient.post("/auth/forgot-password", { email }),

  // Update user profile
  updateProfile: (profileData) => {
    const formData = new FormData();
    for (const key in profileData) {
      if (key === "profilePic" && profileData[key]) {
        formData.append("profilePic", profileData[key]);
      } else {
        formData.append(key, profileData[key]);
      }
    }
    return apiClient.put("/auth/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Host API functions
export const hostAPI = {
  // Get host's homes
  getHostHomes: () => apiClient.get("/host/homes"),

  // Add new home
  addHome: (homeData) => {
    return apiClient.post("/host/homes", homeData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Edit home
  editHome: (homeId, homeData) => {
    return apiClient.put(`/host/homes/${homeId}`, homeData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete home
  deleteHome: (homeId) => apiClient.delete(`/host/homes/${homeId}`),

  // Get booking requests
  getBookingRequests: () => apiClient.get("/host/booking-requests"),
};
