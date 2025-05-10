
// src/mobile_guidance/config/firebase.ts
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';
// import functions from '@react-native-firebase/functions'; // Uncomment if calling Cloud Functions directly from client

/**
 * Firebase is automatically initialized in React Native when you place:
 * - `google-services.json` in `android/app/`
 * - `GoogleService-Info.plist` in `ios/{YourAppName}/`
 * and have configured the native projects correctly as per @react-native-firebase documentation.
 */

const firebaseAuth = auth();
const firebaseFirestore = firestore();
const firebaseMessaging = messaging();
const firebaseStorage = storage();
// const firebaseFunctions = functions(); // Default region, or specify: functions('europe-west1')

// --- Firestore Settings ---
// Enable offline persistence. This is highly recommended for mobile apps
// to provide a seamless experience during intermittent network connectivity.
// Firestore on mobile enables persistence by default, but you can explicitly set it
// and configure other settings like cache size.
firebaseFirestore.settings({
  persistence: true,
  // cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED, // Example: Use unlimited cache size
});
console.log('Firestore persistence enabled.');


// --- Firebase Emulators (Optional - for development) ---
// If you are using Firebase Emulators during development, uncomment and configure below.
// Ensure this code only runs in DEV environment.
/*
if (__DEV__) {
  const localHost = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2'; // Android emulator IP for localhost

  // Point to the emulators
  firebaseAuth.useEmulator(`http://${localHost}:9099`);
  firebaseFirestore.useEmulator(localHost, 8080);
  firebaseStorage.useEmulator(localHost, 9199);
  // firebaseFunctions.useEmulator(localHost, 5001);


  console.log('Using Firebase Emulators in DEV mode.');

  // Optional: Disable SSL peer verification for Firestore emulator if needed (e.g. self-signed certs)
  // This is generally not needed if connecting via HTTP.
  // firebaseFirestore.settings({
  //   ssl: false, // Only if connecting to Firestore emulator via HTTP and it's not localhost
  //   host: `${localHost}:8080`, // Required if ssl is false
  // });
}
*/

export {
  firebaseAuth,
  firebaseFirestore,
  firebaseMessaging,
  firebaseStorage,
  // firebaseFunctions,
};
