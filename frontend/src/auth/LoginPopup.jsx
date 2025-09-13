import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPopup = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => setIsVisible(true), []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleLoginNow = () => navigate("/login");
  const handleSignupNow = () => navigate("/signup");

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      } bg-black bg-opacity-50`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg p-6 max-w-md w-full text-center shadow-lg transform transition-transform duration-300 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Login Required</h2>
        <p className="mb-6">
          Please login or signup first to add booking or favourite.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleLoginNow}
            className="px-4 py-2 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:bg-red-700 hover:scale-105 hover:shadow-2xl bg-red-600 cursor-pointer"
          >
            Login Now
          </button>
          <button
            onClick={handleSignupNow}
            className="px-4 py-2 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:bg-green-700 hover:scale-105 hover:shadow-2xl bg-green-600 cursor-pointer"
          >
            Signup Now
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
