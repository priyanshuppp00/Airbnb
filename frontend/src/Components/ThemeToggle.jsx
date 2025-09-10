import { useContext } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { AppContext } from "../context/AppContext";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useContext(AppContext);

  return (
    <div className="">
      <label className="relative flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          onChange={toggleTheme}
          checked={isDarkMode}
          aria-label="Toggle Dark Mode"
        />

        <div className="relative flex items-center w-12 h-6 p-1 transition duration-300 bg-gray-300 rounded-full md:w-14 md:h-7 dark:bg-gray-700">
          <div
            className={`w-5 h-5 md:w-6 md:h-6 bg-white dark:bg-red-500 rounded-full shadow-md transform transition-all duration-300 ${
              isDarkMode ? "translate-x-6 md:translate-x-7" : "translate-x-0"
            }`}
          ></div>
        </div>

        <div className="flex items-center ml-2 space-x-2">
          {isDarkMode ? (
            <FiMoon className="text-lg text-gray-400 md:text-xl" />
          ) : (
            <FiSun className="text-lg text-yellow-600 md:text-xl" />
          )}
        </div>
      </label>
    </div>
  );
};

export default ThemeToggle;
