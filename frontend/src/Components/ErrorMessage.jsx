import React from "react";
import { Link } from "react-router-dom";

const ErrorMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50 text-center">
      {/* Animated 404 */}
      <h1 className="text-6xl font-bold text-red-500 mb-4 animate-bounce">
        404
      </h1>

      {/* Illustration */}
      <svg
        className="w-40 h-40 mb-6 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="32"
          cy="32"
          r="30"
          strokeWidth="4"
          className="stroke-current"
        />
        <line
          x1="20"
          y1="20"
          x2="44"
          y2="44"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="44"
          y1="20"
          x2="20"
          y2="44"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      <p className="text-2xl text-gray-700 mb-8">
        Oops! The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:bg-red-600 hover:scale-105 hover:shadow-2xl"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorMessage;
