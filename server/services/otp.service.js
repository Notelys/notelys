import crypto from 'crypto';
import bcrypt from 'bcrypt';
import Otp from '../Schema/Otp.js';
import { AUTH } from '../constants/auth.constants.js';
import { ERRORS } from '../constants/error-messages.js';

/**
 * Generates a cryptographically secure 6-digit OTP,
 * hashes it with bcrypt, and stores it in the database.
 *
 * Enforces a 60-second cooldown between OTP requests for the same email.
 * Old OTPs for the email are deleted before creating a new one.
 */
export const generateOtp = async (email) => {
    // Check cooldown — prevent OTP spam
    const existingOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (existingOtp) {
        const timeSinceCreation = Date.now() - existingOtp.createdAt.getTime();
        if (timeSinceCreation < AUTH.OTP_COOLDOWN_MS) {
            const secondsRemaining = Math.ceil((AUTH.OTP_COOLDOWN_MS - timeSinceCreation) / 1000);
            throw Object.assign(
                new Error(`${ERRORS.OTP_COOLDOWN} (${secondsRemaining}s remaining)`),
                { statusCode: 429 }
            );
        }
    }

    // Delete any existing OTPs for this email
    await Otp.deleteMany({ email });

    // Generate a cryptographically secure 6-digit OTP
    const plainOtp = crypto.randomInt(100_000, 999_999).toString();

    // Hash the OTP before storing (never store plaintext)
    const hashedOtp = await bcrypt.hash(plainOtp, AUTH.SALT_ROUNDS);

    // Store with expiry
    await Otp.create({
        email,
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + AUTH.OTP_EXPIRY_MS),
        attempts: 0,
    });

    // Return the plain OTP for sending via email
    return plainOtp;
};

/**
 * Verifies a user-provided OTP against the hashed OTP in the database.
 *
 * Checks:
 * 1. OTP record exists for the email
 * 2. OTP has not expired
 * 3. Max attempts (5) have not been exceeded
 * 4. OTP matches (bcrypt compare)
 *
 * On success: deletes the OTP record.
 * On failure: increments the attempt counter.
 */
export const verifyOtp = async (email, plainOtp) => {
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
        throw Object.assign(
            new Error(ERRORS.OTP_EXPIRED),
            { statusCode: 400 }
        );
    }

    // Check if max attempts exceeded
    if (otpRecord.attempts >= AUTH.OTP_MAX_ATTEMPTS) {
        await Otp.deleteOne({ _id: otpRecord._id });
        throw Object.assign(
            new Error(ERRORS.OTP_MAX_ATTEMPTS),
            { statusCode: 429 }
        );
    }

    // Check expiry (belt-and-suspenders — TTL index handles cleanup, but verify in-app too)
    if (otpRecord.expiresAt < new Date()) {
        await Otp.deleteOne({ _id: otpRecord._id });
        throw Object.assign(
            new Error(ERRORS.OTP_EXPIRED),
            { statusCode: 400 }
        );
    }

    // Compare hashed OTP
    const isMatch = await bcrypt.compare(plainOtp, otpRecord.otp);

    if (!isMatch) {
        // Increment attempts
        await Otp.updateOne(
            { _id: otpRecord._id },
            { $inc: { attempts: 1 } }
        );

        const attemptsLeft = AUTH.OTP_MAX_ATTEMPTS - (otpRecord.attempts + 1);
        throw Object.assign(
            new Error(`${ERRORS.OTP_INVALID} (${attemptsLeft} attempts remaining)`),
            { statusCode: 400 }
        );
    }

    // Success — delete the OTP record
    await Otp.deleteOne({ _id: otpRecord._id });

    return true;
};

/**
 * Deletes all OTP records for a given email.
 * Called after successful verification or when generating a new OTP.
 */
export const deleteOtp = async (email) => {
    await Otp.deleteMany({ email });
};
