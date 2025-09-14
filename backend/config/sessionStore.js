const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24 * 7, // 7 days (must match cookie maxAge)
});

module.exports = store;
