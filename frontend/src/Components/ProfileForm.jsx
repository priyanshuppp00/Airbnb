import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";

const ProfileForm = ({
  formData,
  setFormData,
  handleSubmit,
  message,
  setEditMode,
  submitting,
}) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (formData.profilePic && typeof formData.profilePic === "object") {
      const url = URL.createObjectURL(formData.profilePic);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [formData.profilePic]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {["firstName", "middleName", "lastName", "city", "email", "password"].map(
        (field) => (
          <div key={field}>
            <label className="block font-medium mb-1" htmlFor={field}>
              {field === "password"
                ? "New Password (leave blank to keep current)"
                : field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={
                field === "password"
                  ? "password"
                  : field === "email"
                  ? "email"
                  : "text"
              }
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required={field === "firstName" || field === "email"}
              disabled={submitting}
            />
          </div>
        )
      )}

      <div>
        <label className="block font-medium mb-1" htmlFor="profilePic">
          Profile Picture
        </label>
        <input
          type="file"
          id="profilePic"
          name="profilePic"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              profilePic: e.target.files[0],
            }))
          }
          className="w-full border border-gray-300 rounded px-3 py-2"
          accept="image/*"
          disabled={submitting}
        />
        {preview && (
          <img
            src={preview}
            alt="Profile Preview"
            className="w-20 h-20 rounded-full object-cover mt-2 mx-auto"
          />
        )}
      </div>

      <div>
        <label className="block font-medium mb-1" htmlFor="userType">
          User Type
        </label>
        <select
          id="userType"
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          disabled={submitting}
        >
          <option value="guest">Guest</option>
          <option value="host">Host</option>
        </select>
      </div>

      <div className="text-center">
        {submitting ? (
          <Spinner message="Updating profile..." />
        ) : (
          <>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-4 py-2 ml-4 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {message && (
        <p className="mt-4 text-center text-red-600 font-medium">{message}</p>
      )}
    </form>
  );
};

export default ProfileForm;
