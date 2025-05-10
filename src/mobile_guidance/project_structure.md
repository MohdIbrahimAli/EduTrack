
# React Native Project Structure for EduAttend Mobile

This document outlines a recommended project structure for your React Native mobile application. This structure promotes organization, scalability, and maintainability.

```
/EduAttendMobile  (Your React Native project root)
  ├── android/                  // Android native project files
  ├── ios/                    // iOS native project files
  ├── src/                    // Main application source code
  │   ├── assets/               // Static assets
  │   │   ├── fonts/
  │   │   └── images/
  │   ├── components/           // Reusable UI components
  │   │   ├── common/           // Generic components (Button, Input, Card, etc.)
  │   │   │   ├── Button.tsx
  │   │   │   ├── Input.tsx
  │   │   │   └── LoadingIndicator.tsx
  │   │   ├── ChildListItem.tsx
  │   │   ├── AttendanceCalendar.tsx // (Could be simplified initially)
  │   │   └── ...               // Other domain-specific components
  │   ├── config/               // Application configuration
  │   │   └── firebase.ts       // Firebase initialization and exported modules
  │   ├── hooks/                // Custom React Hooks
  │   │   └── useAuth.ts
  │   ├── navigation/           // Navigation setup (React Navigation)
  │   │   ├── AppNavigator.tsx    // Main app navigator (after login)
  │   │   ├── AuthNavigator.tsx   // Authentication flow navigator
  │   │   └── types.ts          // Navigation-specific types
  │   ├── screens/              // Top-level screen components
  │   │   ├── Auth/
  │   │   │   └── LoginScreen.tsx
  │   │   ├── Dashboard/
  │   │   │   └── DashboardScreen.tsx
  │   │   ├── Attendance/
  │   │   │   └── AttendanceDetailScreen.tsx
  │   │   ├── ReportAbsence/
  │   │   │   └── ReportAbsenceScreen.tsx
  │   │   ├── Notifications/
  │   │   │   └── NotificationsScreen.tsx
  │   │   ├── Messages/
  │   │   │   └── MessagesScreen.tsx
  │   │   └── ...               // Other screens
  │   ├── services/             // Business logic, API calls, Firebase interactions
  │   │   ├── authService.ts
  │   │   ├── firestoreService.ts
  │   │   ├── fcmService.ts
  │   │   └── storageService.ts
  │   ├── store/                // State management (e.g., Zustand, Redux, Context API)
  │   │   ├── authStore.ts
  │   │   └── ...
  │   ├── theme/                // Global styling, color palette
  │   │   ├── colors.ts
  │   │   ├── typography.ts
  │   │   └── styles.ts           // Global styles or helpers
  │   ├── types/                // TypeScript type definitions
  │   │   └── index.ts            // (Can reuse/adapt from web app)
  │   └── utils/                // Utility functions
  ├── App.tsx                   // Root component of the application
  ├── index.js                  // Entry point of the application
  ├── babel.config.js
  ├── metro.config.js
  ├── package.json
  ├── tsconfig.json
  ├── Gemfile (for iOS Cocoapods)
  ├── Gemfile.lock
  └── firebase.json             // For @react-native-firebase configuration
```

## Explanation of Key Directories:

*   **`android/` & `ios/`**: Contain the native Android and iOS project files. You'll occasionally modify files here for specific native configurations (e.g., permissions, build settings).
*   **`src/`**: This is where most of your application code will reside.
    *   **`assets/`**: For static files like images, fonts, etc.
    *   **`components/`**: Shared, reusable UI components.
        *   `common/`: General-purpose components that can be used across multiple screens.
    *   **`config/`**: Application-wide configurations. `firebase.ts` here is responsible for initializing Firebase and exporting instances of Firebase services.
    *   **`hooks/`**: Custom React Hooks to encapsulate reusable logic (e.g., `useAuth` for auth state).
    *   **`navigation/`**: Contains all navigation-related code, typically using a library like React Navigation (`@react-navigation/native`). This includes defining stack, tab, and drawer navigators.
    *   **`screens/`**: Each screen of your app. Often grouped by feature or flow.
    *   **`services/`**: Modules that handle external interactions, like API calls or Firebase operations. This separates business logic from UI components.
    *   **`store/`**: If you use a global state management library (Zustand, Redux, etc.) or complex Context API setups, this is where the store, reducers, actions, and selectors would live.
    *   **`theme/`**: Global styles, color palettes, typography definitions. This helps maintain a consistent look and feel.
    *   **`types/`**: TypeScript interfaces and type definitions. You can likely reuse many types from your existing web application.
    *   **`utils/`**: Helper functions that don't fit into other categories.
*   **`App.tsx`**: The root React component that usually sets up providers (like navigation, state management, theme) and renders the main navigator.
*   **`index.js`**: The entry point registered with React Native.
*   **`firebase.json`**: Used by `@react-native-firebase` to configure native Firebase SDKs during the build process.

This structure provides a good separation of concerns and should scale well as your EduAttend mobile application grows. Remember to adapt it to your specific needs and preferences.
