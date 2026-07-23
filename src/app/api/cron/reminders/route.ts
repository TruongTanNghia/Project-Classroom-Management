import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { dueReminders } from "@/lib/reminders";
import type { Session, Student, ZaloLink } from "@/lib/types";

// Cron nhắc lịch học: một dịch vụ cron ngoài (VD cron-job.org) gọi route này
// mỗi ~5 phút. Route tìm các buổi sắp bắt đầu trong ~20 phút tới rồi gửi tin
// Zalo tới từng học viên (dùng bot riêng của học viên), chống gửi trùng.
//
//   GET /api/cron/reminders?key=<CRON_SECRET>
//   &dry=1              → chỉ xem trước, không gửi
//   &force=<sessionId>  → gửi ngay 1 buổi bất kể giờ (để test)
//   &lead=20&window=7   → chỉnh phút nhắc trước / độ rộng cửa sổ

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
  const supaKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supaUrl || !supaKey) {
    return NextResponse.json({ ok: false, error: "Chưa cấu hình Supabase" }, { status: 503 });
  }
  const supa = createClient(supaUrl, supaKey);

  const dry = url.searchParams.get("dry") === "1";
  const forceId = url.searchParams.get("force");
  const lead = Number(url.searchParams.get("lead")) || 20;
  const windowMin = Number(url.searchParams.get("window")) || 7;
  const fallbackToken = process.env.ZALO_BOT_TOKEN || "";

  // 1) Nạp dữ liệu
  const [sRes, stRes, zRes] = await Promise.all([
    supa.from("schedule_sessions").select("*"),
    supa.from("students").select("id,name"),
    supa.from("zalo_links").select("*"),
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
  const students = (stRes.data || []) as Student[];
  const zalo = (zRes.data || []).map((r: any): ZaloLink => ({
    id: r.id, code: r.code, name: r.student_name, token: r.token || "",
    chatId: r.chat_id || "", status: r.status, lastMsg: r.last_msg || "",
  }));

  const force = Boolean(forceId);
  if (force) sessions = sessions.filter((s) => String(s.id) === String(forceId));

  const now = Date.now();
  let due = dueReminders(sessions, students, zalo, now, { leadMin: lead, windowMin, force });

  // 2) Chống gửi trùng: bỏ các dedupKey đã có trong reminder_sent (trừ khi force)
  // Nếu chưa chạy migration (bảng reminder_sent chưa có) thì bỏ qua bước này.
  let dedupReady = true;
  if (!force && due.length) {
    const keys = due.map((d) => d.dedupKey);
    const sent = await supa.from("reminder_sent").select("id").in("id", keys);
    if (sent.error) {
      dedupReady = false; // bảng chưa tồn tại → vẫn gửi nhưng không chống trùng được
    } else {
      const already = new Set((sent.data || []).map((r: any) => r.id));
      due = due.filter((d) => !already.has(d.dedupKey));
    }
  }

  if (dry) {
    return NextResponse.json({
      ok: true, dry: true, nowUTC: new Date(now).toISOString(), count: due.length,
      preview: due.map((d) => ({ to: d.studentName, at: d.startVN, chatId: d.chatId, hasToken: Boolean(d.token || fallbackToken) })),
    });
  }

  // 3) Gửi + ghi nhật ký
  const results: any[] = [];
  for (const d of due) {
    const token = d.token || fallbackToken;
    if (!token) {
      results.push({ to: d.studentName, ok: false, error: "Không có bot token" });
      continue;
    }
    try {
      const r = await sendZalo(token, d.chatId, d.text);
      results.push({ to: d.studentName, at: d.startVN, ok: r.ok, error: r.ok ? undefined : (r.data?.description || "gửi lỗi") });
      if (r.ok && !force && dedupReady) {
        await supa.from("reminder_sent").insert({ id: d.dedupKey });
      }
    } catch (e) {
      results.push({ to: d.studentName, ok: false, error: (e as Error).message });
    }
  }

  const sentOk = results.filter((r) => r.ok).length;
  return NextResponse.json({ ok: true, nowUTC: new Date(now).toISOString(), sent: sentOk, total: results.length, results });
}
