const bcrypt = require('bcryptjs');
 
// ─── Users Mock Database ──────────────────────────────────────────────────────
const users = [];
 
// ─── Refresh Token Blacklist (invalidated on logout) ─────────────────────────
// In production this would be Redis. Here it's an in-memory Set.
const tokenBlacklist = new Set();
 
// Seeds mock users with bcrypt-hashed passwords on server startup
const seedUsers = async () => {
    users.length = 0; // Clear to prevent duplicates on hot reload
 
    const salt = await bcrypt.genSalt(10);
 
    users.push(
        {
            id: "1",
            email: "admin@ai-genius.com",
            password: await bcrypt.hash("admin123", salt),
            role: "Admin"
        },
        {
            id: "2",
            email: "premium@ai-genius.com",
            password: await bcrypt.hash("premium123", salt),
            role: "Premium_User"
        },
        {
            id: "3",
            email: "free@ai-genius.com",
            password: await bcrypt.hash("free123", salt),
            role: "Free_User"
        }
    );
 
    console.log("✅ Mock database seeded with 3 users");
};
 
module.exports = { users, tokenBlacklist, seedUsers };
 