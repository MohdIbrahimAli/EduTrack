
# Firebase Cloud Messaging (FCM) Setup for React Native (EduAttend Mobile)

This guide covers setting up Firebase Cloud Messaging (FCM) for push notifications in your React Native application. This assumes you have completed the [Firebase Core Setup](./firebase_core_setup.md).

## 1. Install Messaging Module

Install the `@react-native-firebase/messaging` package:
```bash
# Using npm
npm install @react-native-firebase/messaging

# Using yarn
yarn add @react-native-firebase/messaging
```

If you are on iOS, run `pod install` again:
```bash
cd ios
pod install
cd ..
```

## 2. iOS Specific Setup

### a. Enable Push Notifications Capability
*   In Xcode, open your project.
*   Select your app target.
*   Go to the "Signing & Capabilities" tab.
*   Click the "+" button to add a new capability.
*   Search for and add "Push Notifications".

### b. Enable Background Modes (Optional but common)
*   Still in "Signing & Capabilities", click "+" again.
*   Add "Background Modes".
*   Check "Remote notifications" under Background Modes. This allows your app to process notifications received in the background.

### c. APNs Configuration
*   Go to your Apple Developer account.
*   Ensure you have an APNs key configured or create one.
*   Go to your Firebase Console -> Project Settings -> Cloud Messaging.
*   Under "iOS app configuration", upload your APNs Authentication Key (a `.p8` file) or APNs certificates. Using an Auth Key is generally recommended as it doesn't expire.

### d. AppDelegate Setup
In your `ios/AppDelegate.mm` (or `AppDelegate.m`):
*   Ensure Firebase is configured: `[FIRApp configure];` (done in core setup).
*   The `@react-native-firebase/messaging` module usually handles registering for remote notifications. However, you might need to add or verify methods for handling notification registration and reception if you encounter issues or have custom needs. The library's documentation provides up-to-date specifics.

## 3. Android Specific Setup

*   The `google-services.json` file (from core setup) usually contains the necessary information for FCM on Android.
*   By default, notifications will use a default icon. To customize the notification icon:
    *   Add your desired icon to `android/app/src/main/res/mipmap-<density>` (e.g., `mipmap-mdpi`, `mipmap-hdpi`, etc.).
    *   Specify the icon in your `android/app/src/main/AndroidManifest.xml` within the `<application>` tag:
        ```xml
        <application ...>
          <meta-data
            android:name="com.google.firebase.messaging.default_notification_icon"
            android:resource="@mipmap/your_custom_icon_name" />
          <!-- Set color for notification icon -->
          <meta-data
            android:name="com.google.firebase.messaging.default_notification_color"
            android:resource="@color/your_notification_color" />
          <!-- ... other meta-data and activities -->
        </application>
        ```
        And define `your_notification_color` in `android/app/src/main/res/values/colors.xml`.

## 4. Requesting Permissions (iOS)

On iOS, you must explicitly request permission from the user to receive push notifications.
```typescript
// Example in src/services/fcmService.ts or App.tsx
import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    // Get FCM token after permission is granted
    getFCMToken();
  }
}

// Call this function, e.g., after user login or at app start
// requestUserPermission();
```
On Android, permissions are generally granted by default for FCM, but Android 13+ requires runtime permission for notifications (`POST_NOTIFICATIONS`). The `@react-native-firebase/messaging` library may handle this, or you might need to use `PermissionsAndroid` from `react-native`.

## 5. Getting the FCM Token

Each device has a unique FCM token that you'll use to send notifications to it.
```typescript
// Example in src/services/fcmService.ts
async function getFCMToken() {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    // TODO: Send this token to your server and store it against the user's profile
    // e.g., await firestore().collection('users').doc(userId).update({ fcmToken: token });
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}
```
You should typically get the token after the user logs in and store it in Firestore (or your backend) associated with the user, so your Cloud Functions can retrieve it to send targeted notifications. Re-fetch and update the token if `onTokenRefresh` is triggered.

```typescript
// Listen for token refresh
useEffect(() => {
  const unsubscribe = messaging().onTokenRefresh(newToken => {
    console.log('FCM Token refreshed:', newToken);
    // TODO: Update token on your server
  });
  return unsubscribe;
}, []);
```

## 6. Handling Incoming Messages

You can listen for messages when the app is in the foreground, background, or terminated.

```typescript
// Example in src/services/fcmService.ts or a dedicated notification handler file,
// or App.tsx for basic setup.

import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native'; // Or use a custom in-app notification UI

export function setupNotificationListeners() {
  // 1. When app is in foreground
  const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
    console.log('FCM Message data (foreground):', remoteMessage.data);
    console.log('FCM Notification (foreground):', remoteMessage.notification);

    Alert.alert(
      remoteMessage.notification?.title || 'New Notification',
      remoteMessage.notification?.body
    );
    // Here you can display an in-app notification, update UI, etc.
  });

  // 2. When app is in background or terminated and user taps notification
  // This listener is called when the app is opened from a background state by a notification
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    // e.g., navigate to a specific screen based on remoteMessage.data
    // if (remoteMessage.data?.screen) {
    //   navigation.navigate(remoteMessage.data.screen);
    // }
  });

  // 3. Check if app was opened from a terminated state by a notification
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        // e.g., navigate to a specific screen
      }
    });

  // 4. For messages received when app is in background (Android only for data-only messages without `notification` payload, or custom handling)
  // Note: For simple "notification" payloads, Android system tray handles them when app is in background/quit.
  // This handler is for data-only messages or if you want to customize background message handling.
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    // Here you can perform background tasks, or create a local notification
  });

  return () => {
    unsubscribeForeground();
  };
}

// In your App.tsx or similar entry point:
// useEffect(() => {
//   requestUserPermission(); // Also get token inside this
//   const cleanupListeners = setupNotificationListeners();
//   return cleanupListeners;
// }, []);
```

## 7. Sending Notifications via Cloud Functions

Your existing Cloud Functions (or new ones) can send notifications to mobile devices using the Firebase Admin SDK.

Example Cloud Function (TypeScript):
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// admin.initializeApp(); // Initialize if not already done

export const sendAbsenceAlert = functions.firestore
  .document('absences/{absenceId}') // Example trigger
  .onCreate(async (snap, context) => {
    const absenceData = snap.data();
    if (!absenceData) {
      console.log('No absence data found');
      return null;
    }

    const { childId, date, parentUid } = absenceData;

    if (!parentUid) {
      console.log('Parent UID not found for absence');
      return null;
    }

    try {
      // Get parent's FCM token from their user document
      const userDoc = await admin.firestore().collection('users').doc(parentUid).get();
      if (!userDoc.exists) {
        console.log(`User ${parentUid} not found.`);
        return null;
      }
      const fcmToken = userDoc.data()?.fcmToken;

      if (!fcmToken) {
        console.log(`FCM token not found for user ${parentUid}`);
        return null;
      }

      // Get child's name (assuming you have a children collection)
      let childName = 'Your child';
      const childDoc = await admin.firestore().collection('children').doc(childId).get();
      if (childDoc.exists) {
        childName = childDoc.data()?.name || childName;
      }

      const messagePayload = {
        notification: {
          title: 'Absence Alert',
          body: `${childName} was marked absent on ${date}.`,
        },
        data: { // Optional data payload for custom handling in app
          screen: 'AttendanceDetail', // Example: navigate to this screen
          childId: childId,
        },
        token: fcmToken,
      };

      console.log(`Sending notification to token: ${fcmToken}`);
      await admin.messaging().send(messagePayload); // Use `send` for single token
      // or admin.messaging().sendToDevice(tokensArray, payload) for multiple tokens
      console.log('Successfully sent message');
      return null;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  });
```

Remember to rebuild your app after these configurations. Test thoroughly on both iOS and Android devices.
