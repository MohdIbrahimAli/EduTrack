
// src/mobile_guidance/services/authService.ts
import { firebaseAuth } from '../config/firebase';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import type { User } from '../types'; // Assuming User type might be slightly different or extended

// Call this once in your app's entry point (e.g., App.tsx)
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: 'YOUR_WEB_CLIENT_ID_FROM_FIREBASE_OR_GOOGLE_CLOUD_CONSOLE',
    // Ensure this webClientId is the one associated with your Firebase project for Google Sign-In.
    // It's usually found in the Google Cloud Console under APIs & Services > Credentials.
  });
};

export const onAuthStateChanged = (
  callback: (user: User | null) => void
): (() => void) => {
  return firebaseAuth.onAuthStateChanged((firebaseUser: FirebaseAuthTypes.User | null) => {
    if (firebaseUser) {
      // Adapt FirebaseAuthTypes.User to your app's User type
      const appUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        avatarUrl: firebaseUser.photoURL,
        // You might want to fetch additional user profile data from Firestore here
      };
      callback(appUser);
    } else {
      callback(null);
    }
  });
};

export const signUpWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
    const firebaseUser = userCredential.user;
    // You might want to create a user document in Firestore here as well
    // e.g., await firebaseFirestore.collection('users').doc(firebaseUser.uid).set({ email, createdAt: new Date() });
    return {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        avatarUrl: firebaseUser.photoURL,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign up');
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
    const firebaseUser = userCredential.user;
     return {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        avatarUrl: firebaseUser.photoURL,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
};

export const signInWithGoogle = async (): Promise<User> => {
  try {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    if (!idToken) {
      throw new Error('Google Sign-In failed: ID token not found.');
    }

    // Create a Google credential with the token
    const googleCredential = firebaseAuth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const userCredential = await firebaseAuth.signInWithCredential(googleCredential);
    const firebaseUser = userCredential.user;

    // Check if it's a new user to create a Firestore document
    // if (userCredential.additionalUserInfo?.isNewUser) {
    //   await firebaseFirestore.collection('users').doc(firebaseUser.uid).set({
    //     email: firebaseUser.email,
    //     displayName: firebaseUser.displayName,
    //     photoURL: firebaseUser.photoURL,
    //     createdAt: new Date(),
    //     provider: 'google',
    //   }, { merge: true }); // Use merge if user might exist from other provider
    // }

     return {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        avatarUrl: firebaseUser.photoURL,
    };
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new Error('Google Sign-In cancelled by user.');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      throw new Error('Google Sign-In is already in progress.');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Google Play Services not available or outdated.');
    } else {
      console.error('Google Sign-In Error:', error);
      throw new Error(error.message || 'Google Sign-In failed.');
    }
  }
};

export const signOut = async (): Promise<void> => {
  try {
    // Check if signed in with Google to sign out from there too
    const isSignedInWithGoogle = await GoogleSignin.isSignedIn();
    if (isSignedInWithGoogle) {
      await GoogleSignin.revokeAccess(); // Optional: if you want to revoke access entirely
      await GoogleSignin.signOut();
    }
    await firebaseAuth.signOut();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
};

export const getCurrentUser = (): User | null => {
  const firebaseUser = firebaseAuth.currentUser;
  if (firebaseUser) {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      avatarUrl: firebaseUser.photoURL,
    };
  }
  return null;
};

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  try {
    await firebaseAuth.sendPasswordResetEmail(email);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send password reset email.');
  }
};
