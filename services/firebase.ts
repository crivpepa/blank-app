import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey ?? 'YOUR_API_KEY',
  authDomain: extra.firebaseAuthDomain ?? 'YOUR_AUTH_DOMAIN',
  projectId: extra.firebaseProjectId ?? 'YOUR_PROJECT_ID',
  storageBucket: extra.firebaseStorageBucket ?? 'YOUR_STORAGE_BUCKET',
  messagingSenderId: extra.firebaseMessagingSenderId ?? 'YOUR_MESSAGING_SENDER_ID',
  appId: extra.firebaseAppId ?? 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
