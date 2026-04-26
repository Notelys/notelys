import mongoose from "mongoose";

const loginAttemptSchema = new mongoose.Schema(
    {
        identifier: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            // Can be email or username — tracks per-user failed login attempts
        },
        expiresAt: {
            type: Date,
            required: true,
            // Each attempt auto-expires after 60 seconds via TTL index
        },
    },
    { timestamps: true }
);

// TTL index — MongoDB auto-deletes each attempt record after 60s
loginAttemptSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for fast count queries per identifier
loginAttemptSchema.index({ identifier: 1 });

export default mongoose.model("loginattempts", loginAttemptSchema);
