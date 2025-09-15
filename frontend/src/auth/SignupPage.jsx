import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { authAPI } from "../service/api";
import toast, { Toaster } from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import Spinner from "../Components/Spinner";

const SignupPage = () => {
  const { login } = useContext(UserContext);
  const { showPassword, toggleShowPassword } = useContext(AppContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "guest",
    terms: false,
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "photo" && files[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    validateField(name, value, files);
  };

  const validateField = (name, value, files) => {
    let newErrors = { ...errors };

    switch (name) {
      case "firstName":
        if (!value.trim()) newErrors.firstName = "First name is required.";
        else delete newErrors.firstName;
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value))
          newErrors.email = "Enter a valid email.";
        else delete newErrors.email;
        break;
      case "password":
        if (value.length < 6)
          newErrors.password = "Password must be at least 6 characters.";
        else delete newErrors.password;
        break;
      case "confirmPassword":
        if (value !== form.password)
          newErrors.confirmPassword = "Passwords do not match.";
        else delete newErrors.confirmPassword;
        break;
      case "photo":
        if (files && files[0]?.size > 2 * 1024 * 1024)
          newErrors.photo = "Image must be less than 2MB.";
        else delete newErrors.photo;
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.terms) {
      toast.error("Accept terms and conditions to continue.");
      return;
    }

    if (Object.keys(errors).length > 0) {
      toast.error("Fix validation errors first.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "photo" && value) formData.append("photo", value);
      else formData.append(key, value);
    });

    setLoading(true);
    try {
      const res = await authAPI.signup(formData);
      login(res.data.user);
      toast.success("Signup successful! redirecting for login...");
      navigate("/"); // Redirect to home/dashboard after signup
    } catch (err) {
      const apiErrors = err.response?.data?.errors || [];
      toast.error(apiErrors.length ? apiErrors.join(", ") : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <Toaster position="top-center" />
      {loading && (
        <Spinner
          message="Please wait Registering..."
          timeoutMessage="Registration is taking longer than usual. Please wait."
        />
      )}
      <div
        className={`w-full max-w-md bg-white p-6 rounded-lg shadow-lg ${
          loading ? "filter blur-sm" : ""
        }`}
      >
        <h2 className="mb-6 text-3xl font-bold text-center">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          {errors.firstName && (
            <p className="text-xs text-red-600">{errors.firstName}</p>
          )}

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email}</p>
          )}

          {/* Password with toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password}</p>
          )}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-600">{errors.confirmPassword}</p>
          )}

          <select
            name="userType"
            value={form.userType}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <option value="guest">Guest</option>
            <option value="host">Host</option>
          </select>

          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview"
              className="w-24 h-24 mx-auto mt-2 rounded-full ring-2 ring-red-500 object-cover"
            />
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm text-gray-700">
              I accept the terms and conditions
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:bg-red-700 hover:scale-105 hover:shadow-2xl bg-red-600 cursor-pointer"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-800">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
