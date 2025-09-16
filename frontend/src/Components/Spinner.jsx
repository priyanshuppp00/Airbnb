import React, { useState, useEffect } from "react";

const Spinner = ({
  type = "default",
  message = "Loading...",
  timeoutMessage = "This is taking longer than usual.",
  progress,
  isFailed = false,
  onRetry,
}) => {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    if (!isFailed) {
      const timer = setTimeout(() => setShowTimeout(true), 7000);
      return () => clearTimeout(timer);
    }
  }, [isFailed]);

  // ✅ Tailwind safe classes
  const colorClass = type === "auth" ? "border-red-500" : "border-red-500";
  const backdropClass = type === "auth" ? "backdrop-blur-sm" : "bg-transparent";
  const textClass = type === "auth" ? "text-red-500" : "text-black";
  const timeoutTextClass = type === "auth" ? "text-white" : "text-gray-500";
  const textSizeClass = type === "auth" ? "text-lg" : "text-xl";

  const displayMessage =
    progress !== undefined ? `${message} ${progress}%` : message;

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-50 ${backdropClass}`}
      role="status"
      aria-live="polite"
    >
      {!isFailed ? (
        <>
          {/* Spinner Circle */}
          <div
            className={`w-12 h-12 border-4 ${colorClass} border-t-transparent rounded-full animate-spin mb-4`}
            aria-hidden="true"
          ></div>

          {/* Main Message */}
          <p
            className={`text-center font-medium ${textClass} ${textSizeClass} animate-pulse`}
          >
            {displayMessage}
          </p>

          {/* Timeout Message */}
          {showTimeout && (
            <p
              className={`text-center ${timeoutTextClass} ${textSizeClass} mt-2 animate-bounce`}
            >
              {timeoutMessage}
            </p>
          )}
        </>
      ) : (
        <>
          {/* Failure Message */}
          <p
            className={`text-center font-medium ${textClass} ${textSizeClass} mb-4`}
          >
            Failed to load data. Please try again.
          </p>

          {/* Retry Button */}
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Retry
          </button>
        </>
      )}
    </div>
  );
};

export default Spinner;
