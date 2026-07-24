// Derived business logic:
// present = số lượt điểm danh CÓ MẶT (attendance_records.present) — chỉ có điểm
// danh mới tính là đã học; paid = Σ payments.sessions; owed = present − paid;
// owed ≥ cycle → học viên đến kỳ thu.
import type { AttRecord, Session, Student } from "./types";

export const parseAmt = (a: string | undefined) =>
  parseInt(String(a ?? "").replace(/[^0-9]/g, ""), 10) || 0;

export const fmtAmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

export const parseDMY = (d: string) => {
  const p = String(d).split("/");
  return new Date(+p[2], +p[1] - 1, +p[0]).getTime();
};

export function initials(name: string, max = 2) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, max);
}

/** Chuyên cần từ nhật ký điểm danh: taken = số lượt đã điểm danh, present = có mặt. */
export function attendanceStat(student: Student, records: AttRecord[]) {
  const mine = records.filter((r) => r.studentId === student.id);
  const present = mine.filter((r) => r.present).length;
  const pct = mine.length ? Math.round((present / mine.length) * 100) : null;
  return { taken: mine.length, present, pct };
}

/** Số buổi ĐÃ HỌC = số lượt điểm danh có mặt. */
export function presentCount(student: Student, records: AttRecord[]) {
  return records.filter((r) => r.studentId === student.id && r.present).length;
}

export function paidSessions(student: Student) {
  return (student.payments || []).reduce((a, p) => a + (p.sessions || 0), 0);
}

/** Tiến độ chu kỳ học phí. */
export function tuitionProgress(student: Student, records: AttRecord[]) {
  const cyc = student.cycle || 10;
  const present = presentCount(student, records);
  const owed = Math.max(0, present - paidSessions(student));
  const due = owed >= cyc;
  const shown = due ? cyc : owed;
  return { cycle: cyc, shown, remain: cyc - shown, due };
}

export function dueStudents(students: Student[], records: AttRecord[]) {
  return students.filter((st) => {
    const present = presentCount(st, records);
    return present - paidSessions(st) >= (st.cycle || 10);
  });
}

export interface FlatPayment {
  id: number;
  date: string;
  sessions: number;
  amount: string;
  student: string;
}

export function allPayments(students: Student[]): FlatPayment[] {
  const out: FlatPayment[] = [];
  students.forEach((st) =>
    (st.payments || []).forEach((p) => out.push({ ...p, student: st.name }))
  );
  return out;
}

export function revenueTotals(students: Student[], nowMonth = "07/2026") {
  let revAll = 0, revMonth = 0, revCount = 0, revMonthCount = 0;
  allPayments(students).forEach((p) => {
    const amt = parseAmt(p.amount);
    revAll += amt;
    revCount++;
    if (String(p.date).slice(3) === nowMonth) {
      revMonth += amt;
      revMonthCount++;
    }
  });
  return { revAll, revMonth, revCount, revMonthCount };
}

export function recentPayments(students: Student[], max = 6) {
  return allPayments(students)
    .sort((a, b) => parseDMY(b.date) - parseDMY(a.date))
    .slice(0, max);
}

/** Revenue attributed to courses via each student's enrolled schedule sessions. */
export function revenueByCourse(students: Student[], sessions: Session[]) {
  const map: Record<string, number> = {};
  students.forEach((st) => {
    const total = (st.payments || []).reduce((a, p) => a + parseAmt(p.amount), 0);
    if (!total) return;
    const cs = Array.from(
      new Set(sessions.filter((r) => (r.studentIds || []).includes(st.id)).map((r) => r.n))
    );
    if (!cs.length) {
      map["(Khác)"] = (map["(Khác)"] || 0) + total;
      return;
    }
    const share = total / cs.length;
    cs.forEach((cn) => {
      map[cn] = (map[cn] || 0) + share;
    });
  });
  return Object.keys(map)
    .map((k) => ({ name: k, amount: Math.round(map[k]) }))
    .sort((a, b) => b.amount - a.amount);
}

/** Tổng lượt điểm danh (footer lịch). */
export function attendanceTally(records: AttRecord[]) {
  return { marks: records.length, present: records.filter((r) => r.present).length };
}

/** Số lượt có mặt của 1 buổi vào 1 ngày cụ thể (badge trên lưới). */
export function sessionDayPresent(sessionId: number, date: string, records: AttRecord[]) {
  return records.filter((r) => r.sessionId === sessionId && r.date === date && r.present).length;
}

/** Lịch sử điểm danh của 1 học viên (mới nhất trước). */
export function studentHistory(student: Student, records: AttRecord[]) {
  return records
    .filter((r) => r.studentId === student.id)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const CA_SLOTS = [
  "07:30–09:00",
  "09:00–10:30",
  "14:30–16:00",
  "16:00–17:30",
  "19:30–21:00",
  "21:00–22:30",
];

export function slotTimes(sessions: Session[]) {
  return CA_SLOTS.concat(sessions.map((b) => b.t).filter((x) => !CA_SLOTS.includes(x)));
}
