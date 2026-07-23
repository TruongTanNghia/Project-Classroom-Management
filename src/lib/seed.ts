// Seed data ported verbatim from the design prototype — used in demo mode
// (no Supabase env vars) and mirrored in supabase/schema.sql.
import type { Course, Session, Student, Thread, ZaloLink } from "./types";

export const seedStudents: Student[] = [
  {
    id: 1, name: "Ava Thompson", email: "ava.t@aihoclaptrinh.vn", phone: "0901 234 567",
    grade: "10", homeroom: "10-B · Ms. Hale", attendance: 97, gpa: "3.82", status: "Active",
    cycle: 10, fee: "1.200.000₫",
    payments: [
      { id: 1, date: "02/06/2026", sessions: 10, amount: "1.200.000₫" },
      { id: 2, date: "08/07/2026", sessions: 10, amount: "1.200.000₫" },
    ],
  },
  {
    id: 2, name: "Jordan Ellis", email: "jordan.e@aihoclaptrinh.vn", phone: "0902 345 678",
    grade: "9", homeroom: "9-A · Mr. Cole", attendance: 78, gpa: "2.61", status: "At risk",
    cycle: 10, payments: [],
  },
  {
    id: 3, name: "Priya Nair", email: "priya.n@aihoclaptrinh.vn",
    grade: "11", homeroom: "11-C · Dr. Um", attendance: 84, gpa: "3.10", status: "At risk",
    cycle: 10, fee: "1.200.000₫",
    payments: [{ id: 1, date: "15/06/2026", sessions: 10, amount: "1.200.000₫" }],
  },
  {
    id: 4, name: "Marcus Webb", email: "marcus.w@aihoclaptrinh.vn",
    grade: "12", homeroom: "12-A · Ms. Ford", attendance: 95, gpa: "3.65", status: "Active",
    cycle: 12, fee: "1.400.000₫",
    payments: [{ id: 1, date: "20/06/2026", sessions: 12, amount: "1.400.000₫" }],
  },
  {
    id: 5, name: "Sofia Marino", email: "sofia.m@aihoclaptrinh.vn",
    grade: "10", homeroom: "10-B · Ms. Hale", attendance: 99, gpa: "3.94", status: "Active",
    cycle: 10, fee: "1.200.000₫", payments: [],
  },
  {
    id: 6, name: "Noah Kim", email: "noah.k@aihoclaptrinh.vn",
    grade: "9", homeroom: "9-D · Mr. Ruiz", attendance: 92, gpa: "3.41", status: "Active",
    cycle: 8, fee: "1.000.000₫", payments: [],
  },
  {
    id: 7, name: "Lena Okafor", email: "lena.o@aihoclaptrinh.vn",
    grade: "10", homeroom: "10-A · Mr. Sato", attendance: 90, gpa: "3.02", status: "At risk",
    cycle: 10, fee: "1.200.000₫", payments: [],
  },
  {
    id: 8, name: "Theo Bright", email: "theo.b@aihoclaptrinh.vn",
    grade: "11", homeroom: "11-B · Ms. Park", attendance: 66, gpa: "2.88", status: "Inactive",
    cycle: 10, fee: "1.200.000₫", payments: [],
  },
];

export const seedCourses: Course[] = [
  { id: 1, subject: "Math", name: "Algebra II", teacher: "Mr. D. Cole", schedule: "Mon/Wed/Fri 9:00", students: 28, avg: "81%", progress: 64 },
  { id: 2, subject: "Science", name: "Biology — Honors", teacher: "Dr. A. Um", schedule: "Tue/Thu 10:30", students: 24, avg: "87%", progress: 58 },
  { id: 3, subject: "English", name: "American Literature", teacher: "Ms. R. Park", schedule: "Daily 8:00", students: 31, avg: "84%", progress: 71 },
  { id: 4, subject: "CS", name: "Intro to Programming", teacher: "Mr. K. Sato", schedule: "Mon/Wed 13:00", students: 22, avg: "90%", progress: 52 },
  { id: 5, subject: "History", name: "World History", teacher: "Ms. J. Ford", schedule: "Tue/Thu 9:00", students: 29, avg: "79%", progress: 66 },
  { id: 6, subject: "Arts", name: "Studio Art Foundations", teacher: "Ms. L. Hale", schedule: "Fri 13:00", students: 18, avg: "93%", progress: 60 },
];

export const seedSessions: Session[] = [
  { id: 1, day: 0, t: "07:30–09:00", n: "Python cơ bản", r: "Phòng 1", s: "CS", studentIds: [1, 6, 5], att: { 1: true, 6: true } },
  { id: 2, day: 0, t: "09:00–10:30", n: "Toán tư duy", r: "Phòng 2", s: "Math", studentIds: [2, 7], att: {} },
  { id: 3, day: 0, t: "19:30–21:00", n: "Lập trình AI nâng cao", r: "Online", s: "CS", studentIds: [3, 4, 8], att: { 3: true, 4: true, 8: true } },
  { id: 4, day: 1, t: "09:00–10:30", n: "Tiếng Anh giao tiếp", r: "Phòng 1", s: "English", studentIds: [5, 1], att: { 5: true } },
  { id: 5, day: 1, t: "14:30–16:00", n: "Scratch thiếu nhi", r: "Phòng 2", s: "Arts", studentIds: [], att: {} },
  { id: 6, day: 1, t: "21:00–22:30", n: "Luyện đề Toán", r: "Online", s: "Math", studentIds: [2], att: {} },
  { id: 7, day: 2, t: "07:30–09:00", n: "Python cơ bản", r: "Phòng 1", s: "CS", studentIds: [], att: {} },
  { id: 8, day: 2, t: "16:00–17:30", n: "Web Frontend", r: "Phòng 2", s: "Science", studentIds: [], att: {} },
  { id: 9, day: 2, t: "19:30–21:00", n: "Lập trình AI nâng cao", r: "Online", s: "CS", studentIds: [3, 4, 8], att: {} },
  { id: 10, day: 3, t: "09:00–10:30", n: "Tiếng Anh giao tiếp", r: "Phòng 1", s: "English", studentIds: [], att: {} },
  { id: 11, day: 3, t: "14:30–16:00", n: "Scratch thiếu nhi", r: "Phòng 2", s: "Arts", studentIds: [], att: {} },
  { id: 12, day: 3, t: "19:30–21:00", n: "Data & AI cơ bản", r: "Online", s: "History", studentIds: [], att: {} },
  { id: 13, day: 4, t: "07:30–09:00", n: "Python cơ bản", r: "Phòng 1", s: "CS", studentIds: [], att: {} },
  { id: 14, day: 4, t: "16:00–17:30", n: "Web Frontend", r: "Phòng 2", s: "Science", studentIds: [], att: {} },
  { id: 15, day: 4, t: "21:00–22:30", n: "Luyện đề Toán", r: "Online", s: "Math", studentIds: [], att: {} },
];

export const seedZalo: ZaloLink[] = [
  { id: 1, code: "STU-1102", name: "Ava Thompson", token: "zbt_8f2k…Qx91", chatId: "7203441189", status: "Connected", lastMsg: "Điểm kiểm tra tuần — 2 h" },
  { id: 2, code: "STU-2041", name: "Jordan Ellis", token: "zbt_a51m…Tz04", chatId: "7198220457", status: "Connected", lastMsg: "Cảnh báo chuyên cần — 12 min" },
  { id: 3, code: "STU-1877", name: "Priya Nair", token: "zbt_c09p…Lk22", chatId: "7311058763", status: "Pending", lastMsg: "Lời mời liên kết — hôm qua" },
  { id: 4, code: "STU-1450", name: "Sofia Marino", token: "zbt_d73r…Mn58", chatId: "7255903312", status: "Connected", lastMsg: "Thông báo học phí — T2" },
  { id: 5, code: "STU-1621", name: "Noah Kim", token: "", chatId: "", status: "Not linked", lastMsg: "—" },
  { id: 6, code: "STU-1338", name: "Theo Bright", token: "zbt_e18s…Vw35", chatId: "7288114620", status: "Connected", lastMsg: "Nhắc lịch học — 8:00" },
];

export const seedThreads: Thread[] = [
  { id: 1, from: "Daniel Cole", role: "Math · Grade 9", subject: "Re: Jordan Ellis intervention plan", preview: "I met with Jordan after class today — he agreed to the Tuesday tutoring block. Can we loop in his parents before…", time: "12 min", unread: true },
  { id: 2, from: "Nguyen family", role: "Parent · Grade 10", subject: "Absence note for Thursday", preview: "Minh has a medical appointment Thursday morning and will miss first period. Attaching the clinic confirmation…", time: "1 h", unread: true },
  { id: 3, from: "Rachel Park", role: "English dept.", subject: "AP Literature enrollment list", preview: "Here is the final list of 12 candidates the AI flagged, with my notes on each. I disagree on two of them…", time: "3 h", unread: false },
  { id: 4, from: "District Office", role: "Announcement", subject: "Fall term reporting deadlines", preview: "Reminder: attendance and grade exports for the state report are due August 29. The new template is…", time: "Yesterday", unread: false },
  { id: 5, from: "Kenji Sato", role: "CS · Grade 10", subject: "Lab 2 equipment request", preview: "Half of the keyboards in Lab 2 are failing. Requesting 12 replacements before the new term starts…", time: "Yesterday", unread: false },
];
