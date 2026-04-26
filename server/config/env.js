// Validate required environment variables at startup
const requiredEnvVars = [
    'DB_LOCATION',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS',
    'AWS_ACCESS_KEY',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error(`\n❌ Missing required environment variables:\n`);
    missingVars.forEach(varName => {
        console.error(`   - ${varName}`);
    });
    console.error(`\nPlease add them to your .env file and restart.\n`);
    process.exit(1);
}

// Optional env vars with defaults
const optionalEnvVars = {
    PORT: process.env.PORT || '8080',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
};

if (!process.env.FRONTEND_URL) {
    console.warn('⚠️  FRONTEND_URL not set — defaulting to http://localhost:5173');
}

export default optionalEnvVars;
