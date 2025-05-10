
import type { Child, AttendanceRecord, SchoolNotification, Subject, Assignment, GradeReportEntry, Conversation, Message } from '@/types';
import { format } from 'date-fns';

export const MOCK_USER = {
  id: 'user123',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  avatarUrl: 'https://picsum.photos/100/100?random=user',
  dataAiHint: 'woman smiling',
};

export const MOCK_CHILDREN: Child[] = [
  { id: '1', name: 'Alex Johnson', avatarUrl: 'https://picsum.photos/100/100?random=1', dataAiHint: "child boy", currentAttendanceStatus: 'Present', absenceCountThisMonth: 1, gradeLevel: 'Grade 5' },
  { id: '2', name: 'Mia Williams', avatarUrl: 'https://picsum.photos/100/100?random=2', dataAiHint: "child girl", currentAttendanceStatus: 'Absent', absenceCountThisMonth: 3, gradeLevel: 'Grade 3' },
  { id: '3', name: 'Ethan Brown', avatarUrl: 'https://picsum.photos/100/100?random=3', dataAiHint: "child student", currentAttendanceStatus: 'Present', absenceCountThisMonth: 0, gradeLevel: 'Grade 7' },
];

export const MOCK_CHILD_ID = '1'; // Default child for specific pages

export const getMockAttendanceRecords = (childId: string): AttendanceRecord[] => {
  const today = new Date();
  // Create a new date object for each modification to avoid mutating the same date object
  const recordsBase = [
    { id: 'att1', date: format(new Date(), 'yyyy-MM-dd'), status: childId === '2' ? 'Absent' : 'Present' },
    { id: 'att2', date: format(new Date(new Date().setDate(new Date().getDate() -1)), 'yyyy-MM-dd'), status: 'Present' },
    { id: 'att3', date: format(new Date(new Date().setDate(new Date().getDate() -2)), 'yyyy-MM-dd'), status: childId === '1' ? 'Late' : 'Present', notes: 'Arrived 10 mins late.' },
    { id: 'att4', date: format(new Date(new Date().setDate(new Date().getDate() -5)), 'yyyy-MM-dd'), status: 'Excused', notes: 'Doctor\'s appointment.' },
    { id: 'att5', date: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'), status: 'Absent', notes: 'Sick leave' },
    { id: 'att6', date: format(new Date(new Date().getFullYear(), new Date().getMonth(), 5), 'yyyy-MM-dd'), status: 'Absent', notes: 'Family event' },
  ];
  return recordsBase.filter(() => Math.random() > 0.3 * (parseInt(childId) % 3)); // Simulate some randomness for different children
};


export const MOCK_NOTIFICATIONS: SchoolNotification[] = [
  { id: 'notif1', title: 'Alex Johnson marked absent', date: new Date().toISOString(), content: 'Alex Johnson was marked absent on ' + format(new Date(), 'MMMM dd, yyyy') + '.', type: 'absence', read: false },
  { id: 'notif2', title: 'School Photo Day Reminder', date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), content: 'Reminder: School Photo Day is this Friday!', type: 'announcement', read: true },
  { id: 'notif3', title: 'Parent-Teacher Meeting Schedule', date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), content: 'The schedule for upcoming parent-teacher meetings has been released.', type: 'announcement', read: false },
  { id: 'notif4', title: 'Emergency Drill Today', date: new Date().toISOString(), content: 'A fire drill will be conducted at 2 PM today.', type: 'alert', read: false },
];

export const getMockSubjects = (childId: string): Subject[] => [
  { id: 'subj1', name: 'Mathematics', progress: 75, currentTopic: 'Algebra Basics', nextDeadline: format(new Date(new Date().setDate(new Date().getDate() + 7)), 'yyyy-MM-dd'), teacherName: 'Ms. Davis' },
  { id: 'subj2', name: 'Science', progress: 60, currentTopic: 'Photosynthesis', nextDeadline: format(new Date(new Date().setDate(new Date().getDate() + 10)), 'yyyy-MM-dd'), teacherName: 'Mr. Green' },
  { id: 'subj3', name: 'English', progress: 85, currentTopic: 'Shakespeare Sonnets', teacherName: 'Mrs. White' },
  { id: 'subj4', name: 'History', progress: 50, currentTopic: 'Ancient Civilizations', nextDeadline: format(new Date(new Date().setDate(new Date().getDate() + 14)), 'yyyy-MM-dd'), teacherName: 'Mr. Black' },
].map(s => ({...s, id: `${s.id}-${childId}`}));

export const getMockAssignments = (childId: string): Assignment[] => [
  { id: 'assign1', subject: 'Mathematics', title: 'Algebra Worksheet 5', dueDate: format(new Date(new Date().setDate(new Date().getDate() + 3)), 'yyyy-MM-dd'), description: 'Complete all exercises on page 45.', submitted: false, grade: undefined },
  { id: 'assign2', subject: 'Science', title: 'Plant Cell Diagram', dueDate: format(new Date(new Date().setDate(new Date().getDate() + 5)), 'yyyy-MM-dd'), description: 'Draw and label a plant cell.', submitted: true, grade: 'A-' },
  { id: 'assign3', subject: 'English', title: 'Sonnet Analysis Essay', dueDate: format(new Date(new Date().setDate(new Date().getDate() - 2)), 'yyyy-MM-dd'), description: 'Analyze two Shakespearean sonnets.', submitted: true, grade: 'B+' },
  { id: 'assign4', subject: 'History', title: 'Research Paper: Egypt', dueDate: format(new Date(new Date().setDate(new Date().getDate() + 12)), 'yyyy-MM-dd'), description: '5-page research paper on Ancient Egypt.', submitted: false, grade: undefined },
  { id: 'assign5', subject: 'Mathematics', title: 'Geometry Problems Set 2', dueDate: format(new Date(new Date().setDate(new Date().getDate() - 10)), 'yyyy-MM-dd'), description: 'Solve problems 1-10 from chapter 3.', submitted: true, grade: 'A' },
  { id: 'assign6', subject: 'Science', title: 'Lab Report: Chemical Reactions', dueDate: format(new Date(new Date().setDate(new Date().getDate() - 5)), 'yyyy-MM-dd'), description: 'Submit the full lab report with findings.', submitted: true, grade: 'B' },
].map(a => ({...a, id: `${a.id}-${childId}`}));

export const getMockGradeReports = (childId: string): GradeReportEntry[] => [
  { id: 'gr1', subject: 'Mathematics', grade: 'A', teacherFeedback: 'Excellent understanding of concepts. Keep up the great work!', term: 'Term 1' },
  { id: 'gr2', subject: 'Science', grade: 'B+', teacherFeedback: 'Good effort, needs to focus more on practical applications.', term: 'Term 1' },
  { id: 'gr3', subject: 'English', grade: 'A-', teacherFeedback: 'Strong writing skills, participates well in discussions.', term: 'Term 1' },
  { id: 'gr4', subject: 'History', grade: 'B', teacherFeedback: 'Shows interest, but needs to improve on test scores.', term: 'Term 1' },
].map(gr => ({...gr, id: `${gr.id}-${childId}`}));

const mockTeacher1 = { id: 'teacher1', name: 'Ms. Davis (Math)', avatarUrl: 'https://picsum.photos/100/100?random=teacher1', dataAiHint: "teacher woman" };
const mockTeacher2 = { id: 'teacher2', name: 'Mr. Green (Science)', avatarUrl: 'https://picsum.photos/100/100?random=teacher2', dataAiHint: "teacher man" };
const mockSchoolOffice = { id: 'schoolOffice', name: 'School Office', avatarUrl: 'https://picsum.photos/100/100?random=office', dataAiHint: "building entrance" };


export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    teacherId: mockTeacher1.id,
    teacherName: mockTeacher1.name,
    teacherAvatarUrl: mockTeacher1.avatarUrl,
    dataAiHint: mockTeacher1.dataAiHint,
    lastMessagePreview: 'Yes, Alex can get an extension on the homework.',
    lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    unreadCount: 1,
    messages: [
      { id: 'msg1', senderId: mockTeacher1.id, senderName: mockTeacher1.name, avatarUrl: mockTeacher1.avatarUrl, dataAiHint: mockTeacher1.dataAiHint, timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), text: 'Hello, I wanted to discuss Alex\'s progress.', isOwnMessage: false },
      { id: 'msg2', senderId: MOCK_USER.id, senderName: MOCK_USER.name, avatarUrl: MOCK_USER.avatarUrl, dataAiHint: MOCK_USER.dataAiHint, timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), text: 'Hi Ms. Davis, sure. Also, could Alex get an extension for the math homework due tomorrow?', isOwnMessage: true },
      { id: 'msg3', senderId: mockTeacher1.id, senderName: mockTeacher1.name, avatarUrl: mockTeacher1.avatarUrl, dataAiHint: mockTeacher1.dataAiHint, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), text: 'Yes, Alex can get an extension on the homework. Please submit it by Friday.', isOwnMessage: false },
    ],
  },
  {
    id: 'conv2',
    teacherId: mockTeacher2.id,
    teacherName: mockTeacher2.name,
    teacherAvatarUrl: mockTeacher2.avatarUrl,
    dataAiHint: mockTeacher2.dataAiHint,
    lastMessagePreview: 'Thanks for the update on Mia.',
    lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    unreadCount: 0,
    messages: [
      { id: 'msg4', senderId: MOCK_USER.id, senderName: MOCK_USER.name, avatarUrl: MOCK_USER.avatarUrl, dataAiHint: MOCK_USER.dataAiHint, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), text: 'Hi Mr. Green, Mia was sick yesterday, just wanted to let you know.', isOwnMessage: true },
      { id: 'msg5', senderId: mockTeacher2.id, senderName: mockTeacher2.name, avatarUrl: mockTeacher2.avatarUrl, dataAiHint: mockTeacher2.dataAiHint, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), text: 'Thanks for the update on Mia. Hope she feels better soon!', isOwnMessage: false },
    ],
  },
   {
    id: 'conv_school_office', // Unique ID for school office
    teacherId: mockSchoolOffice.id,
    teacherName: mockSchoolOffice.name,
    teacherAvatarUrl: mockSchoolOffice.avatarUrl,
    dataAiHint: mockSchoolOffice.dataAiHint,
    lastMessagePreview: 'Regarding school event next week...',
    lastMessageTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    unreadCount: 0,
    messages: [
       { id: 'msg_office1', senderId: mockSchoolOffice.id, senderName: mockSchoolOffice.name, avatarUrl: mockSchoolOffice.avatarUrl, dataAiHint: mockSchoolOffice.dataAiHint, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), text: 'Dear Parents, a reminder about the upcoming bake sale next Friday.', isOwnMessage: false },
    ],
  },
];

export const getMockChildById = (childId: string): Child | undefined => {
  return MOCK_CHILDREN.find(c => c.id === childId);
};
