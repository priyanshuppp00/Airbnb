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

  useEffect(() => {
    fetch(`/api/store/homes/${homeId}`, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setHomeData(data))
      .catch(() => setError("Failed to fetch home data."))
      .finally(() => setLoading(false));
  }, [homeId]);

  const handleSubmit = (formData) => {
    hostAPI
      .editHome(homeId, formData)
      .then(() => {
        toast.success("Home updated successfully!");
        setTimeout(() => navigate("/host-homes"), 2000);
      })
      .catch(() => toast.error("Failed to update home."));
  };

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="pt-24 flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />
      <HomeForm editing={true} homeData={homeData} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditHome;
