const jwt = require('jsonwebtoken');
const { tokenBlacklist } = require('../config/db');
 
/**
 * TASK 2 — protect Middleware
 *
 * Protects any route it is applied to.
 * Expects:  Authorization: Bearer <accessToken>
 *
 * On success → attaches decoded payload to req.user and calls next()
 * On failure → returns 401 immediately, route handler is never reached
 */
const protect = (req, res, next) => {
    // 1. Extract the Authorization header
    const authHeader = req.headers['authorization'];
 
    // 2. Header must exist and start with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: "fail",
            message: "Access denied. No token provided."
        });
    }
 
    // 3. Split out the token string after "Bearer "
    const token = authHeader.split(' ')[1];
 
    // 4. Check if this token was invalidated (logged out)
    if (tokenBlacklist.has(token)) {
        return res.status(401).json({
            status: "fail",
            message: "Token has been invalidated. Please login again."
        });
    }
 
    // 5. Verify the token signature and expiry using JWT_SECRET
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
        // 6. Attach decoded payload { id, email, role, iat, exp } to request
        req.user = decoded;
 
        // 7. Also store raw token so logout can blacklist it
        req.token = token;
 
        next(); // Pass control to the route handler
    } catch (err) {
        // jwt.verify throws specific errors — handle each clearly
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: "fail",
                message: "Access token has expired. Please refresh your token.",
                code: "TOKEN_EXPIRED"
            });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: "fail",
                message: "Invalid token. Please login again.",
                code: "TOKEN_INVALID"
            });
        }
        return res.status(401).json({
            status: "fail",
            message: "Token verification failed.",
            error: err.message
        });
    }
};
 
module.exports = { protect, verifyToken: protect };