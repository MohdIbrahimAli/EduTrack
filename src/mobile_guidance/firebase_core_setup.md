
# Firebase Core Setup for React Native (EduAttend Mobile)

This guide covers the initial steps to connect your React Native mobile application to your existing Firebase project and set up the core Firebase SDK.

## 1. Add Mobile Apps to Your Firebase Project

Before you can use Firebase in your mobile app, you need to register your iOS and Android apps with your Firebase project in the Firebase console:

*   Go to your [Firebase Console](https://console.firebase.google.com/).
*   Select your existing EduAttend Firebase project.
*   In the Project Overview page, click on **"Add app"**.

### For iOS:
*   Select the iOS icon.
*   **iOS bundle ID:** Enter your app's bundle identifier. You can find this in Xcode under `Target > General > Identity > Bundle Identifier`. It's typically in reverse domain name notation (e.g., `com.eduattend.mobileapp`).
*   **App nickname (Optional):** e.g., "EduAttend iOS".
*   **App Store ID (Optional):** You can add this later.
*   Click **"Register app"**.

### For Android:
*   Select the Android icon.
*   **Android package name:** Enter your app's package name. You can find this in `android/app/build.gradle` (look for `applicationId`) or `android/app/src/main/AndroidManifest.xml` (look for `package`). E.g., `com.eduattend.mobileapp`.
*   **App nickname (Optional):** e.g., "EduAttend Android".
*   **Debug signing certificate SHA-1 (Optional but Recommended for some services like Google Sign-In, Phone Auth):**
    *   You can get this by running the following command in your React Native project's `android` directory:
        ```bash
        ./gradlew signingReport
        ```
    *   Look for the `SHA1` value under the `debug` variant (usually `SHA1: XX:XX:...`).
*   Click **"Register app"**.

## 2. Download Configuration Files

After registering each app, Firebase will provide a configuration file.

### For iOS: `GoogleService-Info.plist`
*   Download the `GoogleService-Info.plist` file.
*   In Xcode, open your project's `ios/{YourAppName}` directory.
*   Drag the downloaded `GoogleService-Info.plist` file into the root of your Xcode project (e.g., within the `YourAppName` subfolder, alongside `AppDelegate.mm`).
*   When prompted, ensure **"Copy items if needed"** is checked and that the file is added to your app's main target.

### For Android: `google-services.json`
*   Download the `google-services.json` file.
*   Place this file in your React Native project's `android/app/` directory.

## 3. Install Core Firebase SDK for React Native

We'll use the `@react-native-firebase` library, which provides a comprehensive suite of Firebase services for React Native.

Open your terminal in the root of your React Native project and run:

```bash
# Using npm
npm install @react-native-firebase/app

# Using yarn
yarn add @react-native-firebase/app
```

## 4. Native Setup (iOS and Android)

### For iOS:
*   The `@react-native-firebase/app` module requires the native Firebase SDKs to be available. Cocoapods handles this.
*   Ensure your `ios/Podfile` is set up correctly. React Native Firebase often handles this automatically. If you encounter issues, ensure you have `use_frameworks! :linkage => :static` or `use_modular_headers!` as needed by your project and other dependencies. You might also need `platform :ios, '12.0'` (or a higher version).
*   Install the pods:
    ```bash
    cd ios
    pod install --repo-update # Use --repo-update if you haven't updated pods recently
    cd ..
    ```
*   Open your `ios/AppDelegate.mm` (or `AppDelegate.m`) file and add the following at the top:
    ```objectivec
    #import <Firebase.h> // Add this line
    ```
*   Within the `didFinishLaunchingWithOptions` method, add the following line before `return YES;`:
    ```objectivec
    if ([FIRApp defaultApp] == nil) {
      [FIRApp configure];
    } // Add this block
    ```

### For Android:
*   The `google-services.json` file you added earlier is usually sufficient for basic setup. The `@react-native-firebase/app` package's native module should link automatically.
*   Ensure your `android/build.gradle` file has the Google Services classpath:
    ```gradle
    // File: android/build.gradle
    buildscript {
        // ...
        dependencies {
            // ...
            classpath 'com.google.gms:google-services:4.4.1' // Check for the latest version
        }
    }
    // ...
    ```
*   Ensure your `android/app/build.gradle` file applies the Google Services plugin at the bottom:
    ```gradle
    // File: android/app/build.gradle
    // ...
    apply plugin: 'com.google.gms.google-services' // Add this line at the very end of the file
    ```

## 5. Initialize Firebase in Your App (Conceptual)

While `@react-native-firebase` often initializes automatically using the configuration files, it's good practice to have a central place for Firebase related configurations.

Create `src/config/firebase.ts` (or similar):
```typescript
// src/config/firebase.ts
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';
// import functions from '@react-native-firebase/functions'; // if you need to call functions directly

// Firebase is usually auto-initialized by placing google-services.json / GoogleService-Info.plist

const firebaseAuth = auth();
const firebaseFirestore = firestore();
const firebaseMessaging = messaging();
const firebaseStorage = storage();
// const firebaseFunctions = functions(); // You can specify a region if needed e.g. functions('europe-west1')


// Enable Firestore offline persistence (optional, but recommended for mobile)
firebaseFirestore.settings({
  persistence: true,
  // Other settings like cacheSizeBytes can be configured here
});

export {
  firebaseAuth,
  firebaseFirestore,
  firebaseMessaging,
  firebaseStorage,
  // firebaseFunctions
};
```
This file doesn't explicitly call `Firebase.initializeApp()` as in web, because `@react-native-firebase` handles this based on the native config files. It serves to export the initialized Firebase service modules.

## 6. Rebuild Your App

After these changes, rebuild your React Native application:
```bash
# For iOS
npx react-native run-ios

# For Android
npx react-native run-android
```

Your app should now be connected to Firebase. You can proceed to set up specific Firebase services like Authentication, Firestore, etc., by installing their respective `@react-native-firebase` modules.
