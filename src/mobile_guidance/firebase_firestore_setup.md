
# Firebase Firestore Setup for React Native (EduAttend Mobile)

This guide explains how to integrate Firebase Firestore into your React Native application for data storage and retrieval. This assumes you have completed the [Firebase Core Setup](./firebase_core_setup.md).

## 1. Install Firestore Module

Install the `@react-native-firebase/firestore` package:
```bash
# Using npm
npm install @react-native-firebase/firestore

# Using yarn
yarn add @react-native-firebase/firestore
```

If you are on iOS, run `pod install` again:
```bash
cd ios
pod install
cd ..
```

## 2. Firestore Security Rules

Ensure your Firestore security rules are set up appropriately in the Firebase console to allow access from your mobile application. The rules you have for your web application might largely apply, but review them with mobile app specific use-cases in mind (e.g., ensuring users can only access their own children's data).

Example (very basic, **refine for production**):
```firestore-rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Match any document in the 'users' collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Match documents for children, assuming children are subcollections of users
    // or have a parentId field.
    match /children/{childId} {
      // Example: allow read if user is parent (needs a field like 'parentUid' on child doc)
      allow read: if request.auth != null && resource.data.parentUid == request.auth.uid;
      // Allow write if user is parent (for reporting absence, etc.)
      allow write: if request.auth != null && request.data.parentUid == request.auth.uid;
    }

    match /attendanceRecords/{recordId} {
      // Example: allow read if user is parent of the child associated with this record
      // This requires fetching the child document or having parentUid on attendance record
      allow read: if request.auth != null && get(/databases/$(database)/documents/children/$(resource.data.childId)).data.parentUid == request.auth.uid;
      allow write: if false; // Generally, attendance is recorded by school, not parents
    }

    match /absenceReports/{reportId} {
        allow read, create: if request.auth != null && request.resource.data.parentUid == request.auth.uid;
        // allow update, delete: if ... (more specific rules)
    }

    // Add rules for other collections like syllabus, assignments, progressReports, messages, notifications
  }
}
```
**Note:** Your existing Firestore schema for EduAttend (users, students/children, attendance records, absence reports, etc.) will be reused.

## 3. Using Firestore in Your App

You can use the `firebaseFirestore` instance (exported from your `src/config/firebase.ts` or imported directly from `@react-native-firebase/firestore`).

See `src/mobile_guidance/services/firestoreService.ts` for example implementations of:
*   Fetching a list of children for the authenticated parent.
*   Fetching attendance records for a specific child.
*   Submitting an absence report.
*   Listening to real-time updates using `onSnapshot`.

## 4. Offline Persistence

Firestore's offline persistence is highly recommended for mobile applications to provide a good user experience even with intermittent network connectivity. `@react-native-firebase/firestore` enables this by default on mobile platforms.

You can explicitly configure settings if needed, usually once when your app starts (e.g., in `src/config/firebase.ts`):

```typescript
// src/config/firebase.ts
import firestore from '@react-native-firebase/firestore';

// ... other imports and firebase initializations

const firebaseFirestore = firestore();

// Firestore offline persistence is enabled by default on mobile.
// You can customize settings if necessary:
firebaseFirestore.settings({
  persistence: true, // Default is true on mobile
  // cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED, // Example: configure cache size
});

export { firebaseFirestore /*, ...other firebase services */ };
```

With persistence enabled:
*   Data written by your app will be written to a local cache first, then synchronized with the Firebase backend when the network is available.
*   Queries will first try to fulfill from the cache, providing data even when offline.
*   Real-time listeners will receive updates from the cache and then from the server once connected.

## 5. Data Modeling Considerations

While reusing your existing schema, consider if any mobile-specific optimizations or small denormalizations might be beneficial for query performance on mobile. However, for the initial port, direct reuse is the primary goal.

After installation and setup, rebuild your app:
```bash
npx react-native run-ios
npx react-native run-android
```

You are now ready to interact with Firestore to manage your EduAttend application data from the mobile app.
