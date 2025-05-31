const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

let firebaseApp;

const initializeFirebase = () => {
  if (!firebaseApp) {
    // Validate required environment variables
    const requiredEnvVars = [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_PRIVATE_KEY',
      'FIREBASE_CLIENT_EMAIL',
      'FIREBASE_DATABASE_URL',
      'FIREBASE_STORAGE_BUCKET'
    ];

    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingEnvVars.length > 0) {
      throw new Error(`Missing required Firebase environment variables: ${missingEnvVars.join(', ')}`);
    }

    try {
      // Initialize Firebase with proper error handling
      const credentials = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(credentials),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });

      // Test the connection
      const db = admin.firestore();
      return db.collection('_test_').get()
        .then(() => {
          console.log('Firebase connection established successfully');
          return firebaseApp;
        })
        .catch((error) => {
          console.error('Failed to connect to Firebase:', error);
          firebaseApp = null; // Reset the app instance so we can try to initialize again
          throw error;
        });
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      throw error;
    }
  }
  
  return Promise.resolve(firebaseApp);
};

const getFirestore = async () => {
  if (!firebaseApp) {
    await initializeFirebase();
  }
  return admin.firestore();
};

module.exports = {
  initializeFirebase,
  getFirestore,
};