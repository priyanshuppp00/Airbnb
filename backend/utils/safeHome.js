// utils/safeHome.js

const buildSafeHome = (home, req) => {
  return {
    _id: home._id,
    houseName: home.houseName,
    price: home.price,
    location: home.location,
    rating: home.rating,
    description: home.description,
    photos: home.photos ? `/uploads/${home.photos}` : null,
    houseRulePdf: home.houseRulePdf ? `/uploads/${home.houseRulePdf}` : null,
  };
};

module.exports = { buildSafeHome };
