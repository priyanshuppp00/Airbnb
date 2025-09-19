// utils/safeHome.js

const buildSafeHome = (home, req) => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const baseUrl = isDevelopment
    ? ""
    : process.env.NODE_ENV === "production"
    ? `${req.protocol}://${req.get("host")}`
    : process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;

  return {
    _id: home._id,
    houseName: home.houseName,
    price: home.price,
    location: home.location,
    rating: home.rating,
    description: home.description,
    photos: home.photos ? `${baseUrl}/uploads/${home.photos}` : null,
    houseRulePdf: home.houseRulePdf
      ? `${baseUrl}/uploads/${home.houseRulePdf}`
      : null,
  };
};

module.exports = { buildSafeHome };
