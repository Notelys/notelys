import passport from 'passport';
import googleStrategy from '../strategies/google.strategy.js';

/**
 * Initialize Passport with configured strategies.
 * Call this in server.js BEFORE mounting routes.
 *
 * Note: We don't use passport sessions (serialize/deserialize)
 * because we use JWT tokens instead of server-side sessions.
 */
export const initializePassport = (app) => {
    passport.use(googleStrategy);
    app.use(passport.initialize());
};

export default passport;
