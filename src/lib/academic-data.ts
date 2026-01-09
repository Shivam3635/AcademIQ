import type { Notice, AcademicEvent, Exam } from '@/lib/types';

export const notices: Notice[] = [
  {
    id: '1',
    title: 'Mid-term Exam Schedule Announced',
    content: 'The schedule for the upcoming mid-term examinations has been published. Please check the "Exam Schedule" section for details.',
    date: '2024-10-15',
    author: 'Admin Office',
  },
  {
    id: '2',
    title: 'Library Closure for Maintenance',
    content: 'The central library will be closed for maintenance from October 20th to October 22nd. All online services will remain available.',
    date: '2024-10-12',
    author: 'Library Department',
  },
  {
    id: '3',
    title: 'Annual Sports Day Registration Open',
    content: 'Registrations for the Annual Sports Day are now open. Interested students can register at the sports complex office until October 25th.',
    date: '2024-10-10',
    author: 'Student Affairs',
  },
  {
    id: '4',
    title: 'Guest Lecture on Artificial Intelligence',
    content: 'A guest lecture on "The Future of AI" by Dr. Evelyn Reed will be held on November 5th at the main auditorium. All are welcome.',
    date: '2024-10-08',
    author: 'Computer Science Dept.',
  },
];

export const academicEvents: AcademicEvent[] = [
  { id: '1', title: 'Start of Semester', date: new Date('2024-09-01'), type: 'event' },
  { id: '2', title: 'Course Registration Deadline', date: new Date('2024-09-10'), type: 'deadline' },
  { id: '3', title: 'National Holiday', date: new Date('2024-10-02'), type: 'holiday' },
  { id: '4', title: 'Mid-term Exams Start', date: new Date('2024-11-01'), type: 'event' },
  { id: '5', title: 'Mid-term Exams End', date: new Date('2024-11-10'), type: 'event' },
  { id: '6', title: 'Winter Break', date: new Date('2024-12-22'), type: 'holiday' },
  { id: '7', title: 'Project Submission Deadline', date: new Date('2024-12-15'), type: 'deadline' },
  { id: '8', title: 'Final Exams Start', date: new Date('2025-01-05'), type: 'event' },
];


export const examSchedule: Exam[] = [
  { id: '1', course: 'Advanced Calculus', code: 'MATH301', date: '2024-11-01', time: '09:00 AM - 12:00 PM', location: 'Hall A' },
  { id: '2', course: 'Data Structures', code: 'CS201', date: '2024-11-02', time: '01:00 PM - 04:00 PM', location: 'Hall B' },
  { id: '3', course: 'Classical Physics', code: 'PHY205', date: '2024-11-03', time: '09:00 AM - 12:00 PM', location: 'Hall C' },
  { id: '4', course: 'Organic Chemistry', code: 'CHEM302', date: '2024-11-04', time: '01:00 PM - 04:00 PM', location: 'Hall A' },
  { id: '5', course: 'History of Modern Art', code: 'ART110', date: '2024-11-05', time: '09:00 AM - 12:00 PM', location: 'Hall D' },
  { id: '6', course: 'Introduction to Psychology', code: 'PSY101', date: '2024-11-06', time: '01:00 PM - 04:00 PM', location: 'Hall B' },
];
