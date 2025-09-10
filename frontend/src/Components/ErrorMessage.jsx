import React from "react";
import { Link } from "react-router-dom";

const ErrorMessage = () => {
  return (
    <div className="pt-24 flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 ">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">
          404 - Page Not Found
        </h2>
        <p className="text-lg mb-6">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="w-full py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition disabled:opacity-50 text-center block"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorMessage;
