const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next){
    const token = req.cookies.token;
    if(!token){
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        res.locals.isAuthenticated = true;
        next();
    } catch (error) {
        // If the token is invalid/expired, clear the cookie to keep the client in sync.
        res.clearCookie("token");
        req.flash && req.flash("error", "Please login again.");
        return res.redirect("/login");
    }
}

module.exports = authMiddleware;