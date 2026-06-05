/**
 * TASK 4 — AI Model Endpoint Controllers
 *
 * Three mock AI endpoints demonstrating role-based access:
 *  1. GET  /api/ai/free-model    → any authenticated user
 *  2. POST /api/ai/premium-model → Premium_User + Admin
 *  3. DELETE /api/ai/purge-cache → Admin only
 */

// GET /api/ai/free-model — All authenticated users
exports.freeModel = (req, res) => {
    const { id, email, role } = req.user;

    return res.status(200).json({
        status: "success",
        message: "Free AI model response generated",
        data: {
            user: { id, email, role },
            model: "ai-genius-lite-v1",
            type: "text-generation",
            input: "Hello, AI-Genius!",
            output: "Hello! I'm AI-Genius Lite, a free-tier text generation model. I can help with basic text tasks, simple Q&A, and short-form content.",
            tokensUsed: 42,
            maxTokens: role === 'Free_User' ? 500 : 'Unlimited',
            remainingQuota: role === 'Free_User' ? 8 : 'Unlimited',
            responseTimeMs: 320,
            timestamp: new Date().toISOString()
        }
    });
};

// POST /api/ai/premium-model — Premium_User + Admin only
exports.premiumModel = (req, res) => {
    const { email, role } = req.user;

    return res.status(200).json({
        status: "success",
        message: "Premium AI model response generated",
        data: {
            accessedBy: email,
            role,
            model: "ai-genius-pro-v2",
            type: "image-generation",
            prompt: req.body?.prompt || "A futuristic cityscape at sunset with flying cars",
            result: {
                imageUrl: "https://api.ai-genius.com/generated/img_2024_abc123.png",
                resolution: "1024x1024",
                style: "photorealistic",
                seed: 42891,
                inferenceSteps: 50
            },
            usage: {
                creditsUsed: 5,
                creditsRemaining: 995,
                generationTimeMs: 2840
            },
            timestamp: new Date().toISOString()
        }
    });
};

// DELETE /api/ai/purge-cache — Admin only
exports.purgeCache = (req, res) => {
    const { email } = req.user;

    return res.status(200).json({
        status: "success",
        message: "AI model cache purged successfully",
        data: {
            purgedBy: email,
            cacheStats: {
                entriesRemoved: 15432,
                spaceFreedMB: 2048,
                modelsAffected: ["ai-genius-lite-v1", "ai-genius-pro-v2", "ai-genius-ultra-v3"],
                previousCacheSizeMB: 4096,
                currentCacheSizeMB: 2048
            },
            purgedAt: new Date().toISOString(),
            nextScheduledPurge: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }
    });
};
