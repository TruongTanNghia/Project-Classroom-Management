export type StudentStatus = "Active" | "At risk" | "Inactive";
export type ZaloStatus = "Connected" | "Pending" | "Not linked";
export type Subject = "Math" | "Science" | "English" | "History" | "Arts" | "CS";

/** Một buổi học được gom vào phiếu thu (ảnh chụp lúc thu, không đổi về sau). */
export interface PaidSession {
  name: string; // tên lớp/buổi
  date: string; // YYYY-MM-DD
}

export interface Payment {
  id: number;
  date: string; // DD/MM/YYYY
  sessions: number;
  amount: string; // e.g. "1.200.000₫"
  detail?: PaidSession[]; // danh sách buổi được gom vào lần thu này
}

export interface Student {
  id: number;
  name: string;
  email: string;
  phone?: string;
  grade?: string;
  homeroom?: string;
  attendance?: number;
  gpa?: string;
  status: StudentStatus;
  cycle: number; // sessions per payment cycle
  fee?: string; // tuition per cycle, free text
  payments: Payment[];
}

export interface Course {
  id: number;
  subject: Subject;
  name: string;
  teacher: string;
  schedule?: string; // (cũ) không còn dùng trong UI
  price?: string; // giá khóa học (nhập tự do)
  totalSessions?: number; // số buổi của chương trình khóa học
  image?: string; // ảnh bìa (data URL đã nén)
  html?: string; // nội dung file HTML tài liệu khóa học
  students: number;
  avg: string;
  progress: number;
}

export interface Session {
  id: number;
  day: number; // 0-4 (Mon-Fri) — dùng khi lặp hằng tuần
  t: string; // slot time, e.g. "07:30–09:00"
  n: string; // class/course name
  r: string; // room
  s: Subject;
  studentIds: number[];
  att: Record<number, boolean>;
  date?: string; // "YYYY-MM-DD" — nếu có: buổi 1 lần đúng ngày; nếu trống: lặp hằng tuần theo `day`
}

export interface ZaloLink {
  id: number;
  code: string;
  name: string;
  token: string;
  chatId: string;
  status: ZaloStatus;
  lastMsg: string;
}

export interface Thread {
  id: number;
  from: string;
  role: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
}

export interface AttRecord {
  id?: number;
  sessionId: number;
  studentId: number;
  date: string; // YYYY-MM-DD
  present: boolean;
  paid?: boolean; // đã được gom vào một phiếu thu học phí chưa
}

export interface ZaloAuto {
  attend: boolean;
  grades: boolean;
  tuition: boolean;
  risk: boolean;
}

export type EntityKind = "student" | "course" | "zalo" | "thread" | "sched";

export interface ModalState {
  mode: "add" | "edit" | "delete";
  kind: EntityKind;
  id?: number;
}
