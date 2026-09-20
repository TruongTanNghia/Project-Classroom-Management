"use client";

import { create } from "zustand";
import type {
  AttRecord, Course, EntityKind, ModalState, Payment, Session, Student, Thread, ZaloAuto, ZaloLink,
} from "./types";
import { seedCourses, seedSessions, seedStudents, seedThreads, seedZalo } from "./seed";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import { buildTuitionMessage, unpaidSessions } from "./derived";
import type { Lang } from "./i18n";

export interface FormState {
  name?: string;
  email?: string;
  phone?: string;
  cycle?: string;
  fee?: string;
  status?: string;
  teacher?: string;
  schedule?: string;
  subject?: string;
  price?: string;
  totalSessions?: string;
  image?: string;
  html?: string;
  token?: string;
  chatId?: string;
  content?: string;
  room?: string;
  time?: string;
  day?: number;
  date?: string; // ngày bắt đầu học
  dayCa?: Record<number, string>; // {thứ: ca} — tạo nhiều buổi 1 lần (mode add)
  studentIds?: number[];
  att?: Record<number, boolean>;
}

export interface MsgStats {
  total: number;
  ok: number;
  byKind: Record<string, number>;
}

interface AppState {
  hydrated: boolean;
  msgStats: MsgStats | null; // KPI thật từ message_log (null = chưa có / demo)
  lang: Lang;
  dark: boolean;
  menuOpen: boolean;
  filter: string;
  toast: string;
  modal: ModalState | null;
  form: FormState;
  attendId: number | null; // id buổi đang điểm danh (popup riêng)
  attendDate: string; // ngày đang điểm danh (YYYY-MM-DD)
  attendDraft: Record<number, boolean>;
  detailId: number | null; // id học viên đang xem chi tiết
  attRecords: AttRecord[]; // nhật ký điểm danh theo ngày
  seq: number;
  students: Student[];
  courses: Course[];
  sessions: Session[];
  zalo: ZaloLink[];
  threads: Thread[];
  zaloAuto: ZaloAuto;
  adminChatId: string; // Chat ID Zalo của Thầy (admin) — nhận thông báo mọi buổi

  hydrate: () => void;
  setAdminChatId: (chatId: string) => void;
  setLang: (lang: Lang) => void;
  toggleDark: () => void;
  setMenuOpen: (open: boolean) => void;
  setFilter: (f: string) => void;
  showToast: (msg: string, ms?: number) => void;
  openModal: (modal: ModalState, form: FormState) => void;
  askDelete: () => void;
  closeModal: () => void;
  setForm: (patch: Partial<FormState>) => void;
  saveStudent: () => void;
  saveCourse: () => void;
  saveZalo: () => void;
  saveThread: () => void;
  saveSched: () => void;
  openAttend: (sessionId: number) => void;
  setAttendDate: (date: string) => void;
  toggleAttend: (studentId: number) => void;
  saveAttend: () => void;
  closeAttend: () => void;
  openDetail: (studentId: number) => void;
  closeDetail: () => void;
  markAttendance: (sessionId: number, studentId: number, date: string, present: boolean) => void;
  removeAttendance: (sessionId: number, studentId: number, date: string) => void;
  confirmDelete: () => void;
  recordPayment: (id: number) => void;
  /** Gửi thông báo học phí (kèm list từng buổi) qua Zalo. toAdmin = gửi thử cho Thầy. */
  sendTuitionBill: (studentId: number, toAdmin?: boolean) => Promise<void>;
  toggleAuto: (key: keyof ZaloAuto) => void;
  remindFee: (name: string, fee?: string) => void;
  remindAll: (list: { name: string; fee?: string }[]) => void;
  remindToday: () => Promise<void>;
}

let toastTimer: number | undefined;

/** Ngày hôm nay theo lịch máy, định dạng YYYY-MM-DD. */
function todayISO() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}

function todayDDMMYYYY() {
  const now = new Date();
  return (
    String(now.getDate()).padStart(2, "0") + "/" +
    String(now.getMonth() + 1).padStart(2, "0") + "/" +
    now.getFullYear()
  );
}

/* ---- Supabase row mapping (snake_case ⇄ camelCase) ---- */
const sb = () => getSupabase();

function reportSync(err: { message?: string } | null) {
  if (err) {
    // Lưu Supabase THẤT BẠI: UI vẫn hiện (optimistic) nhưng DB chưa có → báo TO & lâu
    // để không âm thầm mất dữ liệu như vụ thiếu cột courses.image.
    console.error("[Supabase] ghi thất bại:", err);
    useApp.getState().showToast("⚠️ CHƯA LƯU ĐƯỢC lên Supabase — " + (err.message || "sync error") + ". Kiểm tra lại rồi lưu lại!", 9000);
  }
}

const studentToRow = (s: Student) => ({
  id: s.id, name: s.name, email: s.email, phone: s.phone ?? "", grade: s.grade ?? "",
  homeroom: s.homeroom ?? "", attendance: s.attendance ?? null, gpa: s.gpa ?? "",
  status: s.status, cycle: s.cycle, fee: s.fee ?? "",
});
const sessionToRow = (b: Session) => ({
  id: b.id, day: b.day, slot: b.t, name: b.n, room: b.r, subject: b.s,
  student_ids: b.studentIds, attendance: b.att, date: b.date || null,
});
const zaloToRow = (z: ZaloLink) => ({
  id: z.id, code: z.code, student_name: z.name, token: z.token, chat_id: z.chatId,
  status: z.status, last_msg: z.lastMsg,
});
const threadToRow = (th: Thread) => ({
  id: th.id, from_name: th.from, role: th.role, subject: th.subject,
  preview: th.preview, time_label: th.time, unread: th.unread,
});
const courseToRow = (c: Course) => ({
  id: c.id, subject: c.subject, name: c.name, teacher: c.teacher,
  schedule: c.schedule ?? "", price: c.price ?? "", html_content: c.html ?? "",
  total_sessions: c.totalSessions ?? 0, image: c.image ?? "",
  students: c.students, avg: c.avg, progress: c.progress,
});

const TABLE: Record<EntityKind, string> = {
  student: "students",
  course: "courses",
  zalo: "zalo_links",
  thread: "threads",
  sched: "schedule_sessions",
};

async function loadFromSupabase() {
  const supa = sb();
  if (!supa) return null;
  const [students, payments, courses, sessions, zalo, threads, settings, attend] = await Promise.all([
    supa.from("students").select("*").order("id"),
    supa.from("payments").select("*").order("id"),
    supa.from("courses").select("*").order("id"),
    supa.from("schedule_sessions").select("*").order("id"),
    supa.from("zalo_links").select("*").order("id"),
    supa.from("threads").select("*").order("id"),
    supa.from("app_settings").select("*"),
    supa.from("attendance_records").select("*"),
  ]);
  const err = students.error || payments.error || courses.error || sessions.error || zalo.error || threads.error || settings.error;
  if (err) throw err;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const paysByStudent = new Map<number, Payment[]>();
  (payments.data || []).forEach((p: any) => {
    const list = paysByStudent.get(p.student_id) || [];
    list.push({ id: p.id, date: p.date, sessions: p.sessions, amount: p.amount, detail: p.detail || undefined });
    paysByStudent.set(p.student_id, list);
  });
  const mapped = {
    students: (students.data || []).map((r: any): Student => ({
      id: r.id, name: r.name, email: r.email, phone: r.phone || undefined,
      grade: r.grade || undefined, homeroom: r.homeroom || undefined,
      attendance: r.attendance ?? undefined, gpa: r.gpa || undefined,
      status: r.status, cycle: r.cycle || 10, fee: r.fee || undefined,
      payments: paysByStudent.get(r.id) || [],
    })),
    courses: (courses.data || []).map((r: any): Course => ({
      id: r.id, subject: r.subject, name: r.name, teacher: r.teacher,
      schedule: r.schedule, price: r.price || undefined, html: r.html_content || undefined,
      totalSessions: r.total_sessions ?? undefined, image: r.image || undefined,
      students: r.students, avg: r.avg, progress: r.progress,
    })),
    sessions: (sessions.data || []).map((r: any): Session => ({
      id: r.id, day: r.day, t: r.slot, n: r.name, r: r.room, s: r.subject,
      studentIds: r.student_ids || [], att: r.attendance || {}, date: r.date || undefined,
    })),
    zalo: (zalo.data || []).map((r: any): ZaloLink => ({
      id: r.id, code: r.code, name: r.student_name, token: r.token || "",
      chatId: r.chat_id || "", status: r.status, lastMsg: r.last_msg || "—",
    })),
    threads: (threads.data || []).map((r: any): Thread => ({
      id: r.id, from: r.from_name, role: r.role, subject: r.subject,
      preview: r.preview, time: r.time_label, unread: r.unread,
    })),
    zaloAuto: ((settings.data || []).find((r: any) => r.key === "zaloAuto")?.value as ZaloAuto) ||
      { attend: true, grades: true, tuition: true, risk: false },
    adminChatId: ((settings.data || []).find((r: any) => r.key === "adminZalo")?.value?.chatId as string) || "",
    attRecords: attend.error
      ? []
      : (attend.data || []).map((r: any): AttRecord => ({
          id: r.id, sessionId: r.session_id, studentId: r.student_id, date: r.date,
          present: r.present, paid: Boolean(r.paid),
        })),
  };
  // Nối tiếp bộ đếm ID theo ID lớn nhất đã có → tránh trùng khi tạo mới
  const maxId = Math.max(
    100,
    ...mapped.students.map((r) => r.id),
    ...mapped.courses.map((r) => r.id),
    ...mapped.sessions.map((r) => r.id),
    ...mapped.zalo.map((r) => r.id),
    ...mapped.threads.map((r) => r.id)
  );
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return { ...mapped, seq: maxId };
}

async function loadMsgStats(): Promise<MsgStats | null> {
  const supa = sb();
  if (!supa) return null;
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  const res = await supa.from("message_log").select("kind,ok").gte("sent_at", monthStart);
  if (res.error) return null; // bảng chưa có (chưa migration) → giữ số demo
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const rows = (res.data || []) as any[];
  const byKind: Record<string, number> = {};
  let ok = 0;
  rows.forEach((r) => {
    byKind[r.kind] = (byKind[r.kind] || 0) + 1;
    if (r.ok) ok++;
  });
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return { total: rows.length, ok, byKind };
}

export const useApp = create<AppState>((set, get) => ({
  hydrated: false,
  msgStats: null,
  lang: "vi",
  dark: false,
  menuOpen: false,
  filter: "All",
  toast: "",
  modal: null,
  form: {},
  attendId: null,
  attendDate: todayISO(),
  attendDraft: {},
  detailId: null,
  attRecords: [],
  seq: 100,
  students: seedStudents,
  courses: seedCourses,
  sessions: seedSessions,
  zalo: seedZalo,
  threads: seedThreads,
  zaloAuto: { attend: true, grades: true, tuition: true, risk: false },
  adminChatId: "",

  setAdminChatId: (chatId) => {
    set({ adminChatId: chatId });
    sb()?.from("app_settings").upsert({ key: "adminZalo", value: { chatId } }).then(({ error }) => reportSync(error));
  },

  hydrate: () => {
    if (get().hydrated) return;
    const lang = (localStorage.getItem("aihlt-lang") as Lang) || "vi";
    const dark = localStorage.getItem("aihlt-dark") === "1";
    document.documentElement.classList.toggle("dark", dark);
    set({ hydrated: true, lang, dark });
    if (isSupabaseConfigured) {
      // Đã kết nối Supabase → KHÔNG hiện data mẫu (tránh hiểu lầm "mất data").
      // Xoá seed về trống; chỉ hiện dữ liệu thật khi tải xong.
      set({ students: [], courses: [], sessions: [], zalo: [], threads: [], attRecords: [] });
      loadFromSupabase()
        .then((data) => {
          if (data) set(data);
        })
        .catch((e) =>
          get().showToast(
            "⚠️ Không tải được dữ liệu — phiên có thể đã hết hạn. Hãy ĐĂNG XUẤT rồi đăng nhập lại. (" +
              (e?.message || "load error") + ")",
            9000
          )
        );
      loadMsgStats().then((stats) => stats && set({ msgStats: stats }));
    }
  },

  setLang: (lang) => {
    localStorage.setItem("aihlt-lang", lang);
    set({ lang });
  },

  toggleDark: () => {
    const dark = !get().dark;
    localStorage.setItem("aihlt-dark", dark ? "1" : "0");
    document.documentElement.classList.toggle("dark", dark);
    set({ dark });
  },

  setMenuOpen: (menuOpen) => set({ menuOpen }),
  setFilter: (filter) => set({ filter }),

  showToast: (msg, ms) => {
    set({ toast: msg });
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => set({ toast: "" }), ms ?? 2600);
  },

  openModal: (modal, form) => set({ modal, form }),
  askDelete: () => {
    const m = get().modal;
    if (m) set({ modal: { ...m, mode: "delete" } });
  },
  closeModal: () => set({ modal: null, form: {} }),
  setForm: (patch) => set({ form: { ...get().form, ...patch } }),

  saveStudent: () => {
    const { form: F, modal: m, students, seq } = get();
    if (!F.name || !F.name.trim() || !m) return;
    const rec = {
      name: F.name.trim(),
      email: (F.email || "").trim(),
      phone: (F.phone || "").trim(),
      cycle: Math.max(1, parseInt(F.cycle || "10", 10) || 10),
      fee: (F.fee || "").trim(),
      status: (F.status || "Active") as Student["status"],
    };
    if (m.mode === "edit" && m.id != null) {
      const next = students.map((r) => (r.id === m.id ? { ...r, ...rec } : r));
      set({ students: next, modal: null, form: {} });
      const updated = next.find((r) => r.id === m.id);
      if (updated) sb()?.from("students").update(studentToRow(updated)).eq("id", m.id).then(({ error }) => reportSync(error));
    } else {
      const id = seq + 1;
      const row: Student = { id, ...rec, payments: [] };
      set({ students: [row, ...students], seq: id, modal: null, form: {} });
      sb()?.from("students").insert(studentToRow(row)).then(({ error }) => reportSync(error));
    }
  },

  saveCourse: () => {
    const { form: F, modal: m, courses, seq } = get();
    if (!F.name || !F.name.trim() || !m) return;
    const rec = {
      name: F.name.trim(),
      teacher: (F.teacher || "").trim() || "—",
      price: (F.price || "").trim(),
      totalSessions: Math.max(0, parseInt(F.totalSessions || "0", 10) || 0),
      subject: (F.subject || "CS") as Course["subject"],
      // Giữ file cũ khi sửa mà không tải mới (=== undefined)
      ...(F.html !== undefined ? { html: F.html } : {}),
      ...(F.image !== undefined ? { image: F.image } : {}),
    };
    if (m.mode === "edit" && m.id != null) {
      const next = courses.map((r) => (r.id === m.id ? { ...r, ...rec } : r));
      set({ courses: next, modal: null, form: {} });
      const updated = next.find((r) => r.id === m.id);
      if (updated) sb()?.from("courses").update(courseToRow(updated)).eq("id", m.id).then(({ error }) => reportSync(error));
    } else {
      const id = seq + 1;
      const row: Course = { id, students: 0, avg: "—", progress: 0, ...rec };
      set({ courses: [row, ...courses], seq: id, modal: null, form: {} });
      sb()?.from("courses").insert(courseToRow(row)).then(({ error }) => reportSync(error));
    }
  },

  saveZalo: () => {
    const { form: F, modal: m, zalo, seq } = get();
    if (!F.name || !F.name.trim() || !m) return;
    const rec = {
      name: F.name.trim(),
      token: (F.token || "").trim(),
      chatId: (F.chatId || "").trim(),
      status: (F.status || "Connected") as ZaloLink["status"],
    };
    if (m.mode === "edit" && m.id != null) {
      const next = zalo.map((r) => (r.id === m.id ? { ...r, ...rec } : r));
      set({ zalo: next, modal: null, form: {} });
      const updated = next.find((r) => r.id === m.id);
      if (updated) sb()?.from("zalo_links").update(zaloToRow(updated)).eq("id", m.id).then(({ error }) => reportSync(error));
    } else {
      const id = seq + 1;
      const row: ZaloLink = { id, code: "STU-" + (1000 + id), lastMsg: "—", ...rec };
      set({ zalo: [row, ...zalo], seq: id, modal: null, form: {} });
      sb()?.from("zalo_links").insert(zaloToRow(row)).then(({ error }) => reportSync(error));
    }
  },

  saveThread: () => {
    const { form: F, modal: m, threads, seq, lang } = get();
    if (!F.name || !F.name.trim() || !m) return;
    const rec = {
      from: F.name.trim(),
      subject: (F.subject || "").trim() || "—",
      preview: (F.content || "").trim(),
    };
    if (m.mode === "edit" && m.id != null) {
      const next = threads.map((r) => (r.id === m.id ? { ...r, ...rec } : r));
      set({ threads: next, modal: null, form: {} });
      const updated = next.find((r) => r.id === m.id);
      if (updated) sb()?.from("threads").update(threadToRow(updated)).eq("id", m.id).then(({ error }) => reportSync(error));
    } else {
      const id = seq + 1;
      const vi = lang !== "en";
      const row: Thread = {
        id,
        role: vi ? "Tin đi · Zalo" : "Outgoing · Zalo",
        time: vi ? "Vừa xong" : "Just now",
        unread: false,
        ...rec,
      };
      set({ threads: [row, ...threads], seq: id, modal: null, form: {} });
      sb()?.from("threads").insert(threadToRow(row)).then(({ error }) => reportSync(error));
    }
  },

  saveSched: () => {
    const { form: F, modal: m, sessions, seq } = get();
    if (!F.name || !F.name.trim() || !m) return;
    const base = {
      n: F.name.trim(),
      r: (F.room || "").trim(),
      date: (F.date || "").trim() || undefined,
      s: (F.subject || "CS") as Session["s"],
      studentIds: (F.studentIds || []).slice(),
    };
    if (m.mode === "edit" && m.id != null) {
      const rec = { ...base, t: (F.time || "").trim() || "07:30–09:00", day: F.day ?? 0, att: { ...(F.att || {}) } };
      const next = sessions.map((x) => (x.id === m.id ? { ...x, ...rec } : x));
      set({ sessions: next, modal: null, form: {} });
      const updated = next.find((x) => x.id === m.id);
      if (updated) sb()?.from("schedule_sessions").update(sessionToRow(updated)).eq("id", m.id).then(({ error }) => reportSync(error));
    } else {
      // Tạo nhiều buổi 1 lần: mỗi cặp {thứ: ca} = 1 buổi
      const dayCa = F.dayCa || {};
      const entries = Object.entries(dayCa);
      if (!entries.length) return;
      let id = seq;
      const rows: Session[] = entries.map(([dayStr, slot]) => {
        id += 1;
        return { id, ...base, day: Number(dayStr), t: slot, att: {} };
      });
      set({ sessions: [...sessions, ...rows], seq: id, modal: null, form: {} });
      rows.forEach((row) =>
        sb()?.from("schedule_sessions").insert(sessionToRow(row)).then(({ error }) => reportSync(error))
      );
    }
  },

  // Dựng draft điểm danh của 1 buổi vào 1 ngày từ nhật ký đã có
  openAttend: (sessionId) => {
    const s = get().sessions.find((x) => x.id === sessionId);
    if (!s) return;
    const date = todayISO();
    const draft: Record<number, boolean> = {};
    get().attRecords
      .filter((r) => r.sessionId === sessionId && r.date === date)
      .forEach((r) => (draft[r.studentId] = r.present));
    set({ attendId: sessionId, attendDate: date, attendDraft: draft });
  },
  setAttendDate: (date) => {
    const { attendId } = get();
    const draft: Record<number, boolean> = {};
    if (attendId != null)
      get().attRecords
        .filter((r) => r.sessionId === attendId && r.date === date)
        .forEach((r) => (draft[r.studentId] = r.present));
    set({ attendDate: date, attendDraft: draft });
  },
  toggleAttend: (studentId) => {
    const d = { ...get().attendDraft };
    d[studentId] = !d[studentId];
    set({ attendDraft: d });
  },
  saveAttend: () => {
    const { attendId, attendDate, attendDraft, sessions, attRecords } = get();
    if (attendId == null || !attendDate) return;
    const s = sessions.find((x) => x.id === attendId);
    if (!s) return;
    // Mỗi học viên của buổi → 1 dòng present true/false cho ngày này
    const rows = (s.studentIds || []).map((sid) => ({
      session_id: attendId, student_id: sid, date: attendDate, present: Boolean(attendDraft[sid]),
    }));
    // Cập nhật local: bỏ record cũ của (buổi, ngày) rồi thêm mới
    const kept = attRecords.filter((r) => !(r.sessionId === attendId && r.date === attendDate));
    const localNew: AttRecord[] = rows.map((r) => ({
      sessionId: r.session_id, studentId: r.student_id, date: r.date, present: r.present,
    }));
    set({ attRecords: [...kept, ...localNew], attendId: null, attendDraft: {} });
    if (rows.length)
      sb()?.from("attendance_records")
        .upsert(rows, { onConflict: "session_id,student_id,date" })
        .then(({ error }) => reportSync(error));
    const vi = get().lang !== "en";
    get().showToast(vi ? "Đã lưu điểm danh ✓" : "Attendance saved ✓");
  },
  closeAttend: () => set({ attendId: null, attendDraft: {} }),

  openDetail: (studentId) => set({ detailId: studentId }),
  closeDetail: () => set({ detailId: null }),

  // Điểm danh bù cho 1 học viên vào 1 buổi + ngày (ghi đè nếu đã có)
  markAttendance: (sessionId, studentId, date, present) => {
    const kept = get().attRecords.filter(
      (r) => !(r.sessionId === sessionId && r.studentId === studentId && r.date === date)
    );
    set({ attRecords: [...kept, { sessionId, studentId, date, present }] });
    sb()?.from("attendance_records")
      .upsert({ session_id: sessionId, student_id: studentId, date, present }, { onConflict: "session_id,student_id,date" })
      .then(({ error }) => reportSync(error));
    const vi = get().lang !== "en";
    get().showToast(present ? (vi ? "Đã ghi nhận có mặt ✓" : "Marked present ✓") : (vi ? "Đã ghi nhận vắng" : "Marked absent"));
  },
  removeAttendance: (sessionId, studentId, date) => {
    set({
      attRecords: get().attRecords.filter(
        (r) => !(r.sessionId === sessionId && r.studentId === studentId && r.date === date)
      ),
    });
    sb()?.from("attendance_records")
      .delete()
      .eq("session_id", sessionId).eq("student_id", studentId).eq("date", date)
      .then(({ error }) => reportSync(error));
  },

  confirmDelete: () => {
    const m = get().modal;
    if (!m || m.id == null) return;
    const id = m.id;
    const kind = m.kind;
    if (kind === "student") set({ students: get().students.filter((r) => r.id !== id) });
    else if (kind === "course") set({ courses: get().courses.filter((r) => r.id !== id) });
    else if (kind === "zalo") set({ zalo: get().zalo.filter((r) => r.id !== id) });
    else if (kind === "thread") set({ threads: get().threads.filter((r) => r.id !== id) });
    else if (kind === "sched") set({ sessions: get().sessions.filter((r) => r.id !== id) });
    set({ modal: null, form: {} });
    sb()?.from(TABLE[kind]).delete().eq("id", id).then(({ error }) => reportSync(error));
  },

  // Thu học phí = GOM tất cả buổi đã học nhưng chưa thu vào 1 phiếu (kèm list buổi),
  // rồi đánh dấu các buổi đó `paid` → bộ đếm nợ tự về 0 cho kỳ mới.
  // KHÔNG cần xoá lịch sử điểm danh nữa.
  recordPayment: (id) => {
    const { students, attRecords, sessions } = get();
    const student = students.find((r) => r.id === id);
    if (!student) return;
    const vi = get().lang !== "en";

    const unpaid = attRecords.filter((r) => r.studentId === id && r.present && !r.paid);
    if (!unpaid.length) {
      get().showToast(
        vi ? "Chưa có buổi nào để thu — học viên chưa học buổi mới nào." : "No unpaid sessions to collect.",
        4500
      );
      return;
    }

    const detail = unpaid
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((r) => ({
        name: sessions.find((s) => s.id === r.sessionId)?.n || (vi ? "Buổi học" : "Session"),
        date: r.date,
      }));

    const pays = student.payments.slice();
    const pay: Payment = {
      id: pays.reduce((mx, p) => Math.max(mx, p.id), 0) + 1,
      date: todayDDMMYYYY(),
      sessions: unpaid.length, // chốt ĐÚNG số buổi đã học chưa thu
      amount: student.fee || "—", // tiền = học phí đã nhập lúc tạo học viên
      detail,
    };
    pays.push(pay);

    const mark = new Set(unpaid.map((r) => `${r.sessionId}|${r.date}`));
    set({
      students: students.map((r) => (r.id === id ? { ...r, payments: pays } : r)),
      attRecords: attRecords.map((r) =>
        r.studentId === id && r.present && !r.paid && mark.has(`${r.sessionId}|${r.date}`)
          ? { ...r, paid: true }
          : r
      ),
    });

    const supa = sb();
    if (supa) {
      supa.from("payments")
        .insert({ student_id: id, date: pay.date, sessions: pay.sessions, amount: pay.amount, detail })
        .then(({ error }) => reportSync(error));
      supa.from("attendance_records")
        .update({ paid: true })
        .eq("student_id", id).eq("present", true).eq("paid", false)
        .then(({ error }) => reportSync(error));
    }
    get().showToast(
      vi ? `Đã thu ${pay.sessions} buổi · ${pay.amount}` : `Collected ${pay.sessions} sessions · ${pay.amount}`,
      4500
    );
  },

  // Gửi THÔNG BÁO HỌC PHÍ qua Zalo: liệt kê đủ từng buổi đã học chưa đóng + số tiền.
  // toAdmin = true → gửi thử về bot của Thầy để duyệt trước khi gửi học viên.
  sendTuitionBill: async (studentId, toAdmin = false) => {
    const { students, attRecords, sessions, zalo, adminChatId, lang } = get();
    const vi = lang !== "en";
    const st = students.find((s) => s.id === studentId);
    if (!st) return;

    if (!unpaidSessions(st, attRecords)) {
      get().showToast(
        vi ? "Học viên này không có buổi nào chưa đóng." : "This student has no unpaid sessions.",
        4000
      );
      return;
    }
    const text = buildTuitionMessage(st, attRecords, sessions, vi);

    let chatId = "";
    let token = "";
    if (toAdmin) {
      chatId = adminChatId;
      if (!chatId) {
        get().showToast(
          vi ? "Chưa có Chat ID của Thầy — vào Zalo Bot cấu hình trước nha." : "Admin Chat ID missing.",
          5000
        );
        return;
      }
    } else {
      const link = zalo.find((z) => z.name === st.name && z.chatId);
      if (!link) {
        get().showToast(
          vi ? `${st.name} chưa liên kết Zalo — chưa gửi được.` : `${st.name} has no Zalo link.`,
          5000
        );
        return;
      }
      chatId = link.chatId;
      token = link.token || "";
    }

    try {
      const res = await fetch("/api/zalo/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, chatId, text }),
      });
      const d = await res.json();
      if (d.ok) {
        get().showToast(
          toAdmin
            ? vi ? "Đã gửi thử về bot của Thầy ✓" : "Test sent to admin bot ✓"
            : vi ? `Đã gửi học phí cho ${st.name} ✓` : `Tuition notice sent to ${st.name} ✓`,
          4000
        );
      } else {
        get().showToast((vi ? "Zalo gửi lỗi: " : "Zalo error: ") + (d.error || "?"), 6000);
      }
    } catch {
      get().showToast(vi ? "Không gọi được Zalo API" : "Zalo API unreachable", 5000);
    }
  },

  toggleAuto: (key) => {
    const zaloAuto = { ...get().zaloAuto, [key]: !get().zaloAuto[key] };
    set({ zaloAuto });
    sb()?.from("app_settings").upsert({ key: "zaloAuto", value: zaloAuto }).then(({ error }) => reportSync(error));
  },

  remindFee: (name, fee) => {
    const { lang, zalo, threads, seq } = get();
    const vi = lang !== "en";
    const dd = todayDDMMYYYY();
    const msg = vi
      ? "Nhắc học phí (" + (fee || "") + ") — " + dd
      : "Tuition reminder (" + (fee || "") + ") — " + dd;
    const preview = vi
      ? "Chào em " + name + "! AIhoclaptrinh nhắc em khoản học phí " + (fee || "") + " đã đến kỳ. Em sắp xếp đóng giúp trung tâm nha!"
      : "Hi " + name + "! AIhoclaptrinh reminder: your tuition " + (fee || "") + " is now due. Thank you!";
    const id = seq + 1;
    const thread: Thread = {
      id,
      from: name,
      role: vi ? "Zalo · Nhắc học phí" : "Zalo · Tuition",
      subject: vi ? "Nhắc học phí" : "Tuition reminder",
      preview,
      time: vi ? "Vừa xong" : "Just now",
      unread: false,
    };
    const nextZalo = get().zalo.map((r) =>
      r.name === name && r.status !== "Not linked" ? { ...r, lastMsg: msg } : r
    );
    set({ zalo: nextZalo, threads: [thread, ...threads], seq: id });
    const touched = zalo.find((r) => r.name === name && r.status !== "Not linked");
    if (touched) sb()?.from("zalo_links").update({ last_msg: msg }).eq("id", touched.id).then(({ error }) => reportSync(error));
    sb()?.from("threads").insert(threadToRow(thread)).then(({ error }) => reportSync(error));

    // Gửi Zalo THẬT qua API route server-side nếu học viên đã có chat_id liên kết.
    // Mỗi học viên 1 bot riêng → dùng token riêng của học viên (touched.token);
    // nếu để trống thì route dùng ZALO_BOT_TOKEN chung.
    // Không có chat_id → chỉ ghi nhận trong app (tin mô phỏng), không gửi ra ngoài.
    if (touched && touched.chatId) {
      fetch("/api/zalo/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: touched.token || "", chatId: touched.chatId, text: preview }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (!d.ok) get().showToast((vi ? "Zalo gửi lỗi: " : "Zalo error: ") + (d.error || "?"));
        })
        .catch(() => get().showToast(vi ? "Không gọi được Zalo API" : "Zalo API unreachable"));
    }

    get().showToast(
      vi ? "Đã gửi nhắc học phí tới " + name + " qua Zalo" : "Tuition reminder sent to " + name + " via Zalo"
    );
  },

  remindAll: (list) => {
    list.forEach((n) => get().remindFee(n.name, n.fee));
    const vi = get().lang !== "en";
    get().showToast(
      vi ? "Đã gửi nhắc học phí tới " + list.length + " học viên" : "Reminders sent to " + list.length + " students"
    );
  },

  // Nút "Nhắc thủ công": gọi endpoint gửi nhắc lịch NGAY cho mọi lớp hôm nay
  // tới cả Thầy + học viên. Dùng token đăng nhập (không lộ khóa cron).
  remindToday: async () => {
    const vi = get().lang !== "en";
    const supa = sb();
    if (!supa) {
      get().showToast(vi ? "Chỉ chạy khi đã kết nối Supabase" : "Requires Supabase");
      return;
    }
    get().showToast(vi ? "Đang gửi nhắc hôm nay…" : "Sending today's reminders…", 8000);
    try {
      const { data } = await supa.auth.getSession();
      const token = data.session?.access_token;
      const res = await fetch("/api/cron/reminders?force=today", {
        headers: token ? { Authorization: "Bearer " + token } : {},
      });
      const d = await res.json();
      if (d.ok) {
        get().showToast(
          vi
            ? `✅ Đã gửi ${d.sent}/${d.total} tin nhắc các lớp hôm nay (Thầy + học viên)`
            : `Sent ${d.sent}/${d.total} reminders for today`,
          6000
        );
      } else {
        get().showToast((vi ? "Lỗi: " : "Error: ") + (d.error || "?"), 7000);
      }
    } catch {
      get().showToast(vi ? "Không gọi được máy chủ" : "Server unreachable", 6000);
    }
  },
}));
