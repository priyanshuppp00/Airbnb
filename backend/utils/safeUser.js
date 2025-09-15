// utils/safeUser.js
exports.buildSafeUser = (user) => {
  if (!user) return null;

  const { password, ...safeUser } = user.toObject();

  // Only set profile pic URL if profilePic exists
  if (safeUser.profilePic) {
    safeUser.profilePic = `${process.env.FRONTEND_URL}/api/auth/profile-pic/${safeUser._id}`;
  }

  return safeUser;
};
