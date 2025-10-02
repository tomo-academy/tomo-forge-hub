// Authentication Service for TOMO Academy Platform
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'manager' | 'member';
  department: string;
  employeeId?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

class AuthService {
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      await this.updateLastLogin(userCredential.user.uid);
      
      return userCredential.user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign up new user
  async signUp(email: string, password: string, displayName: string, role: UserProfile['role'] = 'member'): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile
      await updateProfile(userCredential.user, {
        displayName
      });

      // Create user profile in Firestore
      await this.createUserProfile(userCredential.user.uid, {
        uid: userCredential.user.uid,
        email,
        displayName,
        role,
        department: 'General',
        createdAt: new Date(),
        lastLoginAt: new Date()
      });

      return userCredential.user;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Create user profile in Firestore
  private async createUserProfile(uid: string, profile: UserProfile): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, profile);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  // Get user profile from Firestore
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Update last login time
  private async updateLastLogin(uid: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { lastLoginAt: new Date() }, { merge: true });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  // Get user-friendly error messages
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return 'An error occurred. Please try again.';
    }
  }

  // Demo login for testing
  async demoLogin(): Promise<User> {
    try {
      // Try to sign in with demo credentials
      return await this.signIn('demo@tomoacademy.com', 'demo123');
    } catch (error) {
      // If demo user doesn't exist, create it
      try {
        const user = await this.signUp('demo@tomoacademy.com', 'demo123', 'Demo User', 'admin');
        return user;
      } catch (createError) {
        console.error('Failed to create demo user:', createError);
        throw createError;
      }
    }
  }
}

export const authService = new AuthService();