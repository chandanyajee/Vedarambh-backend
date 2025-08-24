// backend/firebaseAdmin.js
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Apna Firebase Admin SDK service account JSON ka path yaha do
const serviceAccount = JSON.parse(
  readFileSync(new URL('./serviceAccountKey.json', import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'YOUR_FIREBASE_BUCKET_NAME.appspot.com', // Example: vedarambh.appspot.com
});

const bucket = admin.storage().bucket();

export { bucket };
