
# Firebase Authentication Setup for React Native (EduAttend Mobile)

This guide details how to set up Firebase Authentication in your React Native app, focusing on Email/Password and Google Sign-In methods. This assumes you have completed the [Firebase Core Setup](./firebase_core_setup.md).

## 1. Install Authentication Module

Install the `@react-native-firebase/auth` package:
```bash
# Using npm
npm install @react-native-firebase/auth

# Using yarn
yarn add @react-native-firebase/auth
```

If you are on iOS, run `pod install` again:
```bash
cd ios
pod install
cd ..
```

## 2. Enable Authentication Methods in Firebase Console

*   Go to your Firebase Console -> EduAttend Project -> Authentication -> Sign-in method.
*   Enable the sign-in providers you want to use:
    *   **Email/Password:** Enable this provider.
    *   **Google:** Enable this provider.
        *   For iOS: Provide your `GoogleService-Info.plist` during core setup.
        *   For Android: Ensure your SHA-1 fingerprint(s) are added to your Firebase project settings for the Android app.
        *   Web SDK configuration: Provide your web client ID (this is used by the Google Sign-In library). You can find this in your Google Cloud Console API credentials or sometimes in the Firebase console when Google Sign-In is enabled.

## 3. Email/Password Authentication

You can use the `firebaseAuth` instance (exported from your `src/config/firebase.ts` or imported directly from `@react-native-firebase/auth`) for email/password operations.

See `src/mobile_guidance/services/authService.ts` for example implementations of:
*   `createUserWithEmailAndPassword`
*   `signInWithEmailAndPassword`
*   `signOut`
*   `onAuthStateChanged` listener

## 4. Google Sign-In

For Google Sign-In, you'll use the `@react-native-google-signin/google-signin` library in conjunction with Firebase.

### a. Install Google Sign-In Library
```bash
# Using npm
npm install @react-native-google-signin/google-signin

# Using yarn
yarn add @react-native-google-signin/google-signin
```
Again, run `pod install` for iOS if needed.

### b. Configure Google Sign-In

Create a configuration file or configure it in your app's entry point.

```typescript
// Example: src/config/googleSignIn.ts or in your main App.tsx
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: 'YOUR_WEB_CLIENT_ID_FROM_FIREBASE_OR_GOOGLE_CLOUD_CONSOLE', // Crucial for Firebase integration
    // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    // hostedDomain: '', // specifies a hosted domain restriction
    // forceCodeForRefreshToken: true, // [Android] related to server-side access
    // accountName: '', // [Android] specifies an account name on the device that should be used
    // iosClientId: 'YOUR_IOS_CLIENT_ID', // [iOS] if you need to call Google API from your iOS app
    // googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info.plist or moved it
    // openIdRealm: '', // [iOS] The OpenID2 realm of the home web server.
    // profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
  });
};
```
**Important:** `YOUR_WEB_CLIENT_ID` is typically the "Web client (Auto-created for Google Sign-in)" ID found in your Google Cloud Console under APIs & Services > Credentials. It's essential for Firebase to correctly link the Google Sign-In token.

Call `configureGoogleSignIn()` once when your app starts, for example, in your `App.tsx`.

### c. Native Configuration for Google Sign-In

#### iOS:
1.  **URL Scheme:**
    *   Open your `GoogleService-Info.plist` file.
    *   Find the `REVERSED_CLIENT_ID` key. Copy its value.
    *   In Xcode, select your project in the Project Navigator.
    *   Select your app target.
    *   Go to the "Info" tab.
    *   Expand "URL Types" and click the "+" button.
    *   In the "URL Schemes" field, paste the `REVERSED_CLIENT_ID` value.
    *   (If you're also using `iosClientId` for direct Google API access, add that client ID as another URL Scheme too).

#### Android:
*   The `google-services.json` file usually handles most of the Android configuration.
*   Ensure your **SHA-1 fingerprint** is correctly added to your Firebase project settings for your Android app. You would have done this during the core setup or when enabling Google Sign-In in the Firebase console.

### d. Implement Google Sign-In Flow
See `src/mobile_guidance/services/authService.ts` for an example of how to implement the sign-in flow:
1.  Call `GoogleSignin.hasPlayServices()` (Android only, optional).
2.  Call `GoogleSignin.signIn()` to get an ID token.
3.  Create a Firebase credential using `auth.GoogleAuthProvider.credential(idToken)`.
4.  Sign in to Firebase with `auth().signInWithCredential(googleCredential)`.

## 5. Listening to Authentication State

Use `auth().onAuthStateChanged` to listen for changes in the user's sign-in state and navigate accordingly. This is typically set up in your root component (`App.tsx`) or a dedicated auth hook (`src/hooks/useAuth.ts`).

```typescript
// Example in App.tsx or a hook
import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
// ... other imports

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  function onAuthStateChanged(userAuth: any) {
    setUser(userAuth);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null; // or a loading screen

  // if (!user) {
  //   return <AuthNavigator />;
  // }
  // return <AppNavigator />;
}
```

After setting up, rebuild your app to ensure all native configurations are applied.
Now you can implement login, registration, and logout functionalities in your UI screens using these services.
