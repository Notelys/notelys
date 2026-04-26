/**
 * Centralized error message strings.
 * Keeps error wording consistent across the entire auth system.
 */
export const ERRORS = {
    // Auth — General
    INVALID_CREDENTIALS: 'Invalid email/username or password',
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'You do not have permission to perform this action',
    TOKEN_EXPIRED: 'Access token has expired',
    TOKEN_INVALID: 'Access token is invalid',
    REFRESH_TOKEN_INVALID: 'Refresh token is invalid or has been revoked',

    // Auth — Registration
    EMAIL_EXISTS: 'An account with this email already exists',
    USERNAME_EXISTS: 'This username is already taken',
    FULLNAME_TOO_SHORT: 'Full name must be at least 3 characters long',
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PASSWORD_WEAK: 'Password must be 6-20 characters with at least one uppercase letter, one lowercase letter, and one number',

    // Auth — Email Verification
    EMAIL_NOT_VERIFIED: 'Please verify your email before logging in',
    EMAIL_ALREADY_VERIFIED: 'Email is already verified',

    // Auth — OTP
    OTP_EXPIRED: 'OTP has expired. Please request a new one',
    OTP_INVALID: 'Incorrect OTP. Please try again',
    OTP_MAX_ATTEMPTS: 'Too many incorrect OTP attempts. Please request a new code',
    OTP_COOLDOWN: 'Please wait 60 seconds before requesting another OTP',
    OTP_REQUIRED: 'OTP is required',

    // Auth — Login Protection
    ACCOUNT_LOCKED: 'Too many failed login attempts. Please try again in 1 minute',

    // Auth — Password Reset
    PASSWORD_RESET_SENT: 'If an account with that email exists, a reset code has been sent',
    PASSWORD_RESET_SUCCESS: 'Password has been reset successfully',
    PASSWORD_SAME: 'New password cannot be the same as the current password',

    // Auth — Google
    GOOGLE_AUTH_FAILED: 'Google authentication failed. Please try again',
    GOOGLE_ACCOUNT_EXISTS: 'This email was registered with a password. Please log in with your password',
    LOCAL_ACCOUNT_EXISTS: 'This email was registered via Google. Please use Google Sign-In',

    // Auth — Change Password
    GOOGLE_PASSWORD_CHANGE: 'Cannot change password for a Google-authenticated account',
    CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect',

    // General
    USER_NOT_FOUND: 'User not found',
    SERVER_ERROR: 'Something went wrong. Please try again later',
    RATE_LIMIT: 'Too many requests. Please slow down',
};
