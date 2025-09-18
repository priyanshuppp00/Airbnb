import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { storeAPI, hostAPI } from "../service/api";
import toast, { Toaster } from "react-hot-toast";

const HostHomes = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchHomes = () => {
    setLoading(true);
    storeAPI
      .getHomes()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setHomes(res.data);
        } else if (res.data && Array.isArray(res.data.homes)) {
          setHomes(res.data.homes);
        } else {
          setHomes([]);
          setError("Invalid data received.");
        }
      })
      .catch(() => {
        setHomes([]);
        setError("Failed to fetch homes.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHomes();
  }, []);

  const handleEdit = (homeId) => {
    navigate(`/host/edit-home/${homeId}?editing=true`);
  };

  const handleDelete = (homeId) => {
    if (window.confirm("Are you sure you want to delete this home?")) {
      hostAPI
        .deleteHome(homeId)
        .then(() => {
          toast.success("Home deleted successfully!");
          fetchHomes(); // refresh homes
        })
        .catch((error) => {
          console.error("Delete failed:", error);
          alert("Failed to delete home.");
        });
    }
  };

  if (loading)
    return (
      <Spinner
        message="Loading your homes..."
        timeoutMessage="Loading your homes is taking longer than usual. Please wait."
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
                    src={home.photos || "https://via.placeholder.com/400x250"}
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
                      ₹{home.price}
                      <span className="text-sm font-normal text-gray-600">
                        {" "}
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
                    <button
                      onClick={() => handleEdit(home._id)}
                      className="flex-1 py-2 rounded text-white font-medium bg-blue-500 hover:bg-blue-600 transition cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(home._id)}
                      className="flex-1 py-2 rounded text-white font-medium bg-red-600 hover:bg-red-700 transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HostHomes;
