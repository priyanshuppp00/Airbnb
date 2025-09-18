export const buildSafeUser = (user) => {
  if (!user) return null;
  const { password: _password, ...safeUser } = user;
  safeUser.profilePic = safeUser.profilePic || null;
  if (!safeUser.firstName && !safeUser.lastName) {
    safeUser.firstName = safeUser.email.split("@")[0];
  }
  return safeUser;
};
