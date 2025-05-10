
export interface Child {
  id: string;
  name: string;
  avatarUrl?: string;
  dataAiHint?: string;
  currentAttendanceStatus?: 'Present' | 'Absent' | 'Late';
  absenceCountThisMonth?: number;
  gradeLevel?: string;
}

export interface User { // Added User interface based on MOCK_USER
  id: string;
  name: string;
  email?: string; // Optional email
  avatarUrl?: string;
  dataAiHint?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  notes?: string;
}

export interface SchoolNotification {
  id: string;
  title: string;
  date: string; // ISO string
  content: string;
  type: 'absence' | 'announcement' | 'alert';
  read: boolean;
}

export interface Subject {
  id: string;
  name: string;
  progress: number; // 0-100
  currentTopic: string;
  nextDeadline?: string; // YYYY-MM-DD
  teacherName?: string;
}

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  description: string;
  submitted: boolean;
  grade?: string;
}

export interface GradeReportEntry {
    id: string;
    subject: string;
    grade: string; // e.g., "A+", "85%"
    teacherFeedback: string;
    term: string; // e.g., "Term 1", "Semester 2"
}

export interface Message {
    id: string;
    senderId: string; // 'user' or teacher's ID
    senderName: string;
    avatarUrl?: string;
    dataAiHint?: string;
    timestamp: string; // ISO string
    text: string;
    isOwnMessage: boolean;
}

export interface Conversation {
    id: string;
    teacherId: string; // Can also be a generic ID like 'schoolOffice'
    teacherName: string;
    teacherAvatarUrl?: string;
    dataAiHint?: string;
    lastMessagePreview: string;
    lastMessageTimestamp: string; // ISO string
    unreadCount: number;
    messages: Message[];
}
