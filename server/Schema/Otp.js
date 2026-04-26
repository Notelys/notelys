import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        otp: {
            type: String,
            required: true, // stored as bcrypt hash — never plaintext
        },
        expiresAt: {
            type: Date,
            required: true,
            // MongoDB TTL index auto-deletes documents after this date
        },
        attempts: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// TTL index — MongoDB automatically removes expired OTP documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for fast lookups by email
otpSchema.index({ email: 1 });

export default mongoose.model("otps", otpSchema);
