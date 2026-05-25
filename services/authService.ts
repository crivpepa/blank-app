import { auth } from './firebase';
import { AuthResult, AuthUser } from '../types';

const isFirebaseConfigured = (): boolean => {
  try {
    return !!(auth && auth.app && auth.app.options.apiKey !== 'YOUR_API_KEY');
  } catch {
    return false;
  }
};

const DEMO_USER: AuthUser = {
  uid: 'demo-user-001',
  email: 'admin@recovery.com',
  displayName: 'Administrador Demo',
  role: 'admin',
};

export const loginWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  if (isFirebaseConfigured()) {
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const u = credential.user;
      return {
        success: true,
        user: { uid: u.uid, email: u.email ?? '', displayName: u.displayName ?? '' },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  if (email === 'admin@recovery.com' && password === '123456') {
    return { success: true, user: DEMO_USER };
  }
  return { success: false, error: 'Credenciales incorrectas. Use admin@recovery.com / 123456' };
};

export const logout = async (): Promise<AuthResult> => {
  if (isFirebaseConfigured()) {
    try {
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  return { success: true };
};

export const getCurrentUser = (): AuthUser | null => {
  if (isFirebaseConfigured()) {
    const u = auth.currentUser;
    if (!u) return null;
    return { uid: u.uid, email: u.email ?? '', displayName: u.displayName ?? '' };
  }
  return null;
};
