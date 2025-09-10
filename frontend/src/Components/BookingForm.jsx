import React, { useState, useEffect } from "react";

const BookingForm = ({ home, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    checkInDate: "",
    checkOutDate: "",
    guests: 1,
    specialRequests: "",
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        homeId: home._id,
        ...formData,
      });
      onClose();
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Allow closing modal with ESC key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // close on outside click
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Book {home.houseName}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name:
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Check-in Date */}
          <div>
            <label
              htmlFor="checkInDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Check-in Date
            </label>
            <input
              id="checkInDate"
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              required
              disabled={loading}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Check-out Date */}
          <div>
            <label
              htmlFor="checkOutDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Check-out Date
            </label>
            <input
              id="checkOutDate"
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
              required
              disabled={loading}
              min={
                formData.checkInDate || new Date().toISOString().split("T")[0]
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Guests */}
          <div>
            <label
              htmlFor="guests"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Number of Guests
            </label>
            <input
              id="guests"
              type="number"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              min="1"
              max="10"
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Special Requests */}
          <div>
            <label
              htmlFor="specialRequests"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Special Requests (Optional)
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows="3"
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50"
              placeholder="Any special requests or notes..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md 
                         text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Booking..." : "Book Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
