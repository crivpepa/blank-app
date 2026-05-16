import { auth } from './firebase';

// Check if Firebase is configured (not placeholder values)
const isFirebaseConfigured = () => {
  try {
    return auth && auth.app && auth.app.options.apiKey !== 'YOUR_API_KEY';
  } catch {
    return false;
  }
};

// Demo credentials for development
const DEMO_CREDENTIALS = {
  email: 'admin@recovery.com',
  password: '123456',
  user: {
    uid: 'demo-user-001',
    email: 'admin@recovery.com',
    displayName: 'Administrador Demo',
    role: 'admin',
  },
};

export const loginWithEmail = async (email, password) => {
  if (isFirebaseConfigured()) {
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Demo fallback
  if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
    return { success: true, user: DEMO_CREDENTIALS.user };
  }
  return { success: false, error: 'Credenciales incorrectas. Use admin@recovery.com / 123456' };
};

export const logout = async () => {
  if (isFirebaseConfigured()) {
    try {
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  return { success: true };
};

export const getCurrentUser = () => {
  if (isFirebaseConfigured()) {
    return auth.currentUser;
  }
  return null;
};

export const onAuthStateChanged = (callback) => {
  if (isFirebaseConfigured()) {
    const { onAuthStateChanged: firebaseOnAuthStateChanged } = require('firebase/auth');
    return firebaseOnAuthStateChanged(auth, callback);
  }
  // No-op unsubscribe for demo
  callback(null);
  return () => {};
};
