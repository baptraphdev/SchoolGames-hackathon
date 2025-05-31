const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCWfcbb9fFWbOa3Wpv4NlNW5ca5hs02RlI",
  authDomain: "dev03-school-db-firebase.firebaseapp.com",
  projectId: "dev03-school-db-firebase",
  storageBucket: "dev03-school-db-firebase.firebasestorage.app",
  messagingSenderId: "495975585571",
  appId: "1:495975585571:web:c41f99e818ec95a3abde96",
  measurementId: "G-TJP773DLT4"
};

let db = null;

const initializeFirebase = () => {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

const getFirestoreInstance = () => {
  if (!db) {
    throw new Error('Firebase must be initialized before getting Firestore instance');
  }
  return db;
};

module.exports = {
  initializeFirebase,
  getFirestoreInstance
};