import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const SignupPage = () => {
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
  const [success, setSuccess] = useState("");
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

    // ✅ Validate as user types
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
        else if (!/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(value))
          newErrors.password = "Must include uppercase, number & special char.";
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
    setSuccess("");

    // Final validation before submit
    if (!form.terms) {
      setErrors((prev) => ({
        ...prev,
        terms: "You must accept the terms and conditions.",
      }));
      return;
    }

    if (Object.keys(errors).length > 0) return; // stop if any errors

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "photo" && value) {
        formData.append("photo", value);
      } else if (key === "terms") {
        formData.append("terms", value ? "on" : "off");
      } else {
        formData.append(key, value);
      }
    });

    setLoading(true);
    try {
      await axios.post("/api/auth/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setErrors({
        general:
          "Signup failed: " +
          (error.response?.data?.message || "Unknown error"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
          Sign Up
        </h1>

        {errors.general && (
          <p className="bg-red-500 mb-4 text-sm p-2 text-white text-center font-semibold">
            {errors.general}
          </p>
        )}
        {success && (
          <p className="bg-green-500 mb-4 text-sm text-gray-100 p-2 text-center font-semibold">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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
          </div>

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
          />

          <div>
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
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <select
            name="userType"
            value={form.userType}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <option value="guest">Guest</option>
            <option value="host">Host</option>
          </select>

          <div>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.photo && (
              <p className="text-xs text-red-600">{errors.photo}</p>
            )}
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="object-cover w-24 h-24 mx-auto mt-2 rounded-full ring-2 ring-red-500"
              />
            )}
          </div>

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
          {errors.terms && (
            <p className="text-xs text-red-600">{errors.terms}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
