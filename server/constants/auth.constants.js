/**
 * Centralized auth configuration constants.
 * Single source of truth for all auth-related magic numbers.
 */
export const AUTH = {
    // Password hashing
    SALT_ROUNDS: 10,

    // OTP settings
    OTP_LENGTH: 6,
    OTP_MAX_ATTEMPTS: 5,
    OTP_COOLDOWN_MS: 60_000,          // 60 seconds between OTP requests
    OTP_EXPIRY_MS: 10 * 60_000,      // 10 minutes

    // Login attempt protection
    MAX_LOGIN_ATTEMPTS: 5,
    LOGIN_LOCKOUT_MS: 60_000,         // 60-second lockout after max failures

    // OAuth authorization code (single-use, exchanged for tokens)
    AUTH_CODE_EXPIRY_MS: 60_000,      // 60 seconds

    // JWT token expiration
    ACCESS_TOKEN_EXPIRY: '15m',
    REFRESH_TOKEN_EXPIRY: '30d',
};
