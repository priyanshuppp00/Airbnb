import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { authAPI } from "../service/api";

const Profile = () => {
  const { user, loading, fetchUser } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    userType: "",
    city: "",
    password: "",
    profilePic: null,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        userType: user.userType || "",
        city: user.city || "",
        profilePic: user.profilePic || null,
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.updateProfile(formData);
      setMessage(response.data.message);
      setEditMode(false);
      await fetchUser(); // Refresh user data in context
    } catch {
      setMessage("Failed to update profile");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
        {!editMode ? (
          <>
            <div className="flex flex-col items-center">
              <img
                src={
                  user.profilePic
                    ? `/${user.profilePic.replace(/\\/g, "/")}`
                    : `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=E5E7EB&color=111827`
                }
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
              <h2 className="text-xl font-semibold text-gray-800">
                {user.firstName} {user.middleName} {user.lastName}
              </h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>

            <div className="mt-6 space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">City:</span>
                <span>{user.city || "Not specified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">User Type:</span>
                <span>{user.userType}</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setEditMode(true)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Edit Profile
              </button>
            </div>
            {message && (
              <p className="mt-4 text-center text-green-600 font-medium">
                {message}
              </p>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1" htmlFor="firstName">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="middleName">
                Middle Name
              </label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="lastName">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="city">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="password">
                New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
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
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
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
              >
                <option value="guest">Guest</option>
                <option value="host">Host</option>
              </select>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="ml-4 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
            {message && (
              <p className="mt-4 text-center text-red-600 font-medium">
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
