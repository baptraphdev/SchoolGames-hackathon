const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

let firebaseApp;

/**
 * Initialiser Firebase avec gestion de reconnexion
 */
const initializeFirebase = async () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_DATABASE_URL',
    'FIREBASE_STORAGE_BUCKET'
  ];

  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingEnvVars.length > 0) {
    throw new Error(`Variables d'environnement manquantes : ${missingEnvVars.join(', ')}`);
  }

  // Préparer la clé privée (corriger le format)
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (privateKey) {
    // Si la clé est stockée avec des \" ou des \\n, traiter ici
    privateKey = privateKey.replace(/\\n/g, '\n');
  } else {
    throw new Error('FIREBASE_PRIVATE_KEY est manquante ou mal formatée');
  }

  const credentials = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: privateKey,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  // Fonction de reconnexion avec retries
  const initializeWithRetry = async (retries = 3, delay = 2000) => {
    try {
      if (!firebaseApp) {
        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(credentials),
          databaseURL: process.env.FIREBASE_DATABASE_URL,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
      }

      // Tester la connexion Firestore
      const db = admin.firestore();
      await db.collection('_test_').limit(1).get();

      console.log('Connexion Firebase établie avec succès.');
      return firebaseApp;
    } catch (error) {
      console.error(`Erreur lors de la tentative de connexion Firebase: ${error.message}`);
      if (retries > 0) {
        console.log(`Reconnexion dans ${delay}ms... (${retries} tentatives restantes)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return initializeWithRetry(retries - 1, delay * 1.5);
      } else {
        firebaseApp = null;
        throw error;
      }
    }
  };

  return initializeWithRetry();
};

/**
 * Récupérer Firestore, en assurant que Firebase est initialisé
 */
const getFirestore = async () => {
  await initializeFirebase();
  return admin.firestore();
};

module.exports = {
  initializeFirebase,
  getFirestore,
};