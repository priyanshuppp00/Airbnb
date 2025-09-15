import React, { useState, useEffect } from "react";

const Spinner = ({
  type = "default",
  message = "Loading...",
  timeoutMessage = "This is taking longer than usual.",
}) => {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTimeout(true), 7000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Tailwind safe classes
  const colorClass = type === "auth" ? "border-red-500" : "border-red-500";
  const backdropClass = type === "auth" ? "backdrop-blur-sm" : "bg-transparent";
  const textClass = type === "auth" ? "text-red-500" : "text-gray-700";
  const timeoutTextClass = type === "auth" ? "text-white" : "text-gray-500";
  const textSizeClass = type === "auth" ? "text-lg" : "text-xl";

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-50 ${backdropClass}`}
      role="status"
      aria-live="polite"
    >
      {/* Spinner Circle */}
      <div
        className={`w-12 h-12 border-4 ${colorClass} border-t-transparent rounded-full animate-spin mb-4`}
        aria-hidden="true"
      ></div>

      {/* Main Message */}
      <p
        className={`text-center font-medium ${textClass} ${textSizeClass} animate-pulse`}
      >
        {message}
      </p>

      {/* Timeout Message */}
      {showTimeout && (
        <p
          className={`text-center ${timeoutTextClass} ${textSizeClass} mt-2 animate-bounce`}
        >
          {timeoutMessage}
        </p>
      )}
    </div>
  );
};

export default Spinner;
