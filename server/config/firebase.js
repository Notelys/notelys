import admin from 'firebase-admin';
import serviceAccountKey from '../blog-app-82817-firebase-adminsdk-fbsvc-7463cad566.json' with { type: "json" };
import { getAuth } from 'firebase-admin/auth';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});

export { getAuth };
export default admin;
