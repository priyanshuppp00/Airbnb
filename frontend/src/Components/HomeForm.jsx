import React, { useState, useEffect, useRef } from "react";

const HomeForm = ({ editing = false, homeData = {}, onSubmit }) => {
  const [form, setForm] = useState({
    houseName: "",
    price: "",
    location: "",
    rating: "",
    description: "",
    photo: null,
    rulesFile: null,
  });

  const fileInputRef = useRef(null);
  const rulesFileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (editing && homeData) {
      setForm({
        houseName: homeData.houseName || "",
        price: homeData.price || "",
        location: homeData.location || "",
        rating: homeData.rating || "",
        description: homeData.description || "",
        photo: null,
        rulesFile: null,
      });
    }
  }, [editing, homeData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];

      if (name === "photo") {
        setForm((prev) => ({ ...prev, photo: file }));
        setPreview(URL.createObjectURL(file));
      }

      if (name === "rulesFile") {
        if (file.type === "application/pdf") {
          setForm((prev) => ({ ...prev, rulesFile: file }));
        } else {
          alert("Only PDF files are allowed for rules.");
          if (rulesFileRef.current) rulesFileRef.current.value = "";
        }
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removePhoto = () => {
    setForm((prev) => ({ ...prev, photo: null }));
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeRulesFile = () => {
    setForm((prev) => ({ ...prev, rulesFile: null }));
    if (rulesFileRef.current) rulesFileRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("houseName", form.houseName);
    fd.append("price", form.price);
    fd.append("location", form.location);
    fd.append("rating", form.rating);
    fd.append("description", form.description);

    if (form.photo) fd.append("photo", form.photo);
    if (form.rulesFile) fd.append("rulesFile", form.rulesFile);

    onSubmit(fd);
  };

  return (
    <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
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
          placeholder="Home Name"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price per night"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          type="number"
          name="rating"
          value={form.rating}
          onChange={handleChange}
          placeholder="Rating (0-5)"
          min="0"
          max="5"
          step="0.1"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={2}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
          required
        />

        {/* Photo Upload */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Upload House Image
          </label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          {preview && (
            <div className="mt-2">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="text-red-500 mt-1"
              >
                Remove Photo
              </button>
            </div>
          )}
        </div>

        {/* Rules PDF Upload */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Upload Rule PDF (Optional)
          </label>
          <input
            type="file"
            name="rulesFile"
            accept="application/pdf"
            ref={rulesFileRef}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          {form.rulesFile && (
            <div className="mt-1 flex items-center justify-between bg-gray-100 p-2 rounded">
              <span>{form.rulesFile.name}</span>
              <button
                type="button"
                onClick={removeRulesFile}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-red-500 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:bg-red-600 hover:scale-105 hover:shadow-2xl cursor-pointer"
        >
          {editing ? "Update Home" : "Add Home"}
        </button>
      </form>
    </div>
  );
};

export default HomeForm;
