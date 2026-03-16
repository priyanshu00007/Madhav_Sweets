import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccount = require('../../firebase-service-account.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log(' [FIREBASE] Admin SDK Initialized successfully');
  } catch (error) {
    console.error(' [FIREBASE] Initialization Error:', error);
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
export default admin;
