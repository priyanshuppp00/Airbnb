import React from "react";

const Spinner = () => {
  return (
     <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-xl font-medium text-gray-600 animate-pulse">
        Loading homes...
      </p>
    </div>
  );
};

export default Spinner;
