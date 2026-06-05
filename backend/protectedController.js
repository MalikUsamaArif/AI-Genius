/**
 * TASK 2 — Protected Route Controllers (AI-Genius themed)
 *
 * Three protected endpoints demonstrating role-based access:
 *  1. GET /api/protected/dashboard   → any authenticated user
 *  2. GET /api/protected/scans       → Premium_User + Admin
 *  3. GET /api/protected/admin-panel → Admin only
 */
 
// ─── Route 1: All authenticated users ────────────────────────────────────────
// GET /api/protected/dashboard
exports.getDashboard = (req, res) => {
    // req.user is set by protect middleware
    const { id, email, role } = req.user;
 
    return res.status(200).json({
        status: "success",
        message: "Welcome to your AI-Genius Dashboard",
        data: {
            user: { id, email, role },
            features: getFeaturesByRole(role),
            generationsRemaining: role === 'Free_User' ? 10 : 'Unlimited',
            serverTime: new Date().toISOString()
        }
    });
};
 
// ─── Route 2: Premium + Admin only ───────────────────────────────────────────
// GET /api/protected/scans
exports.getPremiumScans = (req, res) => {
    const { email, role } = req.user;
 
    return res.status(200).json({
        status: "success",
        message: "Premium generation data accessed successfully",
        data: {
            accessedBy: email,
            role,
            generations: [
                {
                    id: "GEN-2026-0891",
                    type: "Image Generation",
                    uploadedAt: "2026-06-05T08:30:00Z",
                    aiResult: "Hyper-detailed synthwave astronaut on Mars",
                    status: "Completed",
                    credits: 5
                },
                {
                    id: "GEN-2026-1204",
                    type: "Text Generation",
                    uploadedAt: "2026-06-05T05:10:00Z",
                    aiResult: "SaaS landing page copy for marketing campaign",
                    status: "Completed",
                    credits: 1
                },
                {
                    id: "GEN-2026-0887",
                    type: "Image Generation",
                    uploadedAt: "2026-06-04T14:22:00Z",
                    aiResult: "Isometric 3D icon set for mobile application",
                    status: "Completed",
                    credits: 5
                }
            ]
        }
    });
};
 
// ─── Route 3: Admin only ──────────────────────────────────────────────────────
// GET /api/protected/admin-panel
exports.getAdminPanel = (req, res) => {
    const { email } = req.user;
 
    return res.status(200).json({
        status: "success",
        message: "Admin panel data retrieved",
        data: {
            accessedBy: email,
            systemStats: {
                totalUsers: 3,
                activeToday: 3,
                totalGenerationsProcessed: 12847,
                avgResponseTimeMs: 420,
                modelAccuracy: 98.3,
                storageUsedGB: 47.2
            },
            users: [
                { id: "1", email: "admin@ai-genius.com",   role: "Admin",        lastLogin: new Date().toISOString() },
                { id: "2", email: "premium@ai-genius.com", role: "Premium_User", lastLogin: new Date(Date.now() - 7200000).toISOString() },
                { id: "3", email: "free@ai-genius.com",    role: "Free_User",    lastLogin: new Date(Date.now() - 86400000).toISOString() }
            ],
            recentAuditLogs: [
                { event: "LOGIN",           user: "admin@ai-genius.com",   timestamp: new Date().toISOString() },
                { event: "GEN_REQUEST",     user: "premium@ai-genius.com", timestamp: new Date(Date.now() - 1800000).toISOString() },
                { event: "TOKEN_REFRESHED", user: "free@ai-genius.com",    timestamp: new Date(Date.now() - 3600000).toISOString() }
            ]
        }
    });
};
 
// ─── Helper: role-based feature list ─────────────────────────────────────────
const getFeaturesByRole = (role) => {
    const base = ['View Dashboard', 'Free Text Generation (10/day)', 'Basic Reports'];
    const premium = [...base, 'Unlimited Text Generation', 'Image Generation', 'API Access', 'Priority Queue', 'HD Image Export'];
    const admin = [...premium, 'User Management', 'System Analytics', 'Audit Logs', 'Model Retraining', 'Cache Management'];
 
    if (role === 'Admin')        return admin;
    if (role === 'Premium_User') return premium;
    return base;
};
