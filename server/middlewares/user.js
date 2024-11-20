const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

function userMiddleware(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            msg: "No token provided",
        });
    }

    try {
        const decodedValue = jwt.verify(token, JWT_SECRET);
        req.user = decodedValue; // Attach decoded token payload to `req.user`
        next();
    } catch (error) {
        console.error("JWT verification failed:", error);
        return res.status(403).json({
            msg: "Invalid or expired token",
        });
    }
}

module.exports = userMiddleware;
