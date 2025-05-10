
# EduAttend Parent Portal - React Native Mobile App Guidance

This directory contains guidance, example code, and setup instructions for developing a **React Native** mobile application for the EduAttend Parent Portal. The goal is to leverage the existing Firebase backend to create native mobile experiences for iOS and Android.

**Important:** The files in this `mobile_guidance` directory are **not** part of the Next.js web application. They are intended to serve as a starting point and reference for a **separate React Native project**.

## Chosen Technology Stack

*   **Framework:** React Native
*   **Firebase Integration:** `@react-native-firebase` suite of packages (app, auth, firestore, messaging, storage).
*   **Navigation:** `@react-navigation/native` (recommended, examples will use placeholder navigation calls).
*   **Google Sign-In:** `@react-native-google-signin/google-signin`.

## Overview of Contents

*   **`project_structure.md`**: Describes a recommended project structure for the React Native mobile application.
*   **Firebase Setup Guides (`firebase_*.md`)**: Step-by-step instructions for integrating Firebase services into your React Native app.
    *   `firebase_core_setup.md`: Initial Firebase project connection and core SDK.
    *   `firebase_auth_setup.md`: Authentication setup, including Email/Password and Google Sign-In.
    *   `firebase_firestore_setup.md`: Firestore integration for data storage and retrieval, including offline persistence.
    *   `firebase_messaging_setup.md`: Firebase Cloud Messaging (FCM) for push notifications.
    *   `firebase_storage_setup.md`: Firebase Storage for file uploads (e.g., absence attachments).
*   **`components/`**: Example React Native UI components.
    *   `screens/`: Top-level screen components (Login, Dashboard, etc.).
    *   `common/`: Reusable basic components like custom Buttons or Inputs.
*   **`services/`**: Example service modules for interacting with Firebase.
    *   `firebase.ts`: Illustrative Firebase app initialization for React Native.
    *   `auth.ts`: Authentication-related functions.
    *   `firestore.ts`: Firestore database interaction functions.
*   **`types/`**: TypeScript type definitions, largely reusable from the web application.

## Getting Started with Your React Native Project

1.  **Set up your React Native development environment:** Follow the official React Native documentation for "Environment Setup" (React Native CLI Quickstart).
2.  **Create a new React Native project:** `npx react-native init EduAttendMobile` (or your preferred project name).
3.  **Refer to the `firebase_*.md` guides** in this directory to connect your new mobile app to your existing Firebase project.
4.  **Install necessary dependencies** as outlined in the setup guides (e.g., `@react-native-firebase/app`, `@react-navigation/native`).
5.  **Use the example components and services** in this directory as a foundation for building your app's features.

This guidance aims to provide a solid foundation for porting the EduAttend Parent Portal to native mobile platforms while reusing your robust Firebase backend.
