import mongoose from "mongoose";

/**
 * Short-lived authorization code for the Google OAuth callback flow.
 *
 * Instead of passing tokens directly in the redirect URL (insecure — leaked
 * via browser history, logs, and referrer headers), the backend generates an
 * opaque, single-use code that the frontend exchanges for tokens via a POST
 * request.
 *
 * Each code:
 *   - Is cryptographically random (32 bytes, hex-encoded)
 *   - Is single-use (deleted after exchange)
 *   - Auto-expires after 60 seconds via MongoDB TTL index
 */
const authCodeSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users',
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

// TTL index — MongoDB auto-deletes expired codes
authCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("authcodes", authCodeSchema);
