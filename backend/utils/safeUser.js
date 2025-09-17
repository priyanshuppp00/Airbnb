// utils/safeUser.js
exports.buildSafeUser = (user) => {
  if (!user) return null;

  const { password, ...safeUser } = user.toObject();

  // Only set profile pic URL if profilePicFilename exists
  if (safeUser.profilePicFilename) {
    safeUser.profilePicUrl = `${process.env.FRONTEND_URL}/uploads/${safeUser.profilePicFilename}`;
  }

  return safeUser;
};
