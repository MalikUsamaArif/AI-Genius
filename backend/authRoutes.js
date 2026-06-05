const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
 
// ─── TASK 1 ───────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Public — no token needed
router.post('/login', authController.login);
 
// ─── TASK 3 ───────────────────────────────────────────────────────────────────
// POST /api/auth/refresh
// Public — uses httpOnly cookie automatically, no Authorization header needed
router.post('/refresh', authController.refresh);
 
// POST /api/auth/logout
// Protected — protect runs first so req.token is available to blacklist
router.post('/logout', protect, authController.logout);
 
module.exports = router;