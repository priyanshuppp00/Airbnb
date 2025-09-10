import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { UserContext } from "../context/UserContext";
import LoginPopup from "../auth/LoginPopup";
import toast, { Toaster } from "react-hot-toast";

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { refreshBookings } = useContext(AppContext);
  const { user, loading: userLoading } = useContext(UserContext);

  const fetchBookings = () => {
    axios
      .get("/api/store/bookings")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setBookings(res.data);
        } else {
          setError("Invalid data received.");
        }
      })
      .catch(() => setError("Failed to fetch bookings."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleRemoveBooking = (homeId) => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    setRemovingId(homeId);
    axios
      .delete(`/api/store/bookings/${homeId}`)
      .then(() => {
        toast.success("Booking removed successfully!");
        fetchBookings();
        if (refreshBookings) refreshBookings();
      })
      .catch(() => alert("Failed to remove booking."))
      .finally(() => setRemovingId(null));
  };

  if (loading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-medium text-gray-600 animate-pulse">
          Loading bookings...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen px-4 pb-20 bg-gray-100">
        <Toaster position="top-center" reverseOrder={false} />
        <h1 className="pt-24 pb-6 text-4xl font-bold text-center text-gray-800">
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <p className="text-2xl font-medium text-center text-gray-600">
            No bookings found.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {bookings.map((home) => (
              <div
                key={home._id}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                  <img
                    loading="lazy"
                    src={home.photoUrl || "https://via.placeholder.com/400x250"}
                    alt={home.houseName}
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/400x250")
                    }
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {home.houseName}
                  </h2>
                  <p className="text-sm text-gray-500">{home.location}</p>

                  <div className="flex items-center justify-between">
                    <p className="font-bold text-red-600">
                      ₹ {home.price}
                      <span className="text-sm font-normal"> / night</span>
                    </p>
                    <div className="flex text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`${
                            i < Math.round(home.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-2">
                    {home.description}
                  </p>

                  <button
                    onClick={() => handleRemoveBooking(home._id)}
                    disabled={removingId === home._id}
                    className={`w-full py-2 mt-2 rounded text-white cursor-pointer font-medium transition ${
                      removingId === home._id
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {removingId === home._id ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg
                          className="w-4 h-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Removing...
                      </div>
                    ) : (
                      "Remove Booking"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showLoginPopup && (
        <LoginPopup onClose={() => setShowLoginPopup(false)} />
      )}
    </>
  );
};

export default Booking;
