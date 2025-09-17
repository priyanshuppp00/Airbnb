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
  const [progress, setProgress] = useState(0);
  const [isFailed, setIsFailed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [favouriteId, setFavouriteId] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedHome, setSelectedHome] = useState(null);
  const { refreshBookings, refreshFavourites } = useContext(AppContext);
  const {
    user,
    userBookings,
    setUserBookings,
    userFavourites,
    setUserFavourites,
  } = useContext(UserContext);

  const fetchHomes = (page = 1) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setIsFailed(false);
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 10, 90));
    }, 200);

    storeAPI
      .getHomes(page)
      .then((res) => {
        if (res.data && Array.isArray(res.data.homes)) {
          if (page === 1) {
            setHomes(res.data.homes);
          } else {
            setHomes((prev) => [...prev, ...res.data.homes]);
          }
          setTotalPages(res.data.totalPages);
          setCurrentPage(res.data.currentPage);
          setProgress(100);
        } else {
          throw new Error("Invalid data received.");
        }
      })
      .catch(() => {
        setIsFailed(true);
      })
      .finally(() => {
        clearInterval(progressInterval);
        setLoading(false);
        setLoadingMore(false);
      });
  };

  // Fetch homes once
  useEffect(() => {
    fetchHomes();
  }, []);

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
      // Refetch homes to update UI if needed
      fetchHomes(1);
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
      // Refetch homes to update UI if needed
      fetchHomes(1);
    } catch {
      alert("Failed to add to favourites.");
    } finally {
      setFavouriteId(null);
    }
  };

  if (loading || isFailed)
    return (
      <Spinner
        message="Loading All homes..."
        timeoutMessage="Loading homes is taking longer than usual. Please wait."
        progress={progress}
        isFailed={isFailed}
        onRetry={fetchHomes}
      />
    );

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
                    src={
                      home.photoUrls && home.photoUrls.length > 0
                        ? home.photoUrls[0]
                        : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjNGNEY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=="
                    }
                    alt={home.houseName}
                    onError={(e) =>
                      (e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjNGNEY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==")
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

        {/* Load More Button */}
        {currentPage < totalPages && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchHomes(currentPage + 1)}
              disabled={loadingMore}
              className={`px-6 py-3 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                loadingMore
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
              }`}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
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
