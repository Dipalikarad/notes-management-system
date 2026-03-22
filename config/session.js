const session = require("express-session");
const { MongoStore } = require("connect-mongo");

function sessionMiddleware() {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error("SESSION_SECRET is missing in environment variables");
  }

  return session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: Number(process.env.SESSION_COOKIE_MAX_AGE_MS || 86400000),
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: Number(process.env.SESSION_TTL_SECONDS || 24 * 60 * 60),
    }),
  });
}

module.exports = { sessionMiddleware };

