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
      // Handle the private key properly, ensuring correct format
      const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
        : undefined;

      if (!privateKey) {
        throw new Error('Invalid FIREBASE_PRIVATE_KEY format');
      }

      const credentials = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };

      // Initialize Firebase with retry logic
      const initializeWithRetry = async (retries = 3, delay = 2000) => {
        try {
          if (!firebaseApp) {
            firebaseApp = admin.initializeApp({
              credential: admin.credential.cert(credentials),
              databaseURL: process.env.FIREBASE_DATABASE_URL,
              storageBucket: process.env.FIREBASE_STORAGE_BUCKET
            });
          }

          // Test the connection
          const db = admin.firestore();
          await db.collection('_test_').get();
          console.log('Firebase connection established successfully');
          return firebaseApp;
        } catch (error) {
          if (retries > 0) {
            console.log(`Retrying Firebase connection in ${delay}ms... (${retries} attempts remaining)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return initializeWithRetry(retries - 1, delay * 1.5);
          }
          console.error('Failed to connect to Firebase after multiple attempts:', error);
          firebaseApp = null;
          throw error;
        }
      };

      return initializeWithRetry();
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