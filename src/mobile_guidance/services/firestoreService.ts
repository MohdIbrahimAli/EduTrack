
// src/mobile_guidance/services/firestoreService.ts
import { firebaseFirestore, firebaseAuth } from '../config/firebase';
import type { Child, AttendanceRecord, AbsenceReportData, User } from '../types';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const USERS_COLLECTION = 'users';
const CHILDREN_COLLECTION = 'children';
const ATTENDANCE_COLLECTION = 'attendanceRecords';
const ABSENCE_REPORTS_COLLECTION = 'absenceReports';

// --- User Profile ---
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const doc = await firebaseFirestore.collection(USERS_COLLECTION).doc(userId).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<void> => {
  try {
    await firebaseFirestore.collection(USERS_COLLECTION).doc(userId).update(data);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// --- Children Data ---
export const getChildrenForParent = (
  parentId: string,
  onResult: (children: Child[]) => void,
  onError: (error: Error) => void
): (() => void) => { // Returns an unsubscribe function
  return firebaseFirestore
    .collection(CHILDREN_COLLECTION)
    .where('parentUid', '==', parentId)
    .onSnapshot(
      (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
        const children: Child[] = [];
        querySnapshot.forEach((doc: FirebaseFirestoreTypes.DocumentSnapshot) => {
          children.push({ id: doc.id, ...doc.data() } as Child);
        });
        onResult(children);
      },
      (error: Error) => {
        console.error("Error fetching children:", error);
        onError(error);
      }
    );
};

// --- Attendance Records ---
export const getAttendanceRecordsForChild = (
  childId: string,
  onResult: (records: AttendanceRecord[]) => void,
  onError: (error: Error) => void,
  limit: number = 30 // Default to fetching last 30 records
): (() => void) => {
  return firebaseFirestore
    .collection(ATTENDANCE_COLLECTION)
    .where('childId', '==', childId)
    .orderBy('date', 'desc')
    .limit(limit)
    .onSnapshot(
      (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
        const records: AttendanceRecord[] = [];
        querySnapshot.forEach((doc: FirebaseFirestoreTypes.DocumentSnapshot) => {
          records.push({ id: doc.id, ...doc.data() } as AttendanceRecord);
        });
        onResult(records);
      },
      (error: Error) => {
        console.error("Error fetching attendance records:", error);
        onError(error);
      }
    );
};

// --- Absence Reports ---
export const submitAbsenceReport = async (reportData: Omit<AbsenceReportData, 'submittedAt' | 'parentUid'>): Promise<string> => {
  const currentUser = firebaseAuth.currentUser;
  if (!currentUser) {
    throw new Error("User not authenticated to submit absence report.");
  }

  const dataToSave: AbsenceReportData = {
    ...reportData,
    parentUid: currentUser.uid,
    submittedAt: new Date().toISOString(),
    status: 'Pending', // Initial status
  };

  try {
    const docRef = await firebaseFirestore.collection(ABSENCE_REPORTS_COLLECTION).add(dataToSave);
    return docRef.id; // Return the ID of the newly created report
  } catch (error) {
    console.error("Error submitting absence report:", error);
    throw error;
  }
};

export const getAbsenceReportsForParent = (
  parentId: string,
  onResult: (reports: AbsenceReportData[]) => void,
  onError: (error: Error) => void
): (() => void) => {
  return firebaseFirestore
    .collection(ABSENCE_REPORTS_COLLECTION)
    .where('parentUid', '==', parentId)
    .orderBy('submittedAt', 'desc')
    .onSnapshot(
      (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
        const reports: AbsenceReportData[] = [];
        querySnapshot.forEach((doc: FirebaseFirestoreTypes.DocumentSnapshot) => {
          reports.push({ id: doc.id, ...doc.data() } as AbsenceReportData);
        });
        onResult(reports);
      },
      (error: Error) => {
        console.error("Error fetching absence reports:", error);
        onError(error);
      }
    );
};

// Add other Firestore interaction functions as needed for:
// - Syllabus
// - Assignments
// - Progress Reports
// - Messages/Conversations
// - Notifications (e.g., storing user's FCM token, marking notifications as read)

export const storeFCMToken = async (userId: string, token: string): Promise<void> => {
  try {
    await firebaseFirestore.collection(USERS_COLLECTION).doc(userId).set({
      fcmToken: token,
      lastFCMTokenUpdate: new Date().toISOString(),
    }, { merge: true }); // Use merge to not overwrite other user data
  } catch (error) {
    console.error("Error storing FCM token:", error);
    // Don't throw, as this might be a background task
  }
};
