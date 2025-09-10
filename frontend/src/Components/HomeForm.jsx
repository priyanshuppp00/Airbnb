import React, { useState, useEffect } from "react";

const HomeForm = ({ editing = false, homeData = {}, onSubmit }) => {
  const [form, setForm] = useState({
    houseName: "",
    price: "",
    location: "",
    rating: "",
    description: "",
    photo: null,
  });

  useEffect(() => {
    if (editing && homeData) {
      setForm({
        houseName: homeData.houseName || "",
        price: homeData.price || "",
        location: homeData.location || "",
        rating: homeData.rating || "",
        description: homeData.description || "",
        photo: null,
      });
    }
  }, [editing, homeData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setForm((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <main className="container max-w-md p-8 mx-auto mt-8 bg-white rounded-lg shadow-md">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
        {editing ? "Edit" : "Register"} Your Home on AirBnB
      </h1>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-4"
      >
        <input
          type="text"
          name="houseName"
          value={form.houseName}
          onChange={handleChange}
          placeholder="Enter your House Name"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price Per Night"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          type="number"
          name="rating"
          value={form.rating}
          onChange={handleChange}
          placeholder="Rating"
          min="1"
          max="5"
          step="0.1"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="file"
          name="photo"
          accept="image/jpg, image/jpeg, image/png"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          // required={!editing} // maybe required if adding new
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe your home"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={4}
          required
        />
        <button
          type="submit"
          className="w-full py-2 text-white transition duration-300 bg-red-500 rounded-md hover:bg-red-600 cursor-pointer"
        >
          {editing ? "Update Home" : "Add Home"}
        </button>
      </form>
    </main>
  );
};

export default HomeForm;
