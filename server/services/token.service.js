import jwt from 'jsonwebtoken';
import { AUTH } from '../constants/auth.constants.js';

/**
 * Generates a short-lived access token (15 minutes).
 * Used for authenticating API requests.
 */
export const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: AUTH.ACCESS_TOKEN_EXPIRY }
    );
};

/**
 * Generates a long-lived refresh token (30 days).
 * Used to silently obtain new access tokens without re-login.
 */
export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: AUTH.REFRESH_TOKEN_EXPIRY }
    );
};

/**
 * Generates both access and refresh tokens as a pair.
 * Called on successful login, signup verification, and token refresh.
 */
export const generateTokenPair = (userId) => {
    return {
        access_token: generateAccessToken(userId),
        refresh_token: generateRefreshToken(userId),
    };
};

/**
 * Verifies a refresh token's JWT signature and returns the decoded payload.
 * Returns null if the token is invalid or expired.
 */
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
        return null;
    }
};
