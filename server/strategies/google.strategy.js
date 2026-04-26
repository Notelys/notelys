import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../Schema/User.js';
import { generateUsername } from '../utils/helpers.js';

/**
 * Passport Google OAuth 2.0 Strategy.
 *
 * Flow:
 *   1. User clicks "Continue with Google" → redirected to Google consent screen
 *   2. Google calls back with auth code → Passport exchanges for profile data
 *   3. This validate function finds or creates the user in MongoDB
 *   4. The user object is attached to req.user for the callback route handler
 */
const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
        scope: ['email', 'profile'],
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const fullname = profile.displayName;
            const picture = profile.photos?.[0]?.value?.replace('s96-c', 's384-c') || '';

            // Check if user already exists
            let user = await User.findOne({ "personal_info.email": email });

            if (user) {
                // Existing user — verify it's a Google account
                if (!user.google_auth) {
                    // Email was registered with password, not Google
                    return done(null, false, {
                        message: 'This email was registered with a password. Please log in with your password.',
                    });
                }
                return done(null, user);
            }

            // New user — create account
            const username = await generateUsername(email);

            user = new User({
                personal_info: {
                    fullname,
                    email,
                    username,
                    profile_img: picture,
                    isEmailVerified: true, // Google already verified the email
                },
                google_auth: true,
                provider: 'google',
            });

            await user.save();
            return done(null, user);

        } catch (err) {
            console.error('[Google Strategy Error]', err.message);
            return done(err, null);
        }
    }
);

export default googleStrategy;
