import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HomeForm from "../Components/HomeForm";
import Spinner from "../Components/Spinner";
import { hostAPI } from "../service/api";
import toast, { Toaster } from "react-hot-toast";

const EditHome = () => {
  const { homeId } = useParams();
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch home data from the backend using API
  useEffect(() => {
    const fetchHome = async () => {
      try {
        const response = await hostAPI.getHostHomes(); // or hostAPI.getHostHomeById(homeId) if available
        const home = response.data.find((h) => h._id === homeId); // filter by ID
        if (!home) throw new Error("Home not found");
        setHomeData(home);
      } catch {
        setError("Failed to fetch home data.");
      } finally {
        setLoading(false);
      }
    };
    fetchHome();
  }, [homeId]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      await hostAPI.editHome(homeId, formData); // FormData with photo and/or PDF
      toast.success("Home updated successfully!");
      navigate("/host-homes");
    } catch (err) {
      // Show backend error if exists
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Failed to update home. Make sure file types are correct.");
      }
    }
  };

  if (loading)
    return (
      <Spinner
        message="Loading your home details..."
        timeoutMessage="Loading home details is taking longer than usual. Please wait."
      />
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="pt-24 flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />
      <HomeForm editing={true} homeData={homeData} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditHome;
