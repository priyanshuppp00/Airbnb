import { useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Contact = () => {
  const [form, setForm] = useState({
    firstName: "",
    email: "",
    message: "",
    acceptTerms: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!form.firstName.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!form.message.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }
    if (!form.acceptTerms) {
      toast.error("You must accept the terms before submitting.");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully!");
      setLoading(false);
      setForm({
        firstName: "",
        email: "",
        message: "",
        acceptTerms: false,
      });
    }, 1500);
  };

  return (
    <div className="pt-24 flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Toast Notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
          Contact Us
        </h1>
        <p className="max-w-xl mb-8 text-center text-gray-700">
          Get in touch with us for any inquiries or support.
        </p>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          <input
            type="text"
            name="firstName"
            placeholder="Name"
            value={form.firstName}
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

          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
          ></textarea>

          {/* Terms Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={form.acceptTerms}
              onChange={handleChange}
              className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
            />
            <label className="text-sm text-gray-600">
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Terms & Conditions
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Sending message..." : "Send Message"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Book Now Best Houses?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Contact;
