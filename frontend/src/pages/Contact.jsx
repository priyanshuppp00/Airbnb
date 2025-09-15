import { useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../Components/Spinner";

const Contact = () => {
  const [form, setForm] = useState({
    firstName: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, email, message } = form;

    // Validation
    if (!firstName.trim()) return toast.error("Name is required.");
    if (!/\S+@\S+\.\S+/.test(email.trim()))
      return toast.error("Please enter a valid email address.");
    if (!message.trim()) return toast.error("Message cannot be empty.");

    setLoading(true);

    try {
      // Simulated API call — replace with real API request later
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Message sent successfully!");
      setForm({ firstName: "", email: "", message: "" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <Toaster position="top-center" reverseOrder={false} />
      {loading && (
        <Spinner
          message="Sending message..."
          timeoutMessage="Sending message is taking longer than usual. Please wait."
        />
      )}
      <div
        className={`w-full max-w-md bg-white p-6 rounded-lg shadow-lg ${
          loading ? "filter blur-sm" : ""
        }`}
      >
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
          Contact Us
        </h1>
        <p className="max-w-xl mb-8 text-center text-gray-700">
          Get in touch with us for any inquiries or support.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="Name"
            value={form.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-red-500 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:bg-red-600 hover:scale-105 hover:shadow-2xl cursor-pointer"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Want to book the best homes?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-900 ">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Contact;
