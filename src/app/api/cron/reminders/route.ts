import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  dueReminders, buildAttendanceAlerts, buildTuitionReminders, buildGradeReports, buildRiskAlerts,
  dueSessionAlerts, type DueReminder,
} from "@/lib/reminders";
import type { AttRecord, Session, Student, ZaloAuto, ZaloLink } from "@/lib/types";

// Cron chạy MỌI tự động Zalo: một dịch vụ cron ngoài (VD cron-job.org) gọi route
// này mỗi ~5 phút. Route đọc trạng thái công tắc (app_settings.zaloAuto) rồi:
//   - schedule (luôn bật): nhắc lịch học 20p trước
//   - attendance (công tắc): cảnh báo chuyên cần
//   - tuition   (công tắc): nhắc học phí đến kỳ
//   - grades    (công tắc): báo cáo điểm Thứ Sáu 17:00
//   - risk      (công tắc): cảnh báo học viên rủi ro
// Gửi bằng bot RIÊNG của học viên, chống trùng qua reminder_sent, ghi message_log.
//
//   GET /api/cron/reminders?key=<CRON_SECRET>
//   &dry=1              → chỉ xem trước, không gửi
//   &force=<what>       → gửi ngay bất kể giờ/công tắc (để test):
//                          all | schedule | attendance | tuition | grades | risk
//                          hoặc số <sessionId> = ép nhắc lịch buổi đó

const ZAPPS_BASE = "https://bot-api.zapps.me";

async function sendZalo(token: string, chatId: string, text: string) {
  const res = await fetch(`${ZAPPS_BASE}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && data.ok !== false, data };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = process.env.CRON_SECRET;
  if (secret && url.searchParams.get("key") !== secret) {
    return NextResponse.json({ ok: false, error: "Sai key" }, { status: 401 });
  }

  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Ưu tiên service_role (bỏ qua RLS) để cron vẫn đọc/ghi được sau khi khóa DB.
  // Không có thì tạm dùng publishable key (chỉ chạy khi RLS còn mở).
  const supaKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supaUrl || !supaKey) {
    return NextResponse.json({ ok: false, error: "Chưa cấu hình Supabase" }, { status: 503 });
  }
  const supa = createClient(supaUrl, supaKey, { auth: { persistSession: false } });

  const dry = url.searchParams.get("dry") === "1";
  const forceParam = url.searchParams.get("force"); // all|schedule|...|<sessionId>|null
  const lead = Number(url.searchParams.get("lead")) || 20;
  const windowMin = Number(url.searchParams.get("window")) || 7;
  const fallbackToken = process.env.ZALO_BOT_TOKEN || "";
  const forceSessionId = forceParam && /^\d+$/.test(forceParam) ? forceParam : null;
  const forceKind = forceParam && !forceSessionId ? forceParam : null; // "all" hoặc tên loại
  const forcedAll = forceKind === "all";
  const isForced = (kind: string) => forcedAll || forceKind === kind || (kind === "schedule" && !!forceSessionId);

  // 1) Nạp dữ liệu
  const [sRes, stRes, zRes, setRes] = await Promise.all([
    supa.from("schedule_sessions").select("*"),
    supa.from("students").select("*"),
    supa.from("zalo_links").select("*"),
    supa.from("app_settings").select("*"),
  ]);
  if (sRes.error || stRes.error || zRes.error) {
    return NextResponse.json(
      { ok: false, error: (sRes.error || stRes.error || zRes.error)?.message },
      { status: 502 }
    );
  }
  let sessions: Session[] = (sRes.data || []).map((r: any) => ({
    id: r.id, day: r.day, t: r.slot, n: r.name, r: r.room, s: r.subject,
    studentIds: r.student_ids || [], att: r.attendance || {}, date: r.date || undefined,
  }));
  const students = (stRes.data || []).map((r: any): Student => ({
    id: r.id, name: r.name, email: r.email, phone: r.phone || undefined,
    grade: r.grade || undefined, homeroom: r.homeroom || undefined,
    attendance: r.attendance ?? undefined, gpa: r.gpa || undefined,
    status: r.status, cycle: r.cycle || 10, fee: r.fee || undefined, payments: [],
  }));
  // payments + attendance cho tính học phí đến kỳ
  const [payRes, attRes] = await Promise.all([
    supa.from("payments").select("*"),
    supa.from("attendance_records").select("*"),
  ]);
  (payRes.data || []).forEach((p: any) => {
    const st = students.find((s) => s.id === p.student_id);
    if (st) st.payments.push({ id: p.id, date: p.date, sessions: p.sessions, amount: p.amount });
  });
  const attRecords: AttRecord[] = (attRes.data || []).map((r: any) => ({
    id: r.id, sessionId: r.session_id, studentId: r.student_id, date: r.date, present: r.present,
  }));
  const zalo = (zRes.data || []).map((r: any): ZaloLink => ({
    id: r.id, code: r.code, name: r.student_name, token: r.token || "",
    chatId: r.chat_id || "", status: r.status, lastMsg: r.last_msg || "",
  }));
  const auto = ((setRes.data || []).find((r: any) => r.key === "zaloAuto")?.value as ZaloAuto) ||
    { attend: true, grades: true, tuition: true, risk: false };
  const adminChatId = ((setRes.data || []).find((r: any) => r.key === "adminZalo")?.value?.chatId as string) || "";

  if (forceSessionId) sessions = sessions.filter((s) => String(s.id) === String(forceSessionId));

  const now = Date.now();
  // 2) Gom tin từ mọi tự động đang bật (hoặc bị force)
  let items: DueReminder[] = [];
  const on = (kind: keyof ZaloAuto) => auto[kind];

  items.push(...dueReminders(sessions, students, zalo, now, { leadMin: lead, windowMin, force: isForced("schedule") }));
  if (on("attend") || isForced("attendance"))
    items.push(...buildAttendanceAlerts(sessions, students, zalo, attRecords, now, { force: isForced("attendance") }));
  if (on("tuition") || isForced("tuition"))
    items.push(...buildTuitionReminders(students, zalo, attRecords, now, { force: isForced("tuition") }));
  if (on("grades") || isForced("grades"))
    items.push(...buildGradeReports(students, sessions, zalo, now, { force: isForced("grades") }));
  if (on("risk") || isForced("risk"))
    items.push(...buildRiskAlerts(students, zalo, now, { force: isForced("risk") }));

  // Thầy (admin): nhận thông báo MỌI buổi sắp tới (không cần học viên liên kết)
  if (adminChatId) {
    const forceAdmin = forcedAll || forceKind === "admin" || forceKind === "schedule" || !!forceSessionId;
    items.push(
      ...dueSessionAlerts(sessions, students, now, { leadMin: lead, windowMin, force: forceAdmin }).map((a) => ({
        kind: "admin" as const, sessionId: a.sessionId, studentId: 0, studentName: "Thầy (Admin)",
        chatId: adminChatId, token: "", text: a.text, dedupKey: a.dedupKey,
      }))
    );
  }

  const anyForce = forcedAll || !!forceKind || !!forceSessionId;

  // 3) Chống gửi trùng (bỏ qua khi force). Nếu chưa migration thì vẫn gửi.
  let dedupReady = true;
  if (!anyForce && items.length) {
    const keys = items.map((d) => d.dedupKey);
    const sent = await supa.from("reminder_sent").select("id").in("id", keys);
    if (sent.error) dedupReady = false;
    else {
      const already = new Set((sent.data || []).map((r: any) => r.id));
      items = items.filter((d) => !already.has(d.dedupKey));
    }
  }

  if (dry) {
    return NextResponse.json({
      ok: true, dry: true, nowUTC: new Date(now).toISOString(), auto, count: items.length,
      preview: items.map((d) => ({ kind: d.kind, to: d.studentName, chatId: d.chatId, hasToken: Boolean(d.token || fallbackToken) })),
    });
  }

  // 4) Gửi + ghi log
  const results: any[] = [];
  const logRows: any[] = [];
  for (const d of items) {
    const token = d.token || fallbackToken;
    if (!token || !d.chatId) {
      results.push({ kind: d.kind, to: d.studentName, ok: false, error: "Thiếu token/chatId" });
      continue;
    }
    try {
      const r = await sendZalo(token, d.chatId, d.text);
      results.push({ kind: d.kind, to: d.studentName, ok: r.ok, error: r.ok ? undefined : (r.data?.description || "gửi lỗi") });
      logRows.push({ kind: d.kind, student_name: d.studentName, chat_id: d.chatId, ok: r.ok, error: r.ok ? "" : String(r.data?.description || "") });
      if (r.ok && !anyForce && dedupReady) await supa.from("reminder_sent").insert({ id: d.dedupKey });
    } catch (e) {
      results.push({ kind: d.kind, to: d.studentName, ok: false, error: (e as Error).message });
      logRows.push({ kind: d.kind, student_name: d.studentName, chat_id: d.chatId, ok: false, error: (e as Error).message });
    }
  }
  // Ghi log (bỏ qua nếu bảng chưa có — chưa migration)
  if (logRows.length) {
    const logRes = await supa.from("message_log").insert(logRows);
    if (logRes.error) results.push({ note: "message_log chưa sẵn sàng (chạy migration)" });
  }

  const sentOk = results.filter((r) => r.ok).length;
  return NextResponse.json({ ok: true, nowUTC: new Date(now).toISOString(), sent: sentOk, total: results.length, results });
}
