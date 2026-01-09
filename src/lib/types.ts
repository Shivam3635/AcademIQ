export type Notice = {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
};

export type AcademicEvent = {
  id: string;
  title: string;
  date: Date;
  type: 'holiday' | 'deadline' | 'event';
};

export type Exam = {
  id: string;
  course: string;
  code: string;
  date: string;
  time: string;
  location: string;
};
