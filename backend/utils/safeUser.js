// safeUser.js
function buildSafeUser(user) {
  if (!user) return null;
  return {
    _id: user._id,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    email: user.email,
    profilePic: user.profilePic ? `/uploads/${user.profilePic}` : null,
    userType: user.userType,
    city: user.city,
  };
}

// Correct export
module.exports = { buildSafeUser };
