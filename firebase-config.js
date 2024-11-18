import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tu configuración de Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyDfQG3yLMjSIcMsamACxTQ2MD0Hfw8ckk8",
  authDomain: "capatapp-ef801.firebaseapp.com",
  projectId: "capatapp-ef801",
  storageBucket: "capatapp-ef801.appspot.com",
  messagingSenderId: "609034309246",
  appId: "1:609034309246:web:c35454683eea82eec3122f",
  measurementId: "G-H7ZCV19CB6"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
export const firestore = getFirestore(app);

// Inicializa Firebase Auth con persistencia de AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
