export const buildSafeUser = (user) => {
  if (!user) return null;

  const { password: _password, ...safeUser } = user;

  // Ensure profilePic is a string URL
  safeUser.profilePic = safeUser.profilePic || null;

  // Fallback: if no name, show part of email
  if (!safeUser.firstName && !safeUser.lastName) {
    safeUser.firstName = safeUser.email.split("@")[0];
  }

  return safeUser;
};
