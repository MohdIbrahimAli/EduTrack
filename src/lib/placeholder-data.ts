import type { User, Child, AttendanceRecord, SchoolNotification, Subject, Assignment, GradeReportEntry, Conversation, Message, SchoolClass, AssignmentSubmission, ChildAssignmentView } from '@/types';
import { format, subDays, addDays, startOfMonth, parseISO } from 'date-fns';

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

export const OTHER_TEACHER_MOCK_USER: User = {
  id: 'userTeacherABC',
  name: 'Ms. Eva Green',
  email: 'eva.green@example.com',
  avatarUrl: 'https://picsum.photos/100/100?random=teacher2',
  dataAiHint: 'teacher woman',
  role: 'teacher',
}

// --- CLASSES ---
export let MOCK_CLASSES: SchoolClass[] = [
  { id: 'classGrade5A', name: 'Grade 5A', teacherId: TEACHER_MOCK_USER.id, studentIds: ['child1', 'child3'] },
  { id: 'classGrade3B', name: 'Grade 3B', teacherId: OTHER_TEACHER_MOCK_USER.id, studentIds: ['child2'] },
];

// --- CHILDREN ---
export let MOCK_CHILDREN: Child[] = [
  { id: 'child1', name: 'Alex Johnson', avatarUrl: 'https://picsum.photos/100/100?random=1', dataAiHint: "child boy", currentAttendanceStatus: 'Present', absenceCountThisMonth: 1, gradeLevel: 'Grade 5', classId: 'classGrade5A', parentUid: PARENT_MOCK_USER.id },
  { id: 'child2', name: 'Mia Williams', avatarUrl: 'https://picsum.photos/100/100?random=2', dataAiHint: "child girl", currentAttendanceStatus: 'Absent', absenceCountThisMonth: 3, gradeLevel: 'Grade 3', classId: 'classGrade3B', parentUid: PARENT_MOCK_USER.id },
  { id: 'child3', name: 'Ethan Brown', avatarUrl: 'https://picsum.photos/100/100?random=3', dataAiHint: "child student", currentAttendanceStatus: 'Present', absenceCountThisMonth: 0, gradeLevel: 'Grade 5', classId: 'classGrade5A', parentUid: PARENT_MOCK_USER.id },
];

// --- SUBJECTS ---
export let MOCK_SUBJECTS: Subject[] = [
  { id: 'subjMath5', name: 'Mathematics - Grade 5', progress: 75, currentTopic: 'Algebra Basics', nextDeadline: format(addDays(new Date(), 7), 'yyyy-MM-dd'), teacherId: TEACHER_MOCK_USER.id, classId: 'classGrade5A' },
  { id: 'subjSci5', name: 'Science - Grade 5', progress: 60, currentTopic: 'Photosynthesis', nextDeadline: format(addDays(new Date(), 10), 'yyyy-MM-dd'), teacherId: TEACHER_MOCK_USER.id, classId: 'classGrade5A' },
  { id: 'subjEng3', name: 'English - Grade 3', progress: 85, currentTopic: 'Story Writing', teacherId: OTHER_TEACHER_MOCK_USER.id, classId: 'classGrade3B' },
  { id: 'subjHist5', name: 'History - Grade 5', progress: 50, currentTopic: 'Ancient Civilizations', nextDeadline: format(addDays(new Date(), 14), 'yyyy-MM-dd'), teacherId: TEACHER_MOCK_USER.id, classId: 'classGrade5A' },
];


// --- ATTENDANCE RECORDS ---
let ALL_MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [
    { id: 'att1-child1', childId: 'child1', date: format(new Date(), 'yyyy-MM-dd'), status: 'Present', markedBy: TEACHER_MOCK_USER.id },
    { id: 'att2-child1', childId: 'child1', date: format(subDays(new Date(),1), 'yyyy-MM-dd'), status: 'Present', markedBy: TEACHER_MOCK_USER.id },
    { id: 'att3-child1', childId: 'child1', date: format(subDays(new Date(),2), 'yyyy-MM-dd'), status: 'Late', notes: 'Arrived 10 mins late.', markedBy: TEACHER_MOCK_USER.id },
    { id: 'att4-child1', childId: 'child1', date: format(subDays(new Date(),5), 'yyyy-MM-dd'), status: 'Excused', notes: 'Doctor\'s appointment.', markedBy: 'schoolOffice' },
    
    { id: 'att1-child2', childId: 'child2', date: format(new Date(), 'yyyy-MM-dd'), status: 'Absent', notes: 'Feeling unwell', markedBy: OTHER_TEACHER_MOCK_USER.id },
    { id: 'att2-child2', childId: 'child2', date: format(subDays(new Date(),1), 'yyyy-MM-dd'), status: 'Present', markedBy: OTHER_TEACHER_MOCK_USER.id },
    { id: 'att5-child2', childId: 'child2', date: format(startOfMonth(new Date()), 'yyyy-MM-dd'), status: 'Absent', notes: 'Sick leave', markedBy: OTHER_TEACHER_MOCK_USER.id },

    { id: 'att1-child3', childId: 'child3', date: format(new Date(), 'yyyy-MM-dd'), status: 'Present', markedBy: TEACHER_MOCK_USER.id },
];

export const getMockAttendanceRecords = (childId: string): AttendanceRecord[] => {
  return ALL_MOCK_ATTENDANCE_RECORDS.filter(r => r.childId === childId).map(r => ({...r})).sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
};

export function addOrUpdateMockAttendanceRecord(childId: string, date: string, status: AttendanceRecord['status'], notes?: string, markedBy?: string) {
  const existingRecordIndex = ALL_MOCK_ATTENDANCE_RECORDS.findIndex(
    record => record.childId === childId && record.date === date
  );

  const child = getMockChildById(childId);
  if (child && date === format(new Date(), 'yyyy-MM-dd')) {
    child.currentAttendanceStatus = status;
    // Crude update to absenceCountThisMonth for demo
    if (status === 'Absent' || status === 'Late') {
         const monthStart = startOfMonth(new Date());
         const absencesThisMonth = ALL_MOCK_ATTENDANCE_RECORDS.filter(r => r.childId === childId && (r.status === 'Absent' || r.status === 'Late') && parseISO(r.date) >= monthStart).length;
         child.absenceCountThisMonth = absencesThisMonth + (existingRecordIndex === -1 ? 1 : 0); // Add 1 if it's a new absence today
    }
  }


  if (existingRecordIndex > -1) {
    ALL_MOCK_ATTENDANCE_RECORDS[existingRecordIndex] = {
      ...ALL_MOCK_ATTENDANCE_RECORDS[existingRecordIndex],
      status,
      notes: notes || ALL_MOCK_ATTENDANCE_RECORDS[existingRecordIndex].notes,
      markedBy: markedBy || ALL_MOCK_ATTENDANCE_RECORDS[existingRecordIndex].markedBy,
    };
  } else {
    const newRecord: AttendanceRecord = {
      id: `attNew-${Date.now()}-${childId}`,
      childId,
      date,
      status,
      notes,
      markedBy: markedBy || 'teacherUnknown',
    };
    ALL_MOCK_ATTENDANCE_RECORDS.push(newRecord);
  }
}


// --- NOTIFICATIONS ---
export let MOCK_NOTIFICATIONS: SchoolNotification[] = [
  { id: 'notif1', title: 'Alex Johnson marked absent', date: new Date().toISOString(), content: 'Alex Johnson was marked absent on ' + format(new Date(), 'MMMM dd, yyyy') + '.', type: 'absence', read: false, targetAudience: `user:${PARENT_MOCK_USER.id}` },
  { id: 'notif2', title: 'School Photo Day Reminder', date: addDays(new Date(),2).toISOString(), content: 'Reminder: School Photo Day is this Friday!', type: 'announcement', read: true, targetAudience: 'all' },
  { id: 'notif3', title: 'Parent-Teacher Meeting Schedule', date: subDays(new Date(), 1).toISOString(), content: 'The schedule for upcoming parent-teacher meetings has been released.', type: 'announcement', read: false, targetAudience: 'parents' },
  { id: 'notif4', title: 'Emergency Drill Today', date: new Date().toISOString(), content: 'A fire drill will be conducted at 2 PM today.', type: 'alert', read: false, targetAudience: 'all' },
  { id: 'notif_teacher1', title: 'Staff Meeting Reminder', date: addDays(new Date(),1).toISOString(), content: 'Staff meeting tomorrow at 3 PM in the library.', type: 'announcement', read: false, targetAudience: 'teachers' },
];

export function addMockNotification(notification: Omit<SchoolNotification, 'id' | 'date' | 'read'>): SchoolNotification {
  const newNotification: SchoolNotification = {
    ...notification,
    id: `notif-${Date.now()}`,
    date: new Date().toISOString(),
    read: false,
  };
  MOCK_NOTIFICATIONS.unshift(newNotification); // Add to the beginning
  return newNotification;
}


// --- ASSIGNMENTS (Class/Subject Level) ---
export let MOCK_ASSIGNMENTS_CLASS: Assignment[] = [
  { id: 'assignClass1', subjectId: 'subjMath5', classId: 'classGrade5A', title: 'Algebra Worksheet 5 (Grade 5A)', dueDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'), description: 'Complete all exercises on page 45.', createdBy: TEACHER_MOCK_USER.id },
  { id: 'assignClass2', subjectId: 'subjSci5', classId: 'classGrade5A', title: 'Plant Cell Diagram (Grade 5A)', dueDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'), description: 'Draw and label a plant cell.', createdBy: TEACHER_MOCK_USER.id },
  { id: 'assignClass3', subjectId: 'subjEng3', classId: 'classGrade3B', title: 'Story Analysis (Grade 3B)', dueDate: format(subDays(new Date(), 2), 'yyyy-MM-dd'), description: 'Analyze the provided short story.', createdBy: OTHER_TEACHER_MOCK_USER.id },
  { id: 'assignClassOverdue', subjectId: 'subjHist5', classId: 'classGrade5A', title: 'Ancient Rome Quiz Prep', dueDate: format(subDays(new Date(), 2), 'yyyy-MM-dd'), description: 'Prepare for quiz on Ancient Rome.', createdBy: TEACHER_MOCK_USER.id },
];

export function addOrUpdateMockAssignment(classId: string, assignment: Omit<Assignment, 'id' | 'createdBy'> & { id?: string }, teacherId: string): Assignment {
    let savedAssignment: Assignment;
    if (assignment.id) { // Editing
        const index = MOCK_ASSIGNMENTS_CLASS.findIndex(a => a.id === assignment.id && a.classId === classId);
        if (index > -1) {
            savedAssignment = { ...MOCK_ASSIGNMENTS_CLASS[index], ...assignment, createdBy: teacherId, classId };
            MOCK_ASSIGNMENTS_CLASS[index] = savedAssignment;
        } else {
             // This case should ideally not happen if UI is correct, but as a fallback, treat as new.
            const newId = `assignNew-${Date.now()}`;
            savedAssignment = { ...assignment, id: newId, createdBy: teacherId, classId } as Assignment;
            MOCK_ASSIGNMENTS_CLASS.push(savedAssignment);
        }
    } else { // Creating
        const newId = `assignNew-${Date.now()}`;
        savedAssignment = { ...assignment, id: newId, createdBy: teacherId, classId } as Assignment;
        MOCK_ASSIGNMENTS_CLASS.unshift(savedAssignment); // Add to beginning
    }
    return {...savedAssignment};
}

export function deleteMockAssignment(assignmentId: string): boolean {
    const initialLength = MOCK_ASSIGNMENTS_CLASS.length;
    MOCK_ASSIGNMENTS_CLASS = MOCK_ASSIGNMENTS_CLASS.filter(a => a.id !== assignmentId);
    return MOCK_ASSIGNMENTS_CLASS.length < initialLength;
}


// --- ASSIGNMENT SUBMISSIONS (Student Specific) ---
export let MOCK_ASSIGNMENT_SUBMISSIONS: AssignmentSubmission[] = [
    { id: 'sub1', assignmentId: 'assignClass1', studentId: 'child1', isSubmitted: true, submittedDate: format(subDays(new Date(),1), 'yyyy-MM-dd'), grade: 'A-', feedback: 'Good work, Alex!', fileUrl: '#' },
    { id: 'sub2', assignmentId: 'assignClass1', studentId: 'child3', isSubmitted: false },
    { id: 'sub3', assignmentId: 'assignClass2', studentId: 'child1', isSubmitted: true, submittedDate: format(new Date(), 'yyyy-MM-dd'), grade: 'B+', feedback: 'Diagram is clear, labels need a bit more detail.' },
    { id: 'sub4', assignmentId: 'assignClass3', studentId: 'child2', isSubmitted: true, submittedDate: format(subDays(new Date(),3), 'yyyy-MM-dd'), grade: 'A', feedback: 'Excellent analysis, Mia!', fileUrl: '#' },
    { id: 'sub5', assignmentId: 'assignClassOverdue', studentId: 'child3', isSubmitted: true, submittedDate: format(subDays(new Date(),1), 'yyyy-MM-dd'), grade: 'C', feedback: 'Submitted late, please manage time better.' },
];

export function addOrUpdateMockAssignmentSubmission(submissionData: Partial<AssignmentSubmission> & Pick<AssignmentSubmission, 'assignmentId' | 'studentId'>): AssignmentSubmission {
    const existingIndex = MOCK_ASSIGNMENT_SUBMISSIONS.findIndex(s => s.assignmentId === submissionData.assignmentId && s.studentId === submissionData.studentId);
    let finalSubmission: AssignmentSubmission;

    if (existingIndex > -1) { // Update existing
        finalSubmission = { ...MOCK_ASSIGNMENT_SUBMISSIONS[existingIndex], ...submissionData };
        MOCK_ASSIGNMENT_SUBMISSIONS[existingIndex] = finalSubmission;
    } else { // Create new (e.g. teacher grading an unsubmitted item)
        const newId = submissionData.id || `subNew-${Date.now()}-${submissionData.studentId}`;
        finalSubmission = {
            isSubmitted: false, // Default, can be overridden by submissionData
            ...submissionData,
            id: newId,
        } as AssignmentSubmission;
        MOCK_ASSIGNMENT_SUBMISSIONS.push(finalSubmission);
    }
    return {...finalSubmission};
}


// --- GRADE REPORTS ---
let MOCK_GRADE_REPORTS: GradeReportEntry[] = [
  { id: 'gr1-child1', studentId: 'child1', subjectId: 'subjMath5', grade: 'A', teacherFeedback: 'Excellent understanding of concepts. Keep up the great work!', term: 'Term 1', issuedBy: TEACHER_MOCK_USER.id },
  { id: 'gr2-child1', studentId: 'child1', subjectId: 'subjSci5', grade: 'B+', teacherFeedback: 'Good effort, needs to focus more on practical applications.', term: 'Term 1', issuedBy: TEACHER_MOCK_USER.id },
  { id: 'gr1-child2', studentId: 'child2', subjectId: 'subjEng3', grade: 'A-', teacherFeedback: 'Mia is a diligent student and participates well.', term: 'Term 1', issuedBy: OTHER_TEACHER_MOCK_USER.id },
  { id: 'gr1-child3', studentId: 'child3', subjectId: 'subjMath5', grade: 'B', teacherFeedback: 'Ethan shows good potential but needs more practice.', term: 'Term 1', issuedBy: TEACHER_MOCK_USER.id },
];

export const getMockGradeReports = (studentId: string): GradeReportEntry[] => {
    return MOCK_GRADE_REPORTS.filter(gr => gr.studentId === studentId).map(gr => ({...gr}));
};

export function addOrUpdateMockGradeEntry(studentId: string, entry: Omit<GradeReportEntry, 'id' | 'issuedBy' | 'studentId'> & { id?: string }, teacherId: string): GradeReportEntry {
    let savedEntry: GradeReportEntry;
    if (entry.id) { // Editing
        const index = MOCK_GRADE_REPORTS.findIndex(g => g.id === entry.id && g.studentId === studentId);
        if (index > -1) {
            savedEntry = { ...MOCK_GRADE_REPORTS[index], ...entry, studentId, issuedBy: teacherId };
            MOCK_GRADE_REPORTS[index] = savedEntry;
        } else {
            const newId = `grade-${Date.now()}`;
            savedEntry = { ...entry, id: newId, studentId, issuedBy: teacherId } as GradeReportEntry;
            MOCK_GRADE_REPORTS.push(savedEntry);
        }
    } else { // Creating
        const newId = `grade-${Date.now()}`;
        savedEntry = { ...entry, id: newId, studentId, issuedBy: teacherId } as GradeReportEntry;
        MOCK_GRADE_REPORTS.push(savedEntry);
    }
    return {...savedEntry};
}

// --- MESSAGES & CONVERSATIONS ---
// Assuming messages are mostly static for now or handled by a more complex system if real-time chat is needed.
// For simplicity, MOCK_CONVERSATIONS will remain as is unless specific update functions are requested.
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'convParentTeacher1',
    participantIds: [PARENT_MOCK_USER.id, TEACHER_MOCK_USER.id],
    participantDetails: {
        [PARENT_MOCK_USER.id]: { name: PARENT_MOCK_USER.name, avatarUrl: PARENT_MOCK_USER.avatarUrl, role: 'parent' },
        [TEACHER_MOCK_USER.id]: { name: TEACHER_MOCK_USER.name, avatarUrl: TEACHER_MOCK_USER.avatarUrl, role: 'teacher' },
    },
    lastMessagePreview: 'Yes, Alex can get an extension on the homework.',
    lastMessageTimestamp: subDays(new Date(),1).toISOString(),
    unreadCounts: { [PARENT_MOCK_USER.id]: 1, [TEACHER_MOCK_USER.id]: 0 },
    messages: [
      { id: 'msg1', conversationId: 'convParentTeacher1', senderId: TEACHER_MOCK_USER.id, senderName: TEACHER_MOCK_USER.name, avatarUrl: TEACHER_MOCK_USER.avatarUrl, dataAiHint: TEACHER_MOCK_USER.dataAiHint, timestamp: subDays(new Date(),1).toISOString(), text: 'Hello, I wanted to discuss Alex\'s progress.', isOwnMessage: false },
      { id: 'msg2', conversationId: 'convParentTeacher1', senderId: PARENT_MOCK_USER.id, senderName: PARENT_MOCK_USER.name, avatarUrl: PARENT_MOCK_USER.avatarUrl, dataAiHint: PARENT_MOCK_USER.dataAiHint, timestamp: subDays(new Date(),1).toISOString(), text: 'Hi Mr. Smith, sure. Also, could Alex get an extension for the math homework due tomorrow?', isOwnMessage: true },
      { id: 'msg3', conversationId: 'convParentTeacher1', senderId: TEACHER_MOCK_USER.id, senderName: TEACHER_MOCK_USER.name, avatarUrl: TEACHER_MOCK_USER.avatarUrl, dataAiHint: TEACHER_MOCK_USER.dataAiHint, timestamp: subDays(new Date(),1).toISOString(), text: 'Yes, Alex can get an extension on the homework. Please submit it by Friday.', isOwnMessage: false },
    ],
  },
];

// --- UTILITY FUNCTIONS to get data based on context ---
export const getMockChildById = (childId: string): Child | undefined => {
  const child = MOCK_CHILDREN.find(c => c.id === childId);
  return child ? {...child} : undefined;
};

export const getMockSubjectsForChild = (childId: string): Subject[] => {
  const child = getMockChildById(childId);
  if (!child || !child.classId) return [];
  return MOCK_SUBJECTS.filter(s => s.classId === child.classId).map(s => ({...s}));
};

export const getMockSubjectsForTeacher = (teacherId: string): Subject[] => {
  return MOCK_SUBJECTS.filter(s => s.teacherId === teacherId).map(s => ({...s}));
};

export const getMockClassesForTeacher = (teacherId: string): SchoolClass[] => {
  return MOCK_CLASSES.filter(c => c.teacherId === teacherId).map(c => ({...c}));
};

export const getMockAssignmentsForClass = (classId: string): Assignment[] => {
    return MOCK_ASSIGNMENTS_CLASS.filter(a => a.classId === classId).map(a => ({...a}));
};

export const getMockAssignmentsForChild = (childId: string): ChildAssignmentView[] => {
  const child = getMockChildById(childId);
  if (!child || !child.classId) {
    return [];
  }

  const classAssignments = getMockAssignmentsForClass(child.classId); // Gets copies
  const childSubmissions = MOCK_ASSIGNMENT_SUBMISSIONS.filter(sub => sub.studentId === childId).map(s => ({...s}));

  return classAssignments.map(classAssign => {
    const submission = childSubmissions.find(sub => sub.assignmentId === classAssign.id);
    const subjectDetails = MOCK_SUBJECTS.find(s => s.id === classAssign.subjectId);

    return {
      ...classAssign, // This is already a copy
      subjectName: subjectDetails?.name || 'Unknown Subject',
      submitted: submission?.isSubmitted || false,
      grade: submission?.grade,
      submittedDate: submission?.submittedDate,
      fileUrl: submission?.fileUrl,
    };
  });
};

export const getMockAssignmentSubmissionsForAssignment = (assignmentId: string): AssignmentSubmission[] => {
    return MOCK_ASSIGNMENT_SUBMISSIONS.filter(s => s.assignmentId === assignmentId).map(s => ({...s}));
};

export const getMockAssignmentSubmissionsForStudent = (studentId: string, assignmentId: string): AssignmentSubmission | undefined => {
    const submission = MOCK_ASSIGNMENT_SUBMISSIONS.find(s => s.studentId === studentId && s.assignmentId === assignmentId);
    return submission ? {...submission} : undefined;
};

export const getChildrenForParentUID = (parentUid: string): Child[] => {
  return MOCK_CHILDREN.filter(child => child.parentUid === parentUid).map(c => ({...c}));
};

export function updateMockSubjectProgress(subjectId: string, newProgress: number, newCurrentTopic: string): boolean {
    const subjectIndex = MOCK_SUBJECTS.findIndex(s => s.id === subjectId);
    if (subjectIndex > -1) {
        MOCK_SUBJECTS[subjectIndex].progress = newProgress;
        MOCK_SUBJECTS[subjectIndex].currentTopic = newCurrentTopic;
        return true;
    }
    return false;
}