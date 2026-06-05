/**
 * TASK 2 — restrictTo Middleware (Role-Based Access Control)
 *
 * Factory function — call it with the roles you want to allow:
 *   restrictTo('Admin')
 *   restrictTo('Admin', 'Premium_User')
 *
 * MUST be used AFTER protect (needs req.user to be set first)
 *
 * On success  → user's role is in the allowed list → calls next()
 * On failure  → returns 403 Forbidden, route handler never runs
 */
const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        // verifyToken must have run first — if not, something is misconfigured
        if (!req.user) {
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized. Token not verified."
            });
        }
 
        const userRole = req.user.role;
 
        // Check if the user's role is in the allowed list
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                status: "fail",
                message: "Access denied. Insufficient permissions.",
                detail: `This endpoint requires one of: [${allowedRoles.join(', ')}]. Your role: ${userRole}`
            });
        }
 
        // Role is allowed — proceed
        next();
    };
};
 
module.exports = { restrictTo, requireRole: restrictTo };