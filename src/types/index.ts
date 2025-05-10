
export interface User {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  dataAiHint?: string;
  role: 'parent' | 'teacher'; // Added role
}

export interface Child {
  id: string;
  name: string;
  avatarUrl?: string;
  dataAiHint?: string;
  currentAttendanceStatus?: 'Present' | 'Absent' | 'Late';
  absenceCountThisMonth?: number;
  gradeLevel?: string;
  classId?: string; // Added classId to link child to a class
}

export interface SchoolClass { // New interface for classes
  id: string;
  name: string; // e.g., "Grade 5A", "Mr. Smith's Math Class"
  teacherId: string; // Link to the teacher responsible for this class
  studentIds: string[]; // List of child/student IDs in this class
  subjectIds?: string[]; // Optional: if a class is specific to certain subjects taught by this teacher
}

export interface AttendanceRecord {
  id: string;
  childId: string; // Keep this for direct lookup
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  notes?: string;
  markedBy?: string; // Teacher ID who marked attendance
}

export interface SchoolNotification {
  id: string;
  title: string;
  date: string; // ISO string
  content: string;
  type: 'absence' | 'announcement' | 'alert';
  read: boolean;
  targetAudience?: 'all' | 'parents' | 'teachers' | `class:${string}` | `user:${string}`; // For targeted notifications
}

export interface Subject {
  id: string;
  name: string;
  progress: number; // 0-100
  currentTopic: string;
  nextDeadline?: string; // YYYY-MM-DD
  teacherId: string; // Added teacherId
  // childId?: string; // Subjects might be class-level, not per-child for syllabus tracking by teacher
  classId?: string; // Associate subject with a class
}

export interface Assignment {
  id: string;
  subjectId: string; // Link to subject
  classId?: string; // Link to class if assignment is class-wide
  title: string;
  dueDate: string; // YYYY-MM-DD
  description: string;
  createdBy: string; // teacherId
}

// New type for student submissions if needed
export interface AssignmentSubmission {
    id: string;
    assignmentId: string;
    studentId: string;
    submittedDate?: string;
    isSubmitted: boolean;
    grade?: string;
    feedback?: string;
    fileUrl?: string;
}

export interface ChildAssignmentView extends Assignment {
  subjectName: string; // Resolved subject name
  submitted: boolean;
  grade?: string;
  submittedDate?: string; // from AssignmentSubmission
  fileUrl?: string; // from AssignmentSubmission
  // Any other fields from AssignmentSubmission that AssignmentItem might need
}


export interface GradeReportEntry {
    id: string;
    studentId: string; // Renamed from childId for clarity
    subjectId: string;
    grade: string; // e.g., "A+", "85%"
    teacherFeedback: string;
    term: string; // e.g., "Term 1", "Semester 2"
    issuedBy: string; // teacherId
}

export interface Message {
    id: string;
    senderId: string; // 'user' or teacher's ID
    senderName: string;
    avatarUrl?: string;
    dataAiHint?: string;
    timestamp: string; // ISO string
    text: string;
    isOwnMessage: boolean; // Relative to the viewing user
    conversationId: string;
}

export interface Conversation {
    id: string;
    // Participants can be a mix of parents and teachers
    participantIds: string[]; 
    participantDetails: { // Store basic info for display
        [userId: string]: { name: string; avatarUrl?: string; role: 'parent' | 'teacher' };
    };
    lastMessagePreview: string;
    lastMessageTimestamp: string; // ISO string
    // Unread counts per user in the conversation
    unreadCounts?: { [userId: string]: number }; 
    messages: Message[]; // This might be better as a subcollection in Firestore
    // For direct teacher-parent or teacher-class channels
    type?: 'direct' | 'class_announcement'; 
    className?: string; // if type is class_announcement
}
