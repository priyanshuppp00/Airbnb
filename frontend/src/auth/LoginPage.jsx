import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { UserContext } from "../context/UserContext";
import { authAPI } from "../service/api";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../Components/Spinner";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { showPassword, toggleShowPassword } = useContext(AppContext);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.user);

      toast.success("Login successful!");
      // Trigger global refresh of user data after login
      if (typeof window !== "undefined" && window.dispatchEvent) {
        window.dispatchEvent(new Event("userLoggedIn"));
      }
      navigate("/");
    } catch (err) {
      const errors = err.response?.data?.errors || [];
      if (errors.includes("User does not exist")) {
        toast.error(
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-sm font-medium text-center sm:text-left">
              User does not exist.
            </span>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  toast.dismiss();
                  navigate("/signup");
                }}
                className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-md shadow-sm 
                   hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 
                   transition text-center"
              >
                Register
              </button>
              <button
                onClick={() => toast.dismiss()}
                className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-md shadow-sm 
                   hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 
                   transition text-center"
              >
                Cancel
              </button>
            </div>
          </div>,
          { autoClose: false } // 🔥 stays open until user clicks
        );
      } else if (errors.includes("Invalid Password")) {
        toast.error("Invalid password. Please try again.");
      } else {
        const message =
          err.response?.data?.message || "Login failed. Please try again.";
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <Toaster position="top-center" reverseOrder={false} />
      {loading && (
        <Spinner
          type="auth"
          message="Please wait logging in..."
          timeoutMessage="Login is taking longer than usual. Please wait."
        />
      )}
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link to="/login" className="text-blue-400 hover:text-blue-800">
              Forgot Password?
            </Link>
            <Link to="/signup" className="text-blue-400 hover:text-blue-800">
              Sign Up
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-red-500 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:bg-red-600 hover:scale-105 hover:shadow-2xl cursor-pointer"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
