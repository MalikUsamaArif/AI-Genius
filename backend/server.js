require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { seedUsers } = require('./config/db');
const authRoutes      = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const aiRoutes        = require('./routes/aiRoutes');
 
const app = express();
 
// ─── Middleware ───────────────────────────────────────────────────────────────
// Configure CORS for frontend proxy / direct connections
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser()); // Required to read the refreshToken httpOnly cookie
 
// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "AI-Genius API is running",
        timestamp: new Date().toISOString()
    });
});
 
// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);       // Task 1 + Task 3
app.use('/api/protected', protectedRoutes);  // Task 2
app.use('/api/ai',        aiRoutes);         // Task 4 (AI routes)
 
// ─── Global 404 Handler ───────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        status: "fail",
        message: `Route ${req.originalUrl} not found`
    });
});
 
// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("🔥 Unhandled Error:", err.stack);
    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Something went wrong"
    });
});
 
// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
 
// Seed users first, then start the server to prevent race conditions during tests
seedUsers().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`\n📋 Available endpoints:`);
        console.log(`   POST  /api/auth/login              → Task 1: Login`);
        console.log(`   POST  /api/auth/refresh            → Task 3: Silent token refresh`);
        console.log(`   POST  /api/auth/logout             → Task 3: Logout + revoke tokens`);
        console.log(`   GET   /api/ai/free-model           → Task 4: All logged in users`);
        console.log(`   POST  /api/ai/premium-model        → Task 4: Premium + Admin only`);
        console.log(`   DELETE /api/ai/purge-cache          → Task 4: Admin only`);
        console.log(`   GET   /api/protected/dashboard     → Task 2: All authenticated`);
        console.log(`   GET   /api/protected/scans         → Task 2: Premium + Admin`);
        console.log(`   GET   /api/protected/admin-panel   → Task 2: Admin only\n`);
    });
});
