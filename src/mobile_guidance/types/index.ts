
// Reusing types from the web application for consistency.
// These can be adapted or extended if mobile-specific variations are needed.

export interface User {
  id: string;
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  dataAiHint?: string; // For web compatibility, might not be directly used in RN Image
  // Mobile-specific fields can be added here, e.g., fcmToken
  fcmToken?: string;
}

export interface Child {
  id: string;
  name: string;
  avatarUrl?: string;
  dataAiHint?: string; // For web compatibility
  currentAttendanceStatus?: 'Present' | 'Absent' | 'Late';
  absenceCountThisMonth?: number;
  gradeLevel?: string;
  // Field to link child to parent
  parentUid?: string;
}

export interface AttendanceRecord {
  id: string;
  childId: string; // Link to child
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  notes?: string;
  recordedBy?: string; // e.g., school staff ID
}

export interface SchoolNotification {
  id: string;
  title: string;
  date: string; // ISO string
  content: string;
  type: 'absence' | 'announcement' | 'alert' | 'message'; // Added 'message' type
  read: boolean;
  // Optional fields for navigation or context
  linkTo?: string; // e.g., screen name
  linkParams?: Record<string, any>; // e.g., { childId: '123' }
}

export interface Subject {
  id: string;
  childId: string;
  name: string;
  progress: number; // 0-100
  currentTopic: string;
  nextDeadline?: string; // YYYY-MM-DD
  teacherName?: string;
}

export interface Assignment {
  id: string;
  childId: string;
  subject: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  description: string;
  submitted: boolean;
  grade?: string;
  attachmentUrl?: string;
}

export interface GradeReportEntry {
  id: string;
  childId: string;
  subject: string;
  grade: string; // e.g., "A+", "85%"
  teacherFeedback: string;
  term: string; // e.g., "Term 1", "Semester 2"
}

export interface Message {
  id: string; // or _id for gifted chat
  text: string;
  createdAt: string | number | Date; // ISO string or Timestamp
  user: {
    _id: string; // senderId
    name?: string;
    avatar?: string;
  };
  // Additional fields if needed
  image?: string;
  video?: string;
  audio?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
}

export interface Conversation {
  id: string; // Typically concatenation of user IDs or a unique ID
  participants: string[]; // Array of user IDs (e.g., [parentId, teacherId])
  participantDetails: {
    [userId: string]: {
      name: string;
      avatarUrl?: string;
    };
  };
  lastMessage?: {
    text: string;
    timestamp: string; // ISO string
    senderId: string;
  };
  unreadCount?: {
    [userId: string]: number; // Unread count for each participant
  };
  // Timestamps
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// For absence reporting form
export interface AbsenceReportData {
  childId: string;
  childName: string; // For convenience, though childId is the key
  date: string; // YYYY-MM-DD
  reason: string;
  additionalDetails?: string;
  attachmentUrl?: string; // URL from Firebase Storage
  parentUid: string; // UID of the reporting parent
  status?: 'Pending' | 'Approved' | 'Rejected'; // For school to update
  submittedAt: string; // ISO timestamp
}
