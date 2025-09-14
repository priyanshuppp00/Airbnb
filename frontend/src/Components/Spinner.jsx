import React, { useState, useEffect } from "react";

const Spinner = ({
  type = "default", // default | auth | small
  message = "Loading...",
  timeoutMessage = "Taking too long... Please wait.",
  timeoutDelay = 10000, // 10 seconds
}) => {
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeoutMessage(true);
    }, timeoutDelay);

    return () => clearTimeout(timer);
  }, [timeoutDelay]);

  // Style variants based on type
  const color = type === "auth" ? "border-red-500" : "border-red-500";
  const backdrop =
    type === "auth" ? "bg-black/30 backdrop-blur-sm" : "bg-transparent";
  const textSize = type === "auth" ? "text-lg" : "text-xl";

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-50 ${backdrop}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`w-12 h-12 border-4 ${color} border-t-transparent rounded-full animate-spin mb-4`}
        aria-hidden="true"
      ></div>
      <p className={`${textSize} font-medium text-gray-700 animate-pulse`}>
        {showTimeoutMessage ? timeoutMessage : message}
      </p>
      <span className="sr-only">
        {showTimeoutMessage ? timeoutMessage : message}
      </span>
    </div>
  );
};

export default Spinner;
