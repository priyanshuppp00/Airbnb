import React from "react";
import { Mail, Phone, HelpCircle, User, CalendarCheck } from "lucide-react";

const HelpPage = () => {
  return (
    <main className="container flex flex-col items-center justify-center max-w-3xl min-h-screen p-8 mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="mb-6 text-4xl font-bold text-center text-gray-800">
        Help Center
      </h1>

      <p className="mb-8 text-center text-gray-600">
        Find answers to frequently asked questions and learn how to get in touch
        with us.
      </p>

      <section className="w-full space-y-8 text-gray-700">
        <div>
          <div className="flex items-center mb-2 text-xl font-semibold text-red-500">
            <User className="w-5 h-5 mr-2" /> Account Issues
          </div>
          <p className="ml-7">
            Trouble logging in or signing up? Email us at{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 underline"
            >
              support@example.com
            </a>
            .
          </p>
        </div>

        <div>
          <div className="flex items-center mb-2 text-xl font-semibold text-red-500">
            <CalendarCheck className="w-5 h-5 mr-2" /> Booking Help
          </div>
          <p className="ml-7">
            Need help with bookings, cancellations, or refunds? Visit our{" "}
            <a href="/support" className="text-blue-600 underline">
              Support Center
            </a>{" "}
            or contact us.
          </p>
        </div>

        <div>
          <div className="flex items-center mb-2 text-xl font-semibold text-red-500">
            <Phone className="w-5 h-5 mr-2" /> Contact Us
          </div>
          <p className="ml-7">
            Email:{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 underline"
            >
              support@example.com
            </a>
            <br />
            Phone:{" "}
            <a href="tel:1800247262" className="text-blue-600 underline">
              1-800-AIRBNB
            </a>
          </p>
        </div>
      </section>

      <div className="mt-10">
        <a
          href="mailto:support@example.com"
          className="inline-flex items-center px-6 py-2 text-white transition bg-red-500 rounded-md hover:bg-red-600"
        >
          <Mail className="w-4 h-4 mr-2" /> Contact Support
        </a>
      </div>
    </main>
  );
};

export default HelpPage;
