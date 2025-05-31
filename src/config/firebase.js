const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

let firebaseApp;

const initializeFirebase = () => {
  if (!firebaseApp) {
    // For production, use environment variables
    if (process.env.NODE_ENV === 'production') {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
    } else {
      // For development, use service account or emulator
      try {
        // First try with service account if available
        if (process.env.FIREBASE_PROJECT_ID) {
          firebaseApp = admin.initializeApp({
            credential: admin.credential.cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            }),
          });
        } else {
          // Fallback to default app without credentials (for emulator)
          firebaseApp = admin.initializeApp();
          // Set Firestore emulator host if needed
          if (process.env.FIRESTORE_EMULATOR_HOST) {
            admin.firestore().settings({
              host: process.env.FIRESTORE_EMULATOR_HOST,
              ssl: false,
            });
          }
        }
      } catch (error) {
        console.error('Firebase initialization error:', error);
        process.exit(1);
      }
    }
  }
  
  return firebaseApp;
};

const getFirestore = () => {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return admin.firestore();
};

module.exports = {
  initializeFirebase,
  getFirestore,
};