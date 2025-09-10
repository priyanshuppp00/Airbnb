function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500);
  if (req.accepts("json")) {
    res.json({ error: err.message || "Internal Server Error" });
  } else {
    res.type("txt").send(err.message || "Internal Server Error");
  }
}

module.exports = errorHandler;
