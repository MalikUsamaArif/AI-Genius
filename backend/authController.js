const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { users, tokenBlacklist } = require('../config/db');
 
// ─────────────────────────────────────────────────────────────────────────────
// TASK 1 — POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
 
        // 1. Validate inputs exist
        if (!email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide both email and password"
            });
        }
 
        // 2. Find user (case-insensitive email match)
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid credentials" // Same msg for wrong email & password — no user enumeration
            });
        }
 
        // 3. Compare password against bcrypt hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid credentials"
            });
        }
 
        // 4. Generate short-lived Access Token (15 min)
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
        );
 
        // 5. Generate long-lived Refresh Token (7 days)
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
        );
 
        // 6. Store Refresh Token in a secure httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,                      // JS cannot read this cookie
            secure: false,                       // true in production (HTTPS only)
            sameSite: 'strict',                  // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000     // 7 days in ms
        });
 
        // 7. Return Access Token in JSON body
        return res.status(200).json({
            status: "success",
            accessToken,
            user: { id: user.id, email: user.email, role: user.role }
        });
 
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });
    }
};
 
// ─────────────────────────────────────────────────────────────────────────────
// TASK 3 — POST /api/auth/refresh
//
// The client sends NO body and NO Authorization header.
// The refreshToken cookie is sent automatically by the browser.
// On success → a brand new Access Token is returned in the JSON body.
// ─────────────────────────────────────────────────────────────────────────────
exports.refresh = (req, res) => {
    // 1. Read the refreshToken from the httpOnly cookie
    const refreshToken = req.cookies?.refreshToken;
 
    if (!refreshToken) {
        return res.status(401).json({
            status: "fail",
            message: "No refresh token found. Please login again."
        });
    }
 
    // 2. Check if this refresh token has been invalidated (user logged out)
    if (tokenBlacklist.has(refreshToken)) {
        return res.status(401).json({
            status: "fail",
            message: "Refresh token has been revoked. Please login again."
        });
    }
 
    // 3. Verify the refresh token using JWT_REFRESH_SECRET
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
 
        // 4. Look up the user — they may have been deleted since the token was issued
        const user = users.find(u => u.id === decoded.id);
        if (!user) {
            return res.status(401).json({
                status: "fail",
                message: "User no longer exists."
            });
        }
 
        // 5. Issue a brand new Access Token
        const newAccessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
        );
 
        // 6. Return the new Access Token
        return res.status(200).json({
            status: "success",
            accessToken: newAccessToken,
            message: "Access token refreshed successfully"
        });
 
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: "fail",
                message: "Refresh token has expired. Please login again.",
                code: "REFRESH_TOKEN_EXPIRED"
            });
        }
        return res.status(401).json({
            status: "fail",
            message: "Invalid refresh token.",
            error: err.message
        });
    }
};
 
// ─────────────────────────────────────────────────────────────────────────────
// TASK 3 — POST /api/auth/logout
//
// Clears the httpOnly cookie AND blacklists the access token
// so it cannot be used even if it hasn't expired yet.
// ─────────────────────────────────────────────────────────────────────────────
exports.logout = (req, res) => {
    // 1. Read the refresh token from the cookie (to blacklist it)
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
        tokenBlacklist.add(refreshToken); // Invalidate refresh token
    }
 
    // 2. Blacklist the current access token too (from Authorization header)
    //    verifyToken middleware attaches it as req.token
    if (req.token) {
        tokenBlacklist.add(req.token);
    }
 
    // 3. Clear the httpOnly cookie from the client
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict'
    });
 
    return res.status(200).json({
        status: "success",
        message: "Logged out successfully. Tokens have been revoked."
    });
};
 