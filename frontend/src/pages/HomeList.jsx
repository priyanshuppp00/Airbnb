import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Spinner from "../Components/Spinner";
import { UserContext } from "../context/UserContext";
import LoginPopup from "../auth/LoginPopup";
import BookingForm from "../Components/BookingForm";
import { storeAPI } from "../service/api";
import toast, { Toaster } from "react-hot-toast";

const HomeList = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [favouriteId, setFavouriteId] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedHome, setSelectedHome] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [userFavourites, setUserFavourites] = useState([]);
  const { refreshBookings, refreshFavourites } = useContext(AppContext);
  const { user } = useContext(UserContext);

  // Fetch homes once
  useEffect(() => {
    storeAPI
      .getHomes()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setHomes(res.data);
        } else {
          setError("Invalid data received.");
        }
      })
      .catch(() => setError("Failed to fetch homes."))
      .finally(() => setLoading(false));
  }, []);

  // Fetch user bookings & favourites when user changes
  useEffect(() => {
    if (user) {
      // Fetch bookings
      storeAPI
        .getBookings()
        .then((res) => {
          if (Array.isArray(res.data)) {
            setUserBookings(res.data.map((b) => b._id));
          }
        })
        .catch(() => {});

      // Fetch favourites
      storeAPI
        .getFavourites()
        .then((res) => {
          if (Array.isArray(res.data)) {
            setUserFavourites(res.data.map((f) => f._id));
          }
        })
        .catch(() => {});
    } else {
      // Clear on logout
      setUserBookings([]);
      setUserFavourites([]);
    }
  }, [user]);

  const handleBookNow = (home) => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    setSelectedHome(home);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    setBookingId(bookingData.homeId);
    try {
      await storeAPI.addToBooking(bookingData.homeId);
      toast.success("Booked successfully!");
      setUserBookings((prev) => [...prev, bookingData.homeId]);
      refreshBookings?.();
    } catch {
      alert("Failed to book home.");
    } finally {
      setBookingId(null);
    }
  };

  const handleFavourite = async (homeId) => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    setFavouriteId(homeId);
    try {
      await storeAPI.addToFavourite(homeId);
      toast.success("Added to favourites!");
      setUserFavourites((prev) => [...prev, homeId]);
      refreshFavourites?.();
    } catch {
      alert("Failed to add to favourites.");
    } finally {
      setFavouriteId(null);
    }
  };

  if (loading)
    return (
      <Spinner
        message="Loading All homes..."
        timeoutMessage="Loading homes is taking longer than usual. Please wait."
      />
    );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen px-4 pb-20 bg-gray-100">
        <Toaster position="top-center" reverseOrder={false} />
        <h1 className="pt-24 pb-6 text-4xl font-bold text-center text-gray-800">
          Explore Beautiful Homes
        </h1>

        {homes.length === 0 ? (
          <p className="text-2xl font-medium text-center text-gray-600">
            No Homes Available.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {homes.map((home) => (
              <div
                key={home._id}
                className="bg-white rounded-2xl shadow hover:shadow-xl"
              >
                <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden rounded-t-2xl">
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
                  <Link to={`/homes/${home._id}`} className="hover:underline">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {home.houseName}
                    </h2>
                  </Link>

                  <p className="text-sm text-gray-500">{home.location}</p>

                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-red-600">
                      ₹{home.price}{" "}
                      <span className="text-sm font-normal text-gray-600">
                        / night
                      </span>
                    </p>
                    <div className="flex text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < Math.round(home.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-2">
                    {home.description}
                  </p>

                  <div className="flex gap-2 mt-2">
                    {/* Book Button */}
                    <button
                      onClick={() => handleBookNow(home)}
                      disabled={
                        bookingId === home._id ||
                        userBookings.includes(home._id)
                      }
                      className={`flex-1 py-2  text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                        bookingId === home._id
                          ? "bg-green-300"
                          : userBookings.includes(home._id)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600 cursor-pointer"
                      }`}
                    >
                      {bookingId === home._id
                        ? "Booking..."
                        : userBookings.includes(home._id)
                        ? "Already Booked"
                        : "Book"}
                    </button>

                    {/* Favourite Button */}
                    <button
                      onClick={() => handleFavourite(home._id)}
                      disabled={
                        favouriteId === home._id ||
                        userFavourites.includes(home._id)
                      }
                      className={`flex-1 py-2  text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl  ${
                        favouriteId === home._id
                          ? "bg-pink-300"
                          : userFavourites.includes(home._id)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 cursor-pointer"
                      }`}
                    >
                      {favouriteId === home._id
                        ? "Adding..."
                        : userFavourites.includes(home._id)
                        ? "Already Favourite"
                        : "Favourite"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showLoginPopup && (
        <LoginPopup onClose={() => setShowLoginPopup(false)} />
      )}
      {showBookingForm && selectedHome && (
        <BookingForm
          home={selectedHome}
          onSubmit={handleBookingSubmit}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </>
  );
};

export default HomeList;
