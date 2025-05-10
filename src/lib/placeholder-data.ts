
import type { User, Child, AttendanceRecord, SchoolNotification, Subject, Assignment, GradeReportEntry, Conversation, Message, SchoolClass, AssignmentSubmission, ChildAssignmentView } from '@/types';
import { format, subDays, addDays, startOfMonth } from 'date-fns';

// --- USERS ---
export const PARENT_MOCK_USER: User = {
  id: 'userParent123',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  avatarUrl: 'https://picsum.photos/100/100?random=parentUser',
  dataAiHint: 'woman smiling',
  role: 'parent',
};

export const TEACHER_MOCK_USER: User = {
  id: 'userTeacher789',
  name: 'Mr. John Smith',
  email: 'john.smith@eduattend.example.com',
  avatarUrl: 'https://picsum.photos/100/100?random=teacherUser',
  dataAiHint: 'man teacher',
  role: 'teacher',
};

// SIMULATE LOGGED IN USER (switch role here to test different flows)
const MOCK_USER_ROLE: 'parent' | 'teacher' = 'parent';
// const MOCK_USER_ROLE: 'parent' | 'teacher' = 'teacher'; // <-- SWITCH HERE TO TEST TEACHER FLOW

export const MOCK_LOGGED_IN_USER = MOCK_USER_ROLE === 'parent' ? PARENT_MOCK_USER : TEACHER_MOCK_USER;

// --- CLASSES ---
export const MOCK_CLASSES: SchoolClass[] = [
  { id: 'classGrade5A', name: 'Grade 5A', teacherId: TEACHER_MOCK_USER.id, studentIds: ['child1', 'child3'] },
  { id: 'classGrade3B', name: 'Grade 3B', teacherId: 'userTeacherABC', studentIds: ['child2'] }, // Another teacher
];

// --- CHILDREN ---
export const MOCK_CHILDREN: Child[] = [
  { id: 'child1', name: 'Alex Johnson', avatarUrl: 'https://picsum.photos/100/100?random=1', dataAiHint: "child boy", currentAttendanceStatus: 'Present', absenceCountThisMonth: 1, gradeLevel: 'Grade 5', classId: 'classGrade5A' },
  { id: 'child2', name: 'Mia Williams', avatarUrl: 'https://picsum.photos/100/100?random=2', dataAiHint: "child girl", currentAttendanceStatus: 'Absent', absenceCountThisMonth: 3, gradeLevel: 'Grade 3', classId: 'classGrade3B' },
  { id: 'child3', name: 'Ethan Brown', avatarUrl: 'https://picsum.photos/100/100?random=3', dataAiHint: "child student", currentAttendanceStatus: 'Present', absenceCountThisMonth: 0, gradeLevel: 'Grade 5', classId: 'classGrade5A' }, // Ethan also in Grade 5A for Mr. Smith
];

// --- SUBJECTS ---
export const MOCK_SUBJECTS: Subject[] = [
  { id: 'subjMath5', name: 'Mathematics - Grade 5', progress: 75, currentTopic: 'Algebra Basics', nextDeadline: format(addDays(new Date(), 7), 'yyyy-MM-dd'), teacherId: TEACHER_MOCK_USER.id, classId: 'classGrade5A' },
  { id: 'subjSci5', name: 'Science - Grade 5', progress: 60, currentTopic: 'Photosynthesis', nextDeadline: format(addDays(new Date(), 10), 'yyyy-MM-dd'), teacherId: TEACHER_MOCK_USER.id, classId: 'classGrade5A' },
  { id: 'subjEng3', name: 'English - Grade 3', progress: 85, currentTopic: 'Story Writing', teacherId: 'userTeacherABC', classId: 'classGrade3B' },
  { id: 'subjHist5', name: 'History - Grade 5', progress: 50, currentTopic: 'Ancient Civilizations', nextDeadline: format(addDays(new Date(), 14), 'yyyy-MM-dd'), teacherId: TEACHER_MOCK_USER.id, classId: 'classGrade5A' },
];


// --- ATTENDANCE RECORDS ---
export const getMockAttendanceRecords = (childId: string): AttendanceRecord[] => {
  const recordsBase: AttendanceRecord[] = [
    { id: 'att1', childId, date: format(new Date(), 'yyyy-MM-dd'), status: childId === 'child2' ? 'Absent' : 'Present', markedBy: TEACHER_MOCK_USER.id },
    { id: 'att2', childId, date: format(subDays(new Date(),1), 'yyyy-MM-dd'), status: 'Present', markedBy: TEACHER_MOCK_USER.id },
    { id: 'att3', childId, date: format(subDays(new Date(),2), 'yyyy-MM-dd'), status: childId === 'child1' ? 'Late' : 'Present', notes: 'Arrived 10 mins late.', markedBy: TEACHER_MOCK_USER.id },
    { id: 'att4', childId, date: format(subDays(new Date(),5), 'yyyy-MM-dd'), status: 'Excused', notes: 'Doctor\'s appointment.', markedBy: 'schoolOffice' },
    { id: 'att5', childId, date: format(startOfMonth(new Date()), 'yyyy-MM-dd'), status: 'Absent', notes: 'Sick leave', markedBy: TEACHER_MOCK_USER.id },
    { id: 'att6', childId, date: format(addDays(startOfMonth(new Date()), 4), 'yyyy-MM-dd'), status: 'Absent', notes: 'Family event', markedBy: 'schoolOffice' },
  ];
  return recordsBase.filter(() => Math.random() > 0.3 * (parseInt(childId.replace('child','')) % 3));
};

// --- NOTIFICATIONS ---
export const MOCK_NOTIFICATIONS: SchoolNotification[] = [
  { id: 'notif1', title: 'Alex Johnson marked absent', date: new Date().toISOString(), content: 'Alex Johnson was marked absent on ' + format(new Date(), 'MMMM dd, yyyy') + '.', type: 'absence', read: false, targetAudience: `user:${PARENT_MOCK_USER.id}` },
  { id: 'notif2', title: 'School Photo Day Reminder', date: addDays(new Date(),2).toISOString(), content: 'Reminder: School Photo Day is this Friday!', type: 'announcement', read: true, targetAudience: 'all' },
  { id: 'notif3', title: 'Parent-Teacher Meeting Schedule', date: subDays(new Date(), 1).toISOString(), content: 'The schedule for upcoming parent-teacher meetings has been released.', type: 'announcement', read: false, targetAudience: 'parents' },
  { id: 'notif4', title: 'Emergency Drill Today', date: new Date().toISOString(), content: 'A fire drill will be conducted at 2 PM today.', type: 'alert', read: false, targetAudience: 'all' },
  { id: 'notif_teacher1', title: 'Staff Meeting Reminder', date: addDays(new Date(),1).toISOString(), content: 'Staff meeting tomorrow at 3 PM in the library.', type: 'announcement', read: false, targetAudience: 'teachers' },
];

// --- ASSIGNMENTS (Class/Subject Level) ---
export const MOCK_ASSIGNMENTS_CLASS: Assignment[] = [
  { id: 'assignClass1', subjectId: 'subjMath5', classId: 'classGrade5A', title: 'Algebra Worksheet 5 (Grade 5A)', dueDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'), description: 'Complete all exercises on page 45.', createdBy: TEACHER_MOCK_USER.id },
  { id: 'assignClass2', subjectId: 'subjSci5', classId: 'classGrade5A', title: 'Plant Cell Diagram (Grade 5A)', dueDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'), description: 'Draw and label a plant cell.', createdBy: TEACHER_MOCK_USER.id },
  { id: 'assignClass3', subjectId: 'subjEng3', classId: 'classGrade3B', title: 'Story Analysis (Grade 3B)', dueDate: format(subDays(new Date(), 2), 'yyyy-MM-dd'), description: 'Analyze the provided short story.', createdBy: 'userTeacherABC' },
  { id: 'assignClassOverdue', subjectId: 'subjHist5', classId: 'classGrade5A', title: 'Ancient Rome Quiz Prep', dueDate: format(subDays(new Date(), 2), 'yyyy-MM-dd'), description: 'Prepare for quiz on Ancient Rome.', createdBy: TEACHER_MOCK_USER.id },
];

// --- ASSIGNMENT SUBMISSIONS (Student Specific) ---
export const MOCK_ASSIGNMENT_SUBMISSIONS: AssignmentSubmission[] = [
    { id: 'sub1', assignmentId: 'assignClass1', studentId: 'child1', isSubmitted: true, submittedDate: format(subDays(new Date(),1), 'yyyy-MM-dd'), grade: 'A-', feedback: 'Good work, Alex!', fileUrl: '#' },
    { id: 'sub2', assignmentId: 'assignClass1', studentId: 'child3', isSubmitted: false }, // Ethan hasn't submitted Algebra
    { id: 'sub3', assignmentId: 'assignClass2', studentId: 'child1', isSubmitted: true, submittedDate: format(new Date(), 'yyyy-MM-dd'), grade: 'B+', feedback: 'Diagram is clear, labels need a bit more detail.' },
    { id: 'sub4', assignmentId: 'assignClass3', studentId: 'child2', isSubmitted: true, submittedDate: format(subDays(new Date(),3), 'yyyy-MM-dd'), grade: 'A', feedback: 'Excellent analysis, Mia!', fileUrl: '#' },
    // Alex has not submitted assignClassOverdue (History)
    { id: 'sub5', assignmentId: 'assignClassOverdue', studentId: 'child3', isSubmitted: true, submittedDate: format(subDays(new Date(),1), 'yyyy-MM-dd'), grade: 'C', feedback: 'Submitted late, please manage time better.' }, // Ethan submitted History late
];


// --- GRADE REPORTS ---
export const getMockGradeReports = (studentId: string): GradeReportEntry[] => [
  { id: 'gr1', studentId, subjectId: 'subjMath5', grade: 'A', teacherFeedback: 'Excellent understanding of concepts. Keep up the great work!', term: 'Term 1', issuedBy: TEACHER_MOCK_USER.id },
  { id: 'gr2', studentId, subjectId: 'subjSci5', grade: 'B+', teacherFeedback: 'Good effort, needs to focus more on practical applications.', term: 'Term 1', issuedBy: TEACHER_MOCK_USER.id },
].filter(gr => MOCK_CHILDREN.find(c => c.id === studentId && c.classId === MOCK_SUBJECTS.find(s => s.id === gr.subjectId)?.classId)); // Basic filter


// --- MESSAGES & CONVERSATIONS ---
const mockTeacher1 = TEACHER_MOCK_USER; // Use Mr. Smith
const mockTeacher2 = { id: 'userTeacherABC', name: 'Ms. Eva Green (Eng Grade 3)', avatarUrl: 'https://picsum.photos/100/100?random=teacher2', dataAiHint: "teacher woman", role: 'teacher' as const };
const mockSchoolOffice = { id: 'schoolOffice', name: 'School Office', avatarUrl: 'https://picsum.photos/100/100?random=office', dataAiHint: "building entrance", role: 'teacher' as const }; // Role could be 'admin' or similar

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'convParentTeacher1',
    participantIds: [PARENT_MOCK_USER.id, mockTeacher1.id],
    participantDetails: {
        [PARENT_MOCK_USER.id]: { name: PARENT_MOCK_USER.name, avatarUrl: PARENT_MOCK_USER.avatarUrl, role: 'parent' },
        [mockTeacher1.id]: { name: mockTeacher1.name, avatarUrl: mockTeacher1.avatarUrl, role: 'teacher' },
    },
    lastMessagePreview: 'Yes, Alex can get an extension on the homework.',
    lastMessageTimestamp: subDays(new Date(),1).toISOString(),
    unreadCounts: { [PARENT_MOCK_USER.id]: 1 },
    messages: [
      { id: 'msg1', conversationId: 'convParentTeacher1', senderId: mockTeacher1.id, senderName: mockTeacher1.name, avatarUrl: mockTeacher1.avatarUrl, dataAiHint: mockTeacher1.dataAiHint, timestamp: subDays(new Date(),1).toISOString(), text: 'Hello, I wanted to discuss Alex\'s progress.', isOwnMessage: false },
      { id: 'msg2', conversationId: 'convParentTeacher1', senderId: PARENT_MOCK_USER.id, senderName: PARENT_MOCK_USER.name, avatarUrl: PARENT_MOCK_USER.avatarUrl, dataAiHint: PARENT_MOCK_USER.dataAiHint, timestamp: subDays(new Date(),1).toISOString(), text: 'Hi Mr. Smith, sure. Also, could Alex get an extension for the math homework due tomorrow?', isOwnMessage: true },
      { id: 'msg3', conversationId: 'convParentTeacher1', senderId: mockTeacher1.id, senderName: mockTeacher1.name, avatarUrl: mockTeacher1.avatarUrl, dataAiHint: mockTeacher1.dataAiHint, timestamp: subDays(new Date(),1).toISOString(), text: 'Yes, Alex can get an extension on the homework. Please submit it by Friday.', isOwnMessage: false },
    ],
  },
  // Add more conversations
];

// --- UTILITY FUNCTIONS to get data based on context ---
export const getMockChildById = (childId: string): Child | undefined => {
  return MOCK_CHILDREN.find(c => c.id === childId);
};

export const getMockSubjectsForChild = (childId: string): Subject[] => {
  const child = getMockChildById(childId);
  if (!child || !child.classId) return [];
  return MOCK_SUBJECTS.filter(s => s.classId === child.classId);
};

export const getMockSubjectsForTeacher = (teacherId: string): Subject[] => {
  return MOCK_SUBJECTS.filter(s => s.teacherId === teacherId);
};

export const getMockClassesForTeacher = (teacherId: string): SchoolClass[] => {
  return MOCK_CLASSES.filter(c => c.teacherId === teacherId);
};

export const getMockAssignmentsForClass = (classId: string): Assignment[] => {
    return MOCK_ASSIGNMENTS_CLASS.filter(a => a.classId === classId);
};

export const getMockAssignmentsForChild = (childId: string): ChildAssignmentView[] => {
  const child = getMockChildById(childId);
  if (!child || !child.classId) {
    return []; // No child or child not in a class
  }

  const classAssignments = getMockAssignmentsForClass(child.classId);
  const childSubmissions = MOCK_ASSIGNMENT_SUBMISSIONS.filter(sub => sub.studentId === childId);

  return classAssignments.map(classAssign => {
    const submission = childSubmissions.find(sub => sub.assignmentId === classAssign.id);
    const subjectDetails = MOCK_SUBJECTS.find(s => s.id === classAssign.subjectId);

    return {
      ...classAssign,
      subjectName: subjectDetails?.name || 'Unknown Subject',
      submitted: submission?.isSubmitted || false,
      grade: submission?.grade,
      submittedDate: submission?.submittedDate,
      fileUrl: submission?.fileUrl,
    };
  });
};

export const getMockAssignmentSubmissionsForAssignment = (assignmentId: string): AssignmentSubmission[] => {
    return MOCK_ASSIGNMENT_SUBMISSIONS.filter(s => s.assignmentId === assignmentId);
};

export const getMockAssignmentSubmissionsForStudent = (studentId: string, assignmentId: string): AssignmentSubmission | undefined => {
    return MOCK_ASSIGNMENT_SUBMISSIONS.find(s => s.studentId === studentId && s.assignmentId === assignmentId);
};
