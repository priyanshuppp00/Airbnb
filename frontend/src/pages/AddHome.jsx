import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const AddHome = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const rulesInputRef = useRef(null);

  const [formData, setFormData] = useState({
    houseName: "",
    price: "",
    location: "",
    rating: "",
    description: "",
    photo: null,
    rulesFile: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (Number(formData.rating) > 5) {
      setErrorMessage("Rating cannot be more than 5.");
      setIsLoading(false);
      return;
    }
    if (Number(formData.price) <= 0) {
      setErrorMessage("Price must be greater than 0.");
      setIsLoading(false);
      return;
    }

    const data = new FormData();
    data.append("houseName", formData.houseName);
    data.append("price", Number(formData.price));
    data.append("location", formData.location);
    data.append("rating", Number(formData.rating));
    data.append("description", formData.description);
    if (formData.photo) data.append("photo", formData.photo);
    if (formData.rulesFile) data.append("rulesFile", formData.rulesFile);

    try {
      await axios.post("/api/host/homes", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Home added successfully!");
      setFormData({
        houseName: "",
        price: "",
        location: "",
        rating: "",
        description: "",
        photo: null,
        rulesFile: null,
      });

      // reset file inputs
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (rulesInputRef.current) rulesInputRef.current.value = "";

      navigate("/");
    } catch (error) {
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Something went wrong while adding the home.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20 flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="mb-2 text-3xl font-bold text-center text-gray-800">
          Add Home
        </h2>
        <p className="max-w-xl mb-2 text-center text-gray-700">
          Add a new home listing to host on Airbnb.
        </p>

        <form
          className="space-y-4"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <input
            type="text"
            name="houseName"
            placeholder="Home Name"
            value={formData.houseName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          <input
            type="number"
            name="rating"
            placeholder="Rating (0 - 5)"
            value={formData.rating}
            onChange={handleChange}
            min="0"
            max="5"
            step="0.1"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none"
          />

          {/* Photo Upload */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              House Image
            </label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* Rules PDF Upload */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Rules (PDF) <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="file"
              name="rulesFile"
              accept="application/pdf"
              ref={rulesInputRef}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHome;
