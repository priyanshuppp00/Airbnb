// safeUser.js
function buildSafeUser(user) {
  if (!user) return null;
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profilePic: user.profilePic,
    userType: user.userType,
  };
}

// Correct export
module.exports = { buildSafeUser };
