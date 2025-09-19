import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { AppContext } from "../context/AppContext";
import { storeAPI } from "../service/api";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../Components/Spinner";

const Favourite = () => {
  const {
    user,
    loading: userLoading,
    setUserFavourites,
  } = useContext(UserContext);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favouriteLoadingIds, removeFavourite } = useContext(AppContext);

  // Fetch favourites whenever the user changes
  useEffect(() => {
    if (user) {
      setLoading(true);
      storeAPI
        .getFavourites()
        .then((res) => {
          if (Array.isArray(res.data)) {
            setFavourites(res.data);
          } else {
            setError("Invalid data received.");
          }
        })
        .catch(() => setError("Failed to fetch favourites."))
        .finally(() => setLoading(false));
    } else {
      // Clear favourites when logged out
      setFavourites([]);
      setLoading(false);
    }
  }, [user]);

  // Download rules PDF
  const handleDownloadRule = (fileUrl) => {
    const link = document.createElement("a");
    link.href = fileUrl || "/HouseRule.pdf";
    link.download = fileUrl ? fileUrl.split("/").pop() : "HouseRule.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("HouseRule Downloaded!");
  };

  // Remove favourite
  const handleRemoveFavourite = async (homeId) => {
    if (!user) {
      toast.error("You must be logged in to remove favourites.");
      return;
    }

    try {
      await removeFavourite(homeId, setUserFavourites);
      toast.success("Favourite removed!");
      setFavourites((prev) => prev.filter((home) => home._id !== homeId));
    } catch {
      toast.error("Failed to remove favourite.");
    }
  };

  if (loading || userLoading)
    return (
      <Spinner
        message="Loading your favourites homes..."
        timeoutMessage="Loading favourites is taking longer than usual. Please wait."
      />
    );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-20 bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="pt-24 pb-6 text-4xl font-bold text-center text-gray-800">
        My Favourites
      </h1>

      {favourites.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
          <p className="text-4xl font-stretch-150%">No favourites available.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {favourites.map((home) => (
            <div
              key={home._id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                <img
                  loading="lazy"
                  src={home.photos || "https://via.placeholder.com/400x250"}
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

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleRemoveFavourite(home._id)}
                    disabled={favouriteLoadingIds.includes(home._id)}
                    className={`flex-1 py-2   text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                      favouriteLoadingIds.includes(home._id)
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 cursor-pointer"
                    }`}
                  >
                    {favouriteLoadingIds.includes(home._id)
                      ? "Removing..."
                      : "Remove"}
                  </button>

                  <button
                    onClick={() => handleDownloadRule(home.rulesFile)}
                    className="flex-1 py-2  text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300  hover:scale-105 hover:shadow-2xl bg-green-500 hover:bg-green-600"
                  >
                    Download Rules
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourite;
