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
  const usingServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  // Xác thực: chấp nhận (1) key cron NGOÀI (?key=), HOẶC (2) admin đã đăng nhập
  // gửi Bearer token — dùng cho nút "Nhắc thủ công" trong app mà không lộ key.
  const secret = process.env.CRON_SECRET;
  let authOk = !secret || url.searchParams.get("key") === secret;
  if (!authOk) {
    const tok = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    if (tok) {
      const { data } = await supa.auth.getUser(tok);
      if (data?.user) authOk = true;
    }
  }
  if (!authOk) {
    return NextResponse.json({ ok: false, error: "Không có quyền" }, { status: 401 });
  }

  // Chẩn đoán (có khóa): soi lịch/zalo + lịch sử gửi để tìm vì sao không nhắc.
  if (url.searchParams.get("inspect") === "1") {
    const nowMs = Date.now();
    const vn = new Date(nowMs + 7 * 3600 * 1000);
    const dow = vn.getUTCDay();
    const todayIdx = dow === 0 ? 6 : dow - 1; // 0=T2..6=CN
    const [s, z, log, rem, hb, att, stu] = await Promise.all([
      supa.from("schedule_sessions").select("id,name,day,slot,date").order("day"),
      supa.from("zalo_links").select("student_name,chat_id,status"),
      supa.from("message_log").select("sent_at,kind,student_name,ok,error").order("sent_at", { ascending: false }).limit(15),
      supa.from("reminder_sent").select("id").order("id", { ascending: false }).limit(15),
      supa.from("app_settings").select("value").eq("key", "cron_heartbeat").maybeSingle(),
      supa.from("attendance_records").select("*").order("date"),
      supa.from("students").select("id,name"),
    ]);
    const stuName = new Map((stu.data || []).map((r: any) => [r.id, r.name]));
    const liveSessionIds = new Set((s.data || []).map((r: any) => r.id));
    const hbVal = (hb.data as any)?.value || null;
    const ageMin = hbVal?.at ? Math.round((nowMs - Date.parse(hbVal.at)) / 60000) : null;
    return NextResponse.json({
      ok: true, usingServiceRole,
      nowVN: `${vn.getUTCFullYear()}-${String(vn.getUTCMonth() + 1).padStart(2, "0")}-${String(vn.getUTCDate()).padStart(2, "0")} ${String(vn.getUTCHours()).padStart(2, "0")}:${String(vn.getUTCMinutes()).padStart(2, "0")} (VN)`,
      cronHeartbeat: hbVal,
      cronLastPingAgeMin: ageMin,
      cronAlive: ageMin != null && ageMin <= 16,
      todayDayIndex: todayIdx,
      sessionsError: s.error?.message || null,
      sessions: s.data,
      zalo: (z.data || []).map((r: any) => ({ name: r.student_name, hasChatId: Boolean(r.chat_id), status: r.status })),
      recentSent: log.data,
      recentSentError: log.error?.message || null,
      reminderSentKeys: (rem.data || []).map((r: any) => r.id),
      attendanceError: att.error?.message || null,
      attendanceCount: (att.data || []).length,
      attendance: (att.data || []).map((r: any) => ({
        student: stuName.get(r.student_id) || ("id:" + r.student_id),
        session_id: r.session_id, date: r.date, present: r.present,
        sessionAlive: liveSessionIds.has(r.session_id), // buổi này còn tồn tại không?
      })),
    });
  }

  // Dò giao tin (có khóa): gửi 1 tin THẬT tới bot Thầy + trả về PHẢN HỒI THÔ của Zalo
  // để biết có message_id (giao thật) hay lỗi (chat_id sai...). Kèm tình trạng zalo học viên.
  if (url.searchParams.get("probe") === "1") {
    const fb = process.env.ZALO_BOT_TOKEN || "";
    const setRes = await supa.from("app_settings").select("value").eq("key", "adminZalo").maybeSingle();
    const adminChatId = (((setRes.data as any)?.value?.chatId as string) || "").trim();
    const zRes = await supa.from("zalo_links").select("student_name,token,chat_id,status");
    const zalo = (zRes.data || []).map((r: any) => ({
      name: r.student_name, hasToken: Boolean(r.token),
      chatIdTail: r.chat_id ? String(r.chat_id).slice(-6) : null, status: r.status,
    }));
    let botGetMe: any = null, sendToAdminRaw: any = null;
    if (fb) botGetMe = await fetch(`https://bot-api.zapps.me/bot${fb}/getMe`).then((r) => r.json()).catch((e) => ({ err: String(e) }));
    if (fb && adminChatId) {
      sendToAdminRaw = await fetch(`https://bot-api.zapps.me/bot${fb}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: adminChatId, text: "🔧 EduFlow test giao tin — Thầy thấy tin này nghĩa là bot giao ĐƯỢC ✅" }),
      }).then((r) => r.json()).catch((e) => ({ err: String(e) }));
    }
    return NextResponse.json({
      ok: true,
      adminChatId_present: Boolean(adminChatId),
      adminChatId_tail: adminChatId ? adminChatId.slice(-6) : null,
      fallbackToken_present: Boolean(fb),
      botGetMe, sendToAdminRaw, zalo,
    });
  }

  const dry = url.searchParams.get("dry") === "1";
  const forceParam = url.searchParams.get("force"); // all|schedule|...|<sessionId>|null

  // NHỊP TIM: mỗi cú gọi "trần" (chỉ có key, không dry/force = đúng kiểu cron-job.org)
  // ghi lại thời điểm để biết cron ngoài có còn sống & ping đều không.
  if (!dry && !forceParam) {
    const nowIso = new Date().toISOString();
    const vn = new Date(Date.now() + 7 * 3600 * 1000);
    const atVN = `${vn.getUTCFullYear()}-${String(vn.getUTCMonth() + 1).padStart(2, "0")}-${String(vn.getUTCDate()).padStart(2, "0")} ${String(vn.getUTCHours()).padStart(2, "0")}:${String(vn.getUTCMinutes()).padStart(2, "0")}`;
    const prev = await supa.from("app_settings").select("value").eq("key", "cron_heartbeat").maybeSingle();
    const count = (((prev.data as any)?.value?.count as number) || 0) + 1;
    await supa.from("app_settings").upsert({ key: "cron_heartbeat", value: { at: nowIso, atVN, count } });
  }

  const lead = Number(url.searchParams.get("lead")) || 20;
  // Cửa sổ nhắc rộng 20' để cron ngoài dù chạy 5–15' vẫn CHẮC CHẮN không trượt
  // (cron 15' + cửa sổ 20' luôn có ít nhất 1 cú ping rơi vào, dư 5' biên).
  // Chống trùng (reminder_sent) đảm bảo mỗi buổi chỉ nhắc 1 lần dù cửa sổ rộng.
  const windowMin = Number(url.searchParams.get("window")) || 20;
  const fallbackToken = process.env.ZALO_BOT_TOKEN || "";
  const forceSessionId = forceParam && /^\d+$/.test(forceParam) ? forceParam : null;
  const forceKind = forceParam && !forceSessionId ? forceParam : null; // "all" hoặc tên loại
  const forcedAll = forceKind === "all";
  // Nút "Nhắc thủ công" trong app: force=today → chỉ lớp HÔM NAY, gửi Thầy + trò ngay.
  const forceToday = forceKind === "today";
  const isForced = (kind: string) =>
    forcedAll || forceKind === kind || (kind === "schedule" && (!!forceSessionId || forceToday));

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

  // Bẫy hay gặp: đã khóa RLS nhưng cron chưa có service_role → đọc ra RỖNG (không lỗi).
  // Đọc 0 buổi + 0 học viên mà không dùng service_role → gần như chắc chắn bị RLS chặn.
  const looksBlocked = !usingServiceRole && sessions.length === 0 && students.length === 0;
  const rlsWarning = looksBlocked
    ? "⚠️ Đọc DB ra RỖNG và cron KHÔNG dùng service_role. Nhiều khả năng RLS đã khóa. Hãy thêm SUPABASE_SERVICE_ROLE_KEY vào Vercel rồi redeploy, nếu không sẽ KHÔNG gửi được thông báo nào."
    : undefined;
  if (looksBlocked) console.error("[cron]", rlsWarning);

  if (forceSessionId) sessions = sessions.filter((s) => String(s.id) === String(forceSessionId));
  if (forceToday) {
    const vnT = new Date(Date.now() + 7 * 3600 * 1000);
    const todayIdx = vnT.getUTCDay() === 0 ? 6 : vnT.getUTCDay() - 1; // 0=T2..6=CN
    sessions = sessions.filter((s) => s.day === todayIdx);
  }

  const now = Date.now();
  // 2) Gom tin từ mọi tự động đang bật (hoặc bị force)
  let items: DueReminder[] = [];
  const on = (kind: keyof ZaloAuto) => auto[kind];

  items.push(...dueReminders(sessions, students, zalo, now, { leadMin: lead, windowMin, force: isForced("schedule") }));
  // Nút "Nhắc thủ công" (today) chỉ gửi nhắc lịch cho Thầy + trò, KHÔNG kèm các
  // loại cảnh báo khác (chuyên cần/học phí/điểm/rủi ro).
  if (!forceToday) {
    if (on("attend") || isForced("attendance"))
      items.push(...buildAttendanceAlerts(sessions, students, zalo, attRecords, now, { force: isForced("attendance") }));
    if (on("tuition") || isForced("tuition"))
      items.push(...buildTuitionReminders(students, zalo, attRecords, now, { force: isForced("tuition") }));
    if (on("grades") || isForced("grades"))
      items.push(...buildGradeReports(students, sessions, zalo, now, { force: isForced("grades") }));
    if (on("risk") || isForced("risk"))
      items.push(...buildRiskAlerts(students, zalo, now, { force: isForced("risk") }));
  }

  // Thầy (admin): nhận thông báo MỌI buổi sắp tới (không cần học viên liên kết)
  if (adminChatId) {
    const forceAdmin = forcedAll || forceKind === "admin" || forceKind === "schedule" || !!forceSessionId || forceToday;
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
      usingServiceRole, loaded: { sessions: sessions.length, students: students.length, zalo: zalo.length },
      warning: rlsWarning,
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
  return NextResponse.json({
    ok: true, nowUTC: new Date(now).toISOString(), sent: sentOk, total: results.length,
    usingServiceRole, loaded: { sessions: sessions.length, students: students.length, zalo: zalo.length },
    warning: rlsWarning, results,
  });
}
