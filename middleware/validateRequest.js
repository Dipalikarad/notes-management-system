const { validationResult } = require("express-validator");

// Usage:
// router.post('/register',
//   rules,
//   validateRequest('/register'),
//   controller
// )
module.exports = function validateRequest(redirectUrl) {
  return function (req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    const msg = errors.array().map((e) => e.msg).join(", ");
    req.flash("error", msg);

    const url = typeof redirectUrl === "function" ? redirectUrl(req) : redirectUrl;
    return res.redirect(url || "/");
  };
};

