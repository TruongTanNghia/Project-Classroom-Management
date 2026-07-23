"use client";

import { create } from "zustand";
import type {
  Course, EntityKind, ModalState, Payment, Session, Student, Thread, ZaloAuto, ZaloLink,
} from "./types";
import { seedCourses, seedSessions, seedStudents, seedThreads, seedZalo } from "./seed";
import { getSupabase, isSupabaseConfigured } from "./supabase";
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
  token?: string;
  chatId?: string;
  content?: string;
  room?: string;
  time?: string;
  day?: number;
  date?: string;
  studentIds?: number[];
  att?: Record<number, boolean>;
}

interface AppState {
  hydrated: boolean;
  lang: Lang;
  dark: boolean;
  menuOpen: boolean;
  filter: string;
  toast: string;
  modal: ModalState | null;
  form: FormState;
  seq: number;
  students: Student[];
  courses: Course[];
  sessions: Session[];
  zalo: ZaloLink[];
  threads: Thread[];
  zaloAuto: ZaloAuto;

  hydrate: () => void;
  setLang: (lang: Lang) => void;
  toggleDark: () => void;
  setMenuOpen: (open: boolean) => void;
  setFilter: (f: string) => void;
  showToast: (msg: string) => void;
  openModal: (modal: ModalState, form: FormState) => void;
  askDelete: () => void;
  closeModal: () => void;
  setForm: (patch: Partial<FormState>) => void;
  saveStudent: () => void;
  saveCourse: () => void;
  saveZalo: () => void;
  saveThread: () => void;
  saveSched: () => void;
  confirmDelete: () => void;
  recordPayment: (id: number) => void;
  toggleAuto: (key: keyof ZaloAuto) => void;
  remindFee: (name: string, fee?: string) => void;
  remindAll: (list: { name: string; fee?: string }[]) => void;
}

let toastTimer: number | undefined;

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
    // Surface sync failures without blocking the optimistic UI update
    useApp.getState().showToast("Supabase: " + (err.message || "sync error"));
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
  schedule: c.schedule, students: c.students, avg: c.avg, progress: c.progress,
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
  const [students, payments, courses, sessions, zalo, threads, settings] = await Promise.all([
    supa.from("students").select("*").order("id"),
    supa.from("payments").select("*").order("id"),
    supa.from("courses").select("*").order("id"),
    supa.from("schedule_sessions").select("*").order("id"),
    supa.from("zalo_links").select("*").order("id"),
    supa.from("threads").select("*").order("id"),
    supa.from("app_settings").select("*"),
  ]);
  const err = students.error || payments.error || courses.error || sessions.error || zalo.error || threads.error || settings.error;
  if (err) throw err;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const paysByStudent = new Map<number, Payment[]>();
  (payments.data || []).forEach((p: any) => {
    const list = paysByStudent.get(p.student_id) || [];
    list.push({ id: p.id, date: p.date, sessions: p.sessions, amount: p.amount });
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
      schedule: r.schedule, students: r.students, avg: r.avg, progress: r.progress,
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
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return mapped;
}

export const useApp = create<AppState>((set, get) => ({
  hydrated: false,
  lang: "vi",
  dark: false,
  menuOpen: false,
  filter: "All",
  toast: "",
  modal: null,
  form: {},
  seq: 100,
  students: seedStudents,
  courses: seedCourses,
  sessions: seedSessions,
  zalo: seedZalo,
  threads: seedThreads,
  zaloAuto: { attend: true, grades: true, tuition: true, risk: false },

  hydrate: () => {
    if (get().hydrated) return;
    const lang = (localStorage.getItem("aihlt-lang") as Lang) || "vi";
    const dark = localStorage.getItem("aihlt-dark") === "1";
    document.documentElement.classList.toggle("dark", dark);
    set({ hydrated: true, lang, dark });
    if (isSupabaseConfigured) {
      loadFromSupabase()
        .then((data) => {
          if (data) set(data);
        })
        .catch((e) => get().showToast("Supabase: " + (e?.message || "load error")));
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

  showToast: (msg) => {
    set({ toast: msg });
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => set({ toast: "" }), 2600);
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
      schedule: (F.schedule || "").trim() || "—",
      subject: (F.subject || "CS") as Course["subject"],
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
    const rec = {
      n: F.name.trim(),
      r: (F.room || "").trim() || "—",
      t: (F.time || "").trim() || "07:30–09:00",
      day: F.day ?? 0,
      date: (F.date || "").trim() || undefined,
      s: (F.subject || "CS") as Session["s"],
      studentIds: (F.studentIds || []).slice(),
      att: { ...(F.att || {}) },
    };
    if (m.mode === "edit" && m.id != null) {
      const next = sessions.map((x) => (x.id === m.id ? { ...x, ...rec } : x));
      set({ sessions: next, modal: null, form: {} });
      const updated = next.find((x) => x.id === m.id);
      if (updated) sb()?.from("schedule_sessions").update(sessionToRow(updated)).eq("id", m.id).then(({ error }) => reportSync(error));
    } else {
      const id = seq + 1;
      const row: Session = { id, ...rec };
      set({ sessions: [...sessions, row], seq: id, modal: null, form: {} });
      sb()?.from("schedule_sessions").insert(sessionToRow(row)).then(({ error }) => reportSync(error));
    }
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

  recordPayment: (id) => {
    const { students } = get();
    const student = students.find((r) => r.id === id);
    if (!student) return;
    const pays = student.payments.slice();
    const pay: Payment = {
      id: pays.reduce((mx, p) => Math.max(mx, p.id), 0) + 1,
      date: todayDDMMYYYY(),
      sessions: student.cycle || 10,
      amount: student.fee || "—",
    };
    pays.push(pay);
    set({ students: students.map((r) => (r.id === id ? { ...r, payments: pays } : r)) });
    sb()?.from("payments")
      .insert({ student_id: id, date: pay.date, sessions: pay.sessions, amount: pay.amount })
      .then(({ error }) => reportSync(error));
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
      ? "AIhoclaptrinh xin nhắc quý phụ huynh về khoản học phí " + (fee || "") + " đã đến kỳ thanh toán. Cảm ơn ạ!"
      : "AIhoclaptrinh reminder: tuition of " + (fee || "") + " is now due. Thank you!";
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
}));
