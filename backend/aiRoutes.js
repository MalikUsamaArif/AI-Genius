const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// ─── TASK 4 — Role-Based AI Endpoints ─────────────────────────────────────────

// GET /api/ai/free-model
// Access: ALL authenticated users (Free_User, Premium_User, Admin)
router.get('/free-model', protect, aiController.freeModel);

// POST /api/ai/premium-model
// Access: Premium_User + Admin only
router.post('/premium-model', protect, restrictTo('Admin', 'Premium_User'), aiController.premiumModel);

// DELETE /api/ai/purge-cache
// Access: Admin only
router.delete('/purge-cache', protect, restrictTo('Admin'), aiController.purgeCache);

module.exports = router;
