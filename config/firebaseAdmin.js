import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

// __dirname ka equivalent (ESM me)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Service account ka path
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

// Firebase Admin initialize
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
  storageBucket: "YOUR_FIREBASE_PROJECT_ID.appspot.com"
});

const bucket = admin.storage().bucket();

export { admin, bucket };
