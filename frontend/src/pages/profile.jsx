import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { authAPI } from "../service/api";
import ProfileForm from "../Components/ProfileForm";
import { Toaster } from "react-hot-toast";
import _ from "lodash"; // ✅ Import lodash
import Spinner from "../Components/Spinner";

const Profile = () => {
  const { user, loading, fetchUser, login } = useContext(UserContext);
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
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await authAPI.updateProfile(formData);
      setMessage(response.data.message);
      setEditMode(false);
      // Use the returned updated user to update context
      if (response.data.user) {
        login(response.data.user);
      } else {
        await fetchUser();
      }
      // Keep the message visible for 3 seconds after update
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner message="Loading user profile..." />;
  if (!user) return <div>Please log in to view your profile.</div>;

  // Fallback for profilePic and initials
  // const profilePicUrl = user.profilePic
  //   ? `${
  //       import.meta.env.VITE_BACKEND_URL || "http://localhost:8080"
  //     }/api/auth/profile-pic/${user._id}?t=${Date.now()}`
  //   : `https://ui-avatars.com/api/?name=${
  //       user.firstName || user.lastName || user.email.split("@")[0]
  //   }&background=E5E7EB&color=111827`;

  const profilePicUrl = user?.profilePic
    ? user.profilePic
    : user
    ? `https://ui-avatars.com/api/?name=${user.firstName || "User"}+${
        user.lastName || ""
      }&background=E5E7EB&color=111827`
    : `https://api.dicebear.com/7.x/bottts/svg?seed=random${Math.floor(
        Math.random() * 10000
      )}`;

  return (
    <div className="pt-20 flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="mb-2 text-3xl font-bold text-center text-gray-800">
          Edit Profile
        </h2>
        {!editMode ? (
          <>
            <div className="flex flex-col items-center">
              <img
                src={profilePicUrl}
                alt="Profile"
                className="w-40 h-40 rounded-full mb-4 object-cover"
              />
              <h2 className="text-xl font-semibold text-gray-800">
                {user.firstName} {user.middleName} {user.lastName}
              </h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>

            <div className="mt-6 space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">City:</span>
                <span>
                  {user.city
                    ? _.startCase(_.toLower(user.city))
                    : "Not specified"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">User Type:</span>
                <span>{_.startCase(user.userType)}</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setEditMode(true)}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:bg-red-600 hover:scale-105 hover:shadow-2xl cursor-pointer"
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
          <ProfileForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            message={message}
            setEditMode={setEditMode}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
