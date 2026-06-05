const express = require('express');
const router = express.Router();
 
const { protect }      = require('../middleware/authMiddleware');
const { restrictTo }   = require('../middleware/roleMiddleware');
const protectedCtrl    = require('../controllers/protectedController');
 
/**
 * TASK 2 — Protected Routes
 *
 * Every route below requires a valid Bearer token.
 * Some routes additionally require a specific role.
 *
 * Middleware order matters:
 *   protect  →  restrictTo(...)  →  controller
 */
 
// ─── GET /api/protected/dashboard ────────────────────────────────────────────
// Access: ALL authenticated users (Admin, Premium_User, Free_User)
router.get(
    '/dashboard',
    protect,
    protectedCtrl.getDashboard
);
 
// ─── GET /api/protected/scans ─────────────────────────────────────────────────
// Access: Premium_User + Admin only
// Free_User gets 403 Forbidden
router.get(
    '/scans',
    protect,
    restrictTo('Admin', 'Premium_User'),
    protectedCtrl.getPremiumScans
);
 
// ─── GET /api/protected/admin-panel ──────────────────────────────────────────
// Access: Admin only
// Premium_User and Free_User both get 403 Forbidden
router.get(
    '/admin-panel',
    protect,
    restrictTo('Admin'),
    protectedCtrl.getAdminPanel
);
 
module.exports = router;
