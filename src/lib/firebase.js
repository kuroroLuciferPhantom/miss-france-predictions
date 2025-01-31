import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

console.log('Firebase: Initializing...');

const firebaseConfig = {
  apiKey: "AIzaSyBTp6-Y7gFPsU8qprZJ5xW0EcZ3-GgOa6w",
  authDomain: "missfranceprediction.firebaseapp.com",
  projectId: "missfranceprediction",
  storageBucket: "missfranceprediction.appspot.com",
  messagingSenderId: "275177405967",
  appId: "1:275177405967:web:3e05b6f46dbd01a1ac8cdf"
};

console.log('Firebase: Config loaded');

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('Firebase: Initialization complete');

export { auth, db };