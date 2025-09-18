import React, { useState, useEffect, useRef } from "react";

const HomeForm = ({ editing = false, homeData = {}, onSubmit }) => {
  const [form, setForm] = useState({
    houseName: "",
    price: "",
    location: "",
    rating: "",
    description: "",
    photos: [], // store File objects for new uploads
    existingPhotos: [], // store URLs or filenames of existing photos
    rulesFile: null,
    existingRulesFile: null, // for existing PDF in edit mode
  });

  const fileInputRef = useRef(null);
  const rulesFileRef = useRef(null);

  const [preview, setPreview] = useState([]); // for new uploaded images

  // Initialize form in edit mode
  useEffect(() => {
    if (editing && homeData) {
      setForm({
        houseName: homeData.houseName || "",
        price: homeData.price || "",
        location: homeData.location || "",
        rating: homeData.rating || "",
        description: homeData.description || "",
        photos: [],
        existingPhotos: homeData.photos ? [homeData.photos] : [], // assuming single photo, modify if multiple
        rulesFile: null,
        existingRulesFile: homeData.rulesFile || null,
      });
      if (homeData.photos) setPreview([homeData.photosUrl || homeData.photos]);
    }
  }, [editing, homeData]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      if (name === "photos") {
        const selectedFiles = Array.from(files);
        setForm((prev) => ({
          ...prev,
          photos: [...prev.photos, ...selectedFiles],
        }));
        setPreview((prev) => [
          ...prev,
          ...selectedFiles.map((file) => URL.createObjectURL(file)),
        ]);
      }

      if (name === "rulesFile") {
        const file = files[0];
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

  // Remove uploaded photo (new)
  const removePhoto = (index) => {
    setForm((prev) => {
      const newPhotos = [...prev.photos];
      newPhotos.splice(index - prev.existingPhotos.length, 1); // adjust for existing photos
      return { ...prev, photos: newPhotos };
    });

    setPreview((prev) => {
      const newPreview = [...prev];
      newPreview.splice(index, 1);
      return newPreview;
    });
  };

  // Remove existing photo
  const removeExistingPhoto = (index) => {
    setForm((prev) => {
      const newExisting = [...prev.existingPhotos];
      newExisting.splice(index, 1);
      return { ...prev, existingPhotos: newExisting };
    });

    setPreview((prev) => {
      const newPreview = [...prev];
      newPreview.splice(index, 1);
      return newPreview;
    });
  };

  // Remove rules PDF
  const removeRulesFile = () => {
    setForm((prev) => ({ ...prev, rulesFile: null, existingRulesFile: null }));
    if (rulesFileRef.current) rulesFileRef.current.value = "";
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("houseName", form.houseName);
    fd.append("price", form.price);
    fd.append("location", form.location);
    fd.append("rating", form.rating);
    fd.append("description", form.description);

    // Append new photos
    form.photos?.forEach((photo) => fd.append("photo", photo));

    // Append existing photos if editing
    if (editing && form.existingPhotos?.length > 0) {
      form.existingPhotos.forEach((photo) =>
        fd.append("existingPhotos", photo)
      );
    }

    // Append rules PDF
    if (form.rulesFile) fd.append("rulesFile", form.rulesFile);

    if (editing && form.existingRulesFile) {
      fd.append("existingRulesFile", form.existingRulesFile);
    }

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
            Upload House Images
          </label>
          <input
            type="file"
            name="photos"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          {preview && preview.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {preview.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (index < form.existingPhotos.length) {
                        removeExistingPhoto(index);
                      } else {
                        removePhoto(index);
                      }
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
              ))}
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
          {(form.rulesFile || form.existingRulesFile) && (
            <div className="mt-1 flex items-center justify-between bg-gray-100 p-2 rounded">
              <span>
                {(form.rulesFile || form.existingRulesFile)?.name ||
                  "Existing PDF"}
              </span>
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
