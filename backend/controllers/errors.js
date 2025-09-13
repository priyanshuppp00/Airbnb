exports.pageNotFound = (req, res, next) => {
  res.status(404).json({ error: "Page not found" });
};
