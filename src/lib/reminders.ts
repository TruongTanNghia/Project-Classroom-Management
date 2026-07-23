// Logic nhắc lịch học tự động — dùng ở API route /api/cron/reminders.
// Múi giờ Việt Nam cố định UTC+7 (không DST).
import type { Session, Student, ZaloLink } from "./types";

const VN_OFFSET_MS = 7 * 60 * 60 * 1000;
const pad = (n: number) => String(n).padStart(2, "0");

interface VnParts {
  y: number; mo: number; da: number; dow: number; hh: number; mm: number;
}

/** Bóc các thành phần ngày/giờ theo giờ VN từ 1 mốc epoch (ms). */
export function vnParts(ms: number): VnParts {
  const d = new Date(ms + VN_OFFSET_MS);
  return {
    y: d.getUTCFullYear(), mo: d.getUTCMonth() + 1, da: d.getUTCDate(),
    dow: d.getUTCDay(), hh: d.getUTCHours(), mm: d.getUTCMinutes(),
  };
}

const vnDateStr = (ms: number) => {
  const p = vnParts(ms);
  return `${p.y}-${pad(p.mo)}-${pad(p.da)}`;
};

// dow: 0=CN..6=T7 → chỉ số buổi 0=T2..4=T6 (CN/T7 = 6,5 — không khớp lớp T2–T6)
const dayIndexFromDow = (dow: number) => (dow === 0 ? 6 : dow - 1);

/** Lấy giờ bắt đầu từ chuỗi slot "07:30–09:00" → {hh, mm}. */
export function slotStart(t: string): { hh: number; mm: number } {
  const m = String(t).match(/(\d{1,2}):(\d{2})/);
  return m ? { hh: +m[1], mm: +m[2] } : { hh: 0, mm: 0 };
}

/** Epoch (ms, UTC) của buổi học bắt đầu vào 1 ngày VN (YYYY-MM-DD) lúc hh:mm giờ VN. */
function startUTCms(dateStrVN: string, hh: number, mm: number): number {
  const [y, mo, da] = dateStrVN.split("-").map(Number);
  return Date.UTC(y, mo - 1, da, hh - 7, mm, 0, 0);
}

/** Các mốc bắt đầu ứng viên của 1 buổi quanh thời điểm "now" (hôm nay & mai theo giờ VN). */
function candidateStarts(session: Session, nowMs: number, force = false): number[] {
  const { hh, mm } = slotStart(session.t);
  if (session.date) {
    return [startUTCms(session.date, hh, mm)];
  }
  // force (test): lấy luôn hôm nay, bỏ qua kiểm tra thứ
  if (force) {
    return [startUTCms(vnDateStr(nowMs), hh, mm)];
  }
  // Lặp hằng tuần: xét ngày VN của hôm nay và ngày mai, chọn ngày khớp thứ
  const out: number[] = [];
  for (const offset of [0, 24 * 60 * 60 * 1000]) {
    const ds = vnDateStr(nowMs + offset);
    const p = vnParts(nowMs + offset);
    if (dayIndexFromDow(p.dow) === session.day) out.push(startUTCms(ds, hh, mm));
  }
  return out;
}

export interface DueReminder {
  sessionId: number;
  studentId: number;
  studentName: string;
  chatId: string;
  token: string;
  text: string;
  dedupKey: string;
  startVN: string; // "HH:MM DD/MM"
}

function buildMessage(student: Student, session: Session, startMs: number): string {
  const p = vnParts(startMs);
  const time = `${pad(p.hh)}:${pad(p.mm)}`;
  const date = `${pad(p.da)}/${pad(p.mo)}/${p.y}`;
  return (
    `🔔 AIhoclaptrinh nhắc lịch học\n\n` +
    `👤 ${student.name}\n` +
    `📚 Lớp: ${session.n}\n` +
    `🏫 Phòng: ${session.r}\n` +
    `🕒 ${time} · ${date}\n\n` +
    `Buổi học bắt đầu sau khoảng 20 phút. Em nhớ chuẩn bị vào học đúng giờ nha! 💪`
  );
}

/**
 * Trả về danh sách tin cần gửi: mỗi buổi sắp bắt đầu trong khoảng
 * [lead, lead+window) phút tới → nhắc từng học viên đã có chat_id.
 */
export function dueReminders(
  sessions: Session[],
  students: Student[],
  zalo: ZaloLink[],
  nowMs: number,
  opts: { leadMin?: number; windowMin?: number; force?: boolean } = {}
): DueReminder[] {
  const lead = opts.leadMin ?? 20;
  const windowMin = opts.windowMin ?? 7;
  const out: DueReminder[] = [];

  for (const session of sessions) {
    const starts = candidateStarts(session, nowMs, opts.force);
    for (const startMs of starts) {
      const minutesUntil = (startMs - nowMs) / 60000;
      const inWindow = minutesUntil >= lead && minutesUntil < lead + windowMin;
      if (!opts.force && !inWindow) continue;

      const p = vnParts(startMs);
      const dayKey = `${p.y}${pad(p.mo)}${pad(p.da)}`;
      for (const sid of session.studentIds || []) {
        const student = students.find((s) => s.id === sid);
        if (!student) continue;
        const link = zalo.find((z) => z.name === student.name && z.status !== "Not linked");
        if (!link || !link.chatId) continue; // chưa liên kết Zalo → bỏ qua
        out.push({
          sessionId: session.id,
          studentId: sid,
          studentName: student.name,
          chatId: link.chatId,
          token: link.token || "",
          text: buildMessage(student, session, startMs),
          dedupKey: `${session.id}:${dayKey}:${sid}`,
          startVN: `${pad(p.hh)}:${pad(p.mm)} ${pad(p.da)}/${pad(p.mo)}`,
        });
      }
    }
  }
  return out;
}
