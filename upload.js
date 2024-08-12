// generateToken.js
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.resolve(__dirname, 'rtfkt-eggs-key.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = 'ilfauttoujoursviserlalune'; // You can set this to any unique identifier

const generateToken = async () => {
  try {
    const customToken = await admin.auth().createCustomToken(uid);
    console.log('Custom Token:', customToken);
  } catch (error) {
    console.error('Error creating custom token:', error);
  }
};

generateToken().catch(console.error);
