import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { hostAPI } from "../service/api";
import Spinner from "../Components/Spinner";

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
    rulesFile: null, // ✅ PDF optional
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [preview, setPreview] = useState({ photo: null });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];

      if (name === "photo") {
        setFormData((prev) => ({ ...prev, photo: file }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview((prev) => ({ ...prev, photo: reader.result }));
        };
        reader.readAsDataURL(file);
      }

      if (name === "rulesFile") {
        if (file && file.type === "application/pdf") {
          setFormData((prev) => ({ ...prev, rulesFile: file }));
        } else {
          toast.error("Only PDF files are allowed for rules.");
          if (rulesInputRef.current) rulesInputRef.current.value = "";
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
    setPreview((prev) => ({ ...prev, photo: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeRulesFile = () => {
    setFormData((prev) => ({ ...prev, rulesFile: null }));
    if (rulesInputRef.current) rulesInputRef.current.value = "";
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

    try {
      await hostAPI.addHome(formData); // ✅ send whole formData (api.js handles FormData)
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
      setPreview({ photo: null });

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
      {isLoading && (
        <Spinner
          message="Adding home..."
          timeoutMessage="Adding home is taking longer than usual. Please wait."
        />
      )}
      <div
        className={`w-full max-w-md bg-white p-6 rounded-lg shadow-lg ${
          isLoading ? "filter blur-sm" : ""
        }`}
      >
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
              House Image <span className="text-red-500">*</span>
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
            {preview.photo && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Preview:
                </p>
                <img
                  src={preview.photo}
                  alt="House Preview"
                  className="w-full h-40 object-cover rounded-lg shadow"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Remove Photo
                </button>
              </div>
            )}
          </div>

          {/* Rules PDF Upload (optional) */}
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
            {formData.rulesFile && (
              <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                <span className="text-gray-700 text-sm">
                  {formData.rulesFile.name}
                </span>
                <button
                  type="button"
                  onClick={removeRulesFile}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-red-500 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:bg-red-600 hover:scale-105 hover:shadow-2xl cursor-pointer"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHome;
