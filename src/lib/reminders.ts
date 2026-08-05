// Logic nhắc lịch học tự động — dùng ở API route /api/cron/reminders.
// Múi giờ Việt Nam cố định UTC+7 (không DST).
import type { AttRecord, Session, Student, ZaloLink } from "./types";
import { presentCount, paidSessions } from "./derived";

export type ReminderKind = "schedule" | "attendance" | "grades" | "tuition" | "risk" | "admin";

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

/**
 * Các mốc bắt đầu ứng viên của 1 buổi quanh "now" (hôm nay & mai theo giờ VN).
 * Buổi lặp hằng tuần theo `day`; `session.date` (nếu có) = NGÀY BẮT ĐẦU HỌC —
 * chỉ nhắc từ ngày đó trở đi.
 */
function candidateStarts(session: Session, nowMs: number, force = false): number[] {
  const { hh, mm } = slotStart(session.t);
  // force (test): lấy luôn hôm nay, bỏ qua kiểm tra thứ/ngày bắt đầu
  if (force) {
    return [startUTCms(vnDateStr(nowMs), hh, mm)];
  }
  const out: number[] = [];
  for (const offset of [0, 24 * 60 * 60 * 1000]) {
    const ds = vnDateStr(nowMs + offset);
    const p = vnParts(nowMs + offset);
    if (dayIndexFromDow(p.dow) !== session.day) continue;
    if (session.date && ds < session.date) continue; // chưa tới ngày bắt đầu
    out.push(startUTCms(ds, hh, mm));
  }
  return out;
}

export interface DueReminder {
  kind: ReminderKind;
  sessionId?: number;
  studentId: number;
  studentName: string;
  chatId: string;
  token: string;
  text: string;
  dedupKey: string;
  startVN?: string; // "HH:MM DD/MM"
}

/** Học viên đã liên kết Zalo (có chat_id, không phải "Not linked"). */
function linkFor(student: Student, zalo: ZaloLink[]) {
  return zalo.find((z) => z.name === student.name && z.status !== "Not linked" && z.chatId);
}

function buildMessage(student: Student, session: Session, startMs: number, todayMode = false): string {
  const p = vnParts(startMs);
  const time = `${pad(p.hh)}:${pad(p.mm)}`;
  const date = `${pad(p.da)}/${pad(p.mo)}/${p.y}`;
  // todayMode (nhắc thủ công): chỉ báo "hôm nay có lịch học", không nói "sau 20 phút".
  const footer = todayMode
    ? `Hôm nay em có lịch học nha! Nhớ sắp xếp đi học đúng giờ 💪`
    : `Buổi học bắt đầu sau khoảng 20 phút. Em nhớ chuẩn bị vào học đúng giờ nha! 💪`;
  return (
    `🔔 AIhoclaptrinh nhắc lịch học\n\n` +
    `👤 ${student.name}\n` +
    `📚 Lớp: ${session.n}\n` +
    `🏫 Phòng: ${session.r}\n` +
    `🕒 ${time} · ${date}\n\n` +
    footer
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
  opts: { leadMin?: number; windowMin?: number; force?: boolean; todayMode?: boolean } = {}
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
          kind: "schedule",
          sessionId: session.id,
          studentId: sid,
          studentName: student.name,
          chatId: link.chatId,
          token: link.token || "",
          text: buildMessage(student, session, startMs, opts.todayMode),
          dedupKey: `schedule:${session.id}:${dayKey}:${sid}`,
          startVN: `${pad(p.hh)}:${pad(p.mm)} ${pad(p.da)}/${pad(p.mo)}`,
        });
      }
    }
  }
  return out;
}

// ---------- Các tự động khác (gắn với công tắc ở trang Zalo Bot) ----------

const todayKeyVN = (nowMs: number) => vnDateStr(nowMs).replace(/-/g, "");

/** Cảnh báo chuyên cần: buổi đã bắt đầu ~15p mà học viên bị điểm danh vắng. */
export function buildAttendanceAlerts(
  sessions: Session[], students: Student[], zalo: ZaloLink[], records: AttRecord[], nowMs: number,
  opts: { afterMin?: number; windowMin?: number; force?: boolean } = {}
): DueReminder[] {
  const after = opts.afterMin ?? 15;
  const win = opts.windowMin ?? 10;
  const out: DueReminder[] = [];
  const todayStr = vnDateStr(nowMs);
  const todayDow = dayIndexFromDow(vnParts(nowMs).dow);
  for (const s of sessions) {
    const { hh, mm } = slotStart(s.t);
    // chỉ xét buổi của HÔM NAY (đúng thứ) và đã tới ngày bắt đầu
    if (!opts.force) {
      if (s.day !== todayDow) continue;
      if (s.date && todayStr < s.date) continue;
    }
    const startMs = startUTCms(todayStr, hh, mm);
    const minsSince = (nowMs - startMs) / 60000;
    const inWindow = minsSince >= after && minsSince < after + win;
    if (!opts.force && !inWindow) continue;
    // Chỉ cảnh báo khi GV đã điểm danh buổi này hôm nay (có record) — và HV vắng
    const taken = records.some((r) => r.sessionId === s.id && r.date === todayStr);
    if (!opts.force && !taken) continue;
    for (const sid of s.studentIds || []) {
      const present = records.some((r) => r.sessionId === s.id && r.date === todayStr && r.studentId === sid && r.present);
      if (present) continue; // có mặt → bỏ
      const st = students.find((x) => x.id === sid);
      if (!st) continue;
      const link = linkFor(st, zalo);
      if (!link) continue;
      out.push({
        kind: "attendance", sessionId: s.id, studentId: sid, studentName: st.name,
        chatId: link.chatId, token: link.token || "",
        text:
          `⚠️ AIhoclaptrinh · Cảnh báo chuyên cần\n\n` +
          `Chào em ${st.name}! Hệ thống ghi nhận em chưa có mặt tại lớp "${s.n}" (${s.t}) hôm nay. ` +
          `Nếu có nhầm lẫn, em báo lại trung tâm giúp nha. Cảm ơn em!`,
        dedupKey: `attendance:${s.id}:${todayKeyVN(nowMs)}:${sid}`,
      });
    }
  }
  return out;
}

/** Nhắc học phí: học viên đã đến kỳ thu (owed ≥ cycle). Tối đa 1 lần/ngày. */
export function buildTuitionReminders(
  students: Student[], zalo: ZaloLink[], records: AttRecord[], nowMs: number,
  opts: { force?: boolean } = {}
): DueReminder[] {
  const out: DueReminder[] = [];
  for (const st of students) {
    const owed = presentCount(st, records) - paidSessions(st);
    const due = owed >= (st.cycle || 10);
    if (!opts.force && !due) continue;
    const link = linkFor(st, zalo);
    if (!link) continue;
    out.push({
      kind: "tuition", studentId: st.id, studentName: st.name,
      chatId: link.chatId, token: link.token || "",
      text:
        `💰 AIhoclaptrinh · Nhắc học phí\n\n` +
        `Chào em ${st.name}! Em đã học đủ số buổi của kỳ. Học phí kỳ này${st.fee ? " (" + st.fee + ")" : ""} ` +
        `đã đến hạn. Em sắp xếp đóng học phí giúp trung tâm nha. Cảm ơn em!`,
      dedupKey: `tuition:${todayKeyVN(nowMs)}:${st.id}`,
    });
  }
  return out;
}

/** Báo cáo điểm hàng tuần: chỉ gửi vào Thứ Sáu ~17:00 (giờ VN). Tối đa 1 lần/tuần. */
export function buildGradeReports(
  students: Student[], sessions: Session[], zalo: ZaloLink[], nowMs: number,
  opts: { hour?: number; windowMin?: number; force?: boolean } = {}
): DueReminder[] {
  const hour = opts.hour ?? 17;
  const win = opts.windowMin ?? 7;
  const p = vnParts(nowMs);
  const isFriday = p.dow === 5;
  const minsOfDay = p.hh * 60 + p.mm;
  const target = hour * 60;
  const inWindow = isFriday && minsOfDay >= target && minsOfDay < target + win;
  if (!opts.force && !inWindow) return [];
  const weekKey = todayKeyVN(nowMs); // dedup theo ngày Thứ Sáu đó
  const out: DueReminder[] = [];
  for (const st of students) {
    const link = linkFor(st, zalo);
    if (!link) continue;
    const att = st.attendance != null ? st.attendance + "%" : "—";
    out.push({
      kind: "grades", studentId: st.id, studentName: st.name,
      chatId: link.chatId, token: link.token || "",
      text:
        `📊 AIhoclaptrinh · Báo cáo tuần\n\n` +
        `Chào em ${st.name}, kết quả tuần này của em:\n` +
        `• GPA: ${st.gpa || "—"}\n` +
        `• Chuyên cần: ${att}\n` +
        `• Trạng thái: ${st.status}\n\n` +
        `Chúc em cuối tuần vui vẻ!`,
      dedupKey: `grades:${weekKey}:${st.id}`,
    });
  }
  return out;
}

/** Cảnh báo rủi ro AI: học viên đang "At risk". Tối đa 1 lần/ngày. */
export function buildRiskAlerts(
  students: Student[], zalo: ZaloLink[], nowMs: number,
  opts: { force?: boolean } = {}
): DueReminder[] {
  const out: DueReminder[] = [];
  for (const st of students) {
    if (!opts.force && st.status !== "At risk") continue;
    const link = linkFor(st, zalo);
    if (!link) continue;
    out.push({
      kind: "risk", studentId: st.id, studentName: st.name,
      chatId: link.chatId, token: link.token || "",
      text:
        `🚨 AIhoclaptrinh · Cảnh báo rủi ro\n\n` +
        `Chào em ${st.name}, hệ thống ghi nhận kết quả gần đây của em đang giảm ` +
        `(chuyên cần/điểm số). Trung tâm sẽ đồng hành hỗ trợ em, cùng cố gắng nha!`,
      dedupKey: `risk:${todayKeyVN(nowMs)}:${st.id}`,
    });
  }
  return out;
}

/**
 * Thông báo cho THẦY (admin): mỗi buổi sắp tới (trong ~20p) → 1 tin tóm tắt
 * (không phụ thuộc học viên có liên kết Zalo hay không). Thầy nhận TẤT CẢ buổi.
 */
export interface AdminAlert {
  sessionId: number;
  dedupKey: string;
  text: string;
}
export function dueSessionAlerts(
  sessions: Session[], students: Student[], nowMs: number,
  opts: { leadMin?: number; windowMin?: number; force?: boolean; todayMode?: boolean } = {}
): AdminAlert[] {
  const lead = opts.leadMin ?? 20;
  const windowMin = opts.windowMin ?? 7;
  const p2 = (n: number) => String(n).padStart(2, "0");
  const out: AdminAlert[] = [];
  for (const session of sessions) {
    for (const startMs of candidateStarts(session, nowMs, opts.force)) {
      const minutesUntil = (startMs - nowMs) / 60000;
      if (!opts.force && !(minutesUntil >= lead && minutesUntil < lead + windowMin)) continue;
      const p = vnParts(startMs);
      const names = (session.studentIds || [])
        .map((id) => students.find((s) => s.id === id)?.name)
        .filter(Boolean) as string[];
      // todayMode (nhắc thủ công): "lịch dạy hôm nay", không nói "sau 20 phút".
      const header = opts.todayMode ? `👨‍🏫 AIhoclaptrinh · Lịch dạy hôm nay` : `👨‍🏫 AIhoclaptrinh · Sắp tới giờ dạy`;
      const footer = opts.todayMode ? `Hôm nay Thầy có buổi dạy này.` : `Buổi học bắt đầu sau khoảng 20 phút.`;
      out.push({
        sessionId: session.id,
        dedupKey: `admin:${session.id}:${p.y}${p2(p.mo)}${p2(p.da)}`,
        text:
          `${header}\n\n` +
          `📚 ${session.n}\n` +
          `🕒 ${p2(p.hh)}:${p2(p.mm)} · ${p2(p.da)}/${p2(p.mo)}/${p.y}\n` +
          `👥 ${names.length} học viên${names.length ? ": " + names.join(", ") : ""}\n\n` +
          footer,
      });
    }
  }
  return out;
}
