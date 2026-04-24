import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const credPath = resolve(__dirname, '../blog-app-82817-firebase-adminsdk-fbsvc-7463cad566.json');

try {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        // Cloud Run: use mounted secret or ADC
        admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
        console.log('✅ Firebase initialized via Application Default Credentials');
    } else if (existsSync(credPath)) {
        // Local dev: use JSON file
        const serviceAccountKey = JSON.parse(readFileSync(credPath, 'utf-8'));
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccountKey)
        });
        console.log('✅ Firebase initialized via service account JSON');
    } else {
        console.warn('⚠️  No Firebase credentials found — Firebase features will be unavailable');
        admin.initializeApp();
    }
} catch (err) {
    console.error('❌ Firebase initialization failed:', err.message);
    admin.initializeApp();
}

export { getAuth };
export default admin;
