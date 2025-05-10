
# Firebase Storage Setup for React Native (EduAttend Mobile)

This guide outlines how to integrate Firebase Storage into your React Native application, allowing users to upload files (e.g., attachments for absence reports). This assumes you have completed the [Firebase Core Setup](./firebase_core_setup.md).

## 1. Install Storage Module

Install the `@react-native-firebase/storage` package:
```bash
# Using npm
npm install @react-native-firebase/storage

# Using yarn
yarn add @react-native-firebase/storage
```

If you are on iOS, run `pod install` again:
```bash
cd ios
pod install
cd ..
```

## 2. Firebase Storage Rules

Configure your Firebase Storage security rules in the Firebase console to control who can read and write files.

Example rules (restrict uploads to authenticated users and specific paths):
```storage-rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Match files for absence report attachments
    // Allow authenticated users to upload to their own folder or a specific path
    match /absence_attachments/{userId}/{fileName} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId &&
                       request.resource.size < 5 * 1024 * 1024 && // Max 5MB
                       request.resource.contentType.matches('image/.*|application/pdf'); // Allow images and PDFs
    }

    // Add other rules as needed for other types of file uploads
  }
}
```
**Important:** Adjust these rules to your specific application needs, especially regarding paths, file types, and size limits.

## 3. Using Firebase Storage in Your App

You can use the `firebaseStorage` instance (exported from your `src/config/firebase.ts` or imported directly from `@react-native-firebase/storage`).

To upload files, you'll typically use a document picker or image picker library to get the file path on the device.

### Example: Uploading a File

You'll need a library to pick files from the device, for example, `react-native-document-picker` or `react-native-image-picker`.

```typescript
// src/services/storageService.ts (Example)
import storage from '@react-native-firebase/storage';
import { firebaseAuth } from '../config/firebase'; // Assuming you export auth instance

// Function to upload a file for an absence report
export async function uploadAbsenceAttachment(filePath: string, fileName: string): Promise<string | null> {
  const user = firebaseAuth.currentUser;
  if (!user) {
    console.error("No user signed in to upload file.");
    return null;
  }

  const reference = storage().ref(`absence_attachments/${user.uid}/${fileName}`);

  try {
    // Upload file
    const task = reference.putFile(filePath);

    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );
    });

    await task; // Wait for upload to complete

    // Get download URL
    const downloadURL = await reference.getDownloadURL();
    console.log('File available at', downloadURL);
    return downloadURL;

  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}
```

### Example Usage with a Document Picker:

First, install a picker, e.g., `react-native-document-picker`:
```bash
yarn add react-native-document-picker
# or npm install react-native-document-picker
cd ios && pod install && cd .. # for iOS
```
Make sure to follow its own setup instructions (permissions, etc.).

Then, in your component (e.g., `ReportAbsenceScreen.tsx`):
```typescript
// In your ReportAbsenceScreen.tsx or similar
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { uploadAbsenceAttachment } from '../services/storageService'; // Adjust path

// ...

const handlePickAndUploadDocument = async () => {
  try {
    const pickerResult: DocumentPickerResponse[] = await DocumentPicker.pick({
      presentationStyle: 'fullScreen',
      copyTo: 'cachesDirectory', // Recommended for `putFile`
      type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
    });

    if (pickerResult && pickerResult.length > 0) {
      const file = pickerResult[0];
      const filePath = file.fileCopyUri; // URI to the local file copy
      const fileName = file.name || `attachment_${Date.now()}`;

      if (!filePath) {
          console.error("File path is missing from picker result.");
          // Show error to user
          return;
      }

      // Show loading indicator
      const downloadURL = await uploadAbsenceAttachment(filePath, fileName);
      // Hide loading indicator

      if (downloadURL) {
        console.log('Uploaded attachment URL:', downloadURL);
        // Save this URL to Firestore along with the absence report
        // setAttachmentUrl(downloadURL);
      } else {
        // Handle upload error (e.g., show a message to the user)
      }
    }
  } catch (e) {
    if (DocumentPicker.isCancel(e)) {
      console.log('User cancelled document picker');
    } else {
      console.error('Error picking document:', e);
      // Handle other errors
    }
  }
};

// ... render a button that calls handlePickAndUploadDocument
```

## 4. Permissions

### Android:
*   Ensure you have `READ_EXTERNAL_STORAGE` (and potentially `WRITE_EXTERNAL_STORAGE` for older Android versions if not using `fileCopyUri`) permissions in your `AndroidManifest.xml` if your picker library requires them.
    ```xml
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <!-- For Android 10 (API level 29) and lower, if you need to write -->
    <!-- <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" /> -->
    ```
*   You'll also need to request these permissions at runtime using `PermissionsAndroid` from `react-native` or let the picker library handle it.

### iOS:
*   For accessing photos, add keys to your `Info.plist`:
    *   `NSPhotoLibraryUsageDescription` (Privacy - Photo Library Usage Description): Explain why your app needs access.
*   For accessing files from the Files app, no specific permission key is generally needed for `UIDocumentPickerViewController` (which `react-native-document-picker` uses), as the user explicitly grants access through the picker UI.

## 5. Displaying Images from Firebase Storage

To display an image stored in Firebase Storage, you get its download URL (as shown in the upload example) and then use it as the `uri` source for React Native's `Image` component:
```tsx
import { Image, StyleSheet } from 'react-native';

// Assuming 'imageDownloadUrl' is the URL obtained from storage.getDownloadURL()
// <Image source={{ uri: imageDownloadUrl }} style={styles.imageStyle} />

// const styles = StyleSheet.create({
//   imageStyle: {
//     width: 100,
//     height: 100,
//   },
// });
```

After setting up Firebase Storage and any necessary picker libraries, rebuild your application.
This setup allows your EduAttend mobile app to handle file uploads, which is useful for features like attaching medical notes to absence reports.
