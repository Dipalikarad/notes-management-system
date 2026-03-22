// Centralized Express error handling.
// Renders EJS error pages instead of crashing the server.
function notProductionStatus(err) {
  // Avoid leaking stack traces in production.
  return process.env.NODE_ENV === "production" ? undefined : err;
}

module.exports = function errorMiddleware(err, req, res, next) {
  // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || err.status || 500;

  if (statusCode === 404) {
    return res.status(404).render("errors/404", { message: err.message || "Page not found" });
  }

  // Handle common Mongo/Mongoose duplicate key errors (e.g., unique email).
  if (err && err.code === 11000) {
    return res.status(400).render("errors/500", { message: "Duplicate value. Please try again." });
  }

  // Provide message in development; hide details in production.
  const message = err.message || "Internal Server Error";
  return res
    .status(statusCode)
    .render("errors/500", { message, error: notProductionStatus(err) });
};

