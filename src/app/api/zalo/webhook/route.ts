import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// BOT TRỢ LÝ CHO THẦY — Thầy nhắn vào bot Zalo, hệ thống trả lời ngay.
// KHÔNG dùng LLM: chỉ khớp từ khoá cố định (hỏi gì đáp nấy).
//
// Zalo (Zapps) đẩy tin vào đây qua webhook:
//   setWebhook(url = https://<domain>/api/zalo/webhook?key=<CRON_SECRET>,
//              secret_token = <CRON_SECRET>)
//
// BẢO MẬT: chỉ trả lời dữ liệu cho ĐÚNG chat của Thầy (adminZalo.chatId).
// Người lạ nhắn vào bot sẽ chỉ nhận câu chào, không lộ thông tin học viên.

const ZAPPS = "https://bot-api.zapps.me";
const VN_MS = 7 * 3600 * 1000;
const p2 = (n: number) => String(n).padStart(2, "0");

/* eslint-disable @typescript-eslint/no-explicit-any */

async function send(token: string, chatId: string, text: string) {
  try {
    await fetch(`${ZAPPS}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch {
    /* bỏ qua — không để lỗi gửi làm hỏng webhook */
  }
}

/** Bỏ dấu tiếng Việt để khớp lệnh kiểu gì cũng nhận. */
const noAccent = (s: string) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();

const dmy = (iso: string) => iso.slice(8, 10) + "/" + iso.slice(5, 7) + "/" + iso.slice(0, 4);
const money = (v?: string) => {
  const n = parseInt(String(v ?? "").replace(/[^0-9]/g, ""), 10) || 0;
  return n > 0 ? n.toLocaleString("vi-VN") + "₫" : String(v || "—");
};
/** Tên gọi: "Lê Quang Nhân" → "Nhân" */
const given = (full: string) => {
  const w = String(full || "").trim().split(/\s+/);
  return w[w.length - 1] || full;
};
const DAYS = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

const MENU =
  `🤖 TRỢ LÝ AIhoclaptrinh\n\n` +
  `Thầy gõ một trong các lệnh sau:\n\n` +
  `💰 hp  — ai đang nợ học phí, bao nhiêu buổi\n` +
  `📅 lich  — lịch dạy HÔM NAY\n` +
  `🗓️ tuan  — lịch cả TUẦN\n` +
  `👥 hv  — danh sách học viên\n` +
  `✅ dd  — điểm danh hôm nay\n` +
  `❓ menu  — xem lại bảng lệnh này\n\n` +
  `(Gõ có dấu hay không dấu đều được)`;

export async function POST(request: Request) {
  const url = new URL(request.url);
  const secret = process.env.CRON_SECRET || "";
  const headerTok = request.headers.get("x-bot-api-secret-token") || "";
  const queryTok = url.searchParams.get("key") || "";
  if (secret && headerTok !== secret && queryTok !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: true, note: "no body" });
  }

  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supaKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supaUrl || !supaKey) return NextResponse.json({ ok: false, error: "no supabase" });
  const supa = createClient(supaUrl, supaKey, { auth: { persistSession: false } });

  // Lưu payload thô gần nhất để dễ soi khi cần chỉnh cách đọc tin
  await supa
    .from("app_settings")
    .upsert({ key: "zalo_webhook_last", value: { at: new Date().toISOString(), body } });

  // Bóc chat_id + nội dung (phòng nhiều dạng payload khác nhau)
  const m = body.message || body.data || body;
  const chatId = String(
    m?.chat?.id ?? m?.chat_id ?? m?.from?.id ?? body?.chat?.id ?? body?.from?.id ?? ""
  ).trim();
  const text = String(m?.text ?? m?.message?.text ?? body?.text ?? "").trim();
  if (!chatId || !text) return NextResponse.json({ ok: true, note: "no chat/text" });

  const token = process.env.ZALO_BOT_TOKEN || "";
  if (!token) return NextResponse.json({ ok: false, error: "no token" });

  // Chỉ phục vụ chat của Thầy
  const setRes = await supa.from("app_settings").select("value").eq("key", "adminZalo").maybeSingle();
  const adminChatId = (((setRes.data as any)?.value?.chatId as string) || "").trim();
  if (!adminChatId || chatId !== adminChatId) {
    await send(token, chatId, "Xin chào! Đây là bot thông báo của AIhoclaptrinh 🤖");
    return NextResponse.json({ ok: true, note: "not admin" });
  }

  // ---- Nạp dữ liệu ----
  const [stuRes, sesRes, attRes] = await Promise.all([
    supa.from("students").select("*").order("id"),
    supa.from("schedule_sessions").select("*").order("day"),
    supa.from("attendance_records").select("*"),
  ]);
  const students = stuRes.data || [];
  const sessions = sesRes.data || [];
  const att = attRes.data || [];

  const now = Date.now();
  const vn = new Date(now + VN_MS);
  const todayISO = `${vn.getUTCFullYear()}-${p2(vn.getUTCMonth() + 1)}-${p2(vn.getUTCDate())}`;
  const dow = vn.getUTCDay();
  const todayIdx = dow === 0 ? 6 : dow - 1; // 0=T2 … 6=CN
  const stamp = `${p2(vn.getUTCHours())}:${p2(vn.getUTCMinutes())} ${dmy(todayISO)}`;
  const nameById = new Map<number, string>(students.map((s: any) => [s.id, s.name]));
  const unpaidOf = (sid: number) =>
    att.filter((r: any) => r.student_id === sid && r.present && !r.paid).length;
  const rosterOf = (s: any) =>
    (s.student_ids || []).map((id: number) => given(nameById.get(id) || "")).filter(Boolean);
  // Buổi đã tới ngày bắt đầu chưa
  const started = (s: any) => !s.date || String(s.date) <= todayISO;

  const q = noAccent(text);
  let reply = "";

  /* ---------- 💰 HỌC PHÍ ---------- */
  if (q === "hp" || q.includes("hoc phi") || q.includes("no tien") || q === "no") {
    const rows = students
      .map((s: any) => ({ s, n: unpaidOf(s.id) }))
      .filter((x) => x.n > 0)
      .sort((a, b) => b.n - a.n);
    if (!rows.length) {
      reply = `💰 HỌC PHÍ · ${stamp}\n\nTuyệt vời! Không có học viên nào đang nợ buổi nào 🎉`;
    } else {
      const due = rows.filter((x) => x.n >= (x.s.cycle || 10));
      const soon = rows.filter((x) => x.n < (x.s.cycle || 10));
      const total = rows.reduce((a, x) => a + x.n, 0);
      reply = `💰 HỌC PHÍ · ${stamp}\n`;
      if (due.length) {
        reply += `\n⚠️ ĐẾN KỲ THU (${due.length}):\n`;
        due.forEach((x) => {
          reply += `• ${x.s.name} — ${x.n} buổi · ${money(x.s.fee)}\n`;
        });
      }
      if (soon.length) {
        reply += `\n🟡 Đang học dở (${soon.length}):\n`;
        soon.forEach((x) => {
          reply += `• ${x.s.name} — ${x.n}/${x.s.cycle || 10} buổi\n`;
        });
      }
      reply += `\n📊 Tổng chưa thu: ${total} buổi / ${rows.length} học viên`;
    }
  } else if (q === "tuan" || q.includes("lich tuan") || q.includes("ca tuan")) {
    /* ---------- 🗓️ LỊCH TUẦN ---------- */
    reply = `🗓️ LỊCH DẠY CẢ TUẦN\n`;
    let count = 0;
    for (let d = 0; d < 7; d++) {
      const list = sessions
        .filter((s: any) => s.day === d && started(s))
        .sort((a: any, b: any) => String(a.slot).localeCompare(String(b.slot)));
      if (!list.length) continue;
      reply += `\n${DAYS[d]}:\n`;
      list.forEach((s: any) => {
        count++;
        const r = rosterOf(s);
        reply += `  • ${s.slot} · ${s.name}${r.length ? " (" + r.join(", ") + ")" : ""}\n`;
      });
    }
    reply += `\n📊 Tổng: ${count} buổi/tuần`;
  } else if (q === "lich" || q === "ld" || q.includes("lich day") || q.includes("lich hoc") || q.includes("hom nay")) {
    /* ---------- 📅 LỊCH HÔM NAY ---------- */
    const list = sessions
      .filter((s: any) => s.day === todayIdx && started(s))
      .sort((a: any, b: any) => String(a.slot).localeCompare(String(b.slot)));
    reply = `📅 LỊCH DẠY HÔM NAY · ${DAYS[todayIdx]} ${dmy(todayISO)}\n`;
    if (!list.length) {
      reply += `\nHôm nay Thầy không có buổi dạy nào. Nghỉ ngơi thôi ạ 😌`;
    } else {
      list.forEach((s: any, i: number) => {
        const r = rosterOf(s);
        const done = att.filter((a: any) => a.session_id === s.id && a.date === todayISO && a.present).length;
        reply += `\n${i + 1}) ${s.slot} · ${s.name}\n`;
        if (s.room) reply += `   🏫 ${s.room}\n`;
        reply += `   👥 ${r.length ? r.join(", ") : "chưa xếp học viên"}`;
        reply += `   ${done > 0 ? `· ✅ điểm danh ${done}/${r.length}` : ""}\n`;
      });
      reply += `\n📊 Tổng: ${list.length} buổi hôm nay`;
    }
  } else if (q === "hv" || q.includes("hoc vien") || q.includes("danh sach")) {
    /* ---------- 👥 HỌC VIÊN ---------- */
    reply = `👥 DANH SÁCH HỌC VIÊN (${students.length})\n`;
    students.forEach((s: any, i: number) => {
      const n = unpaidOf(s.id);
      const st = s.status === "Active" ? "Đang học" : s.status === "At risk" ? "Cần chú ý" : "Bảo lưu";
      reply += `\n${i + 1}. ${s.name} — ${st}${n > 0 ? ` · nợ ${n} buổi` : ""}`;
    });
  } else if (q === "dd" || q.includes("diem danh")) {
    /* ---------- ✅ ĐIỂM DANH HÔM NAY ---------- */
    const list = sessions.filter((s: any) => s.day === todayIdx && started(s));
    reply = `✅ ĐIỂM DANH HÔM NAY · ${dmy(todayISO)}\n`;
    if (!list.length) {
      reply += `\nHôm nay không có buổi nào.`;
    } else {
      list.forEach((s: any) => {
        const ids: number[] = s.student_ids || [];
        const marks = att.filter((a: any) => a.session_id === s.id && a.date === todayISO);
        const present = marks.filter((a: any) => a.present).length;
        reply += `\n• ${s.slot} · ${s.name}: ${present}/${ids.length} có mặt`;
        if (!marks.length) reply += ` (⚠️ chưa điểm danh)`;
      });
    }
  } else {
    reply = MENU;
  }

  await send(token, adminChatId, reply);
  return NextResponse.json({ ok: true, replied: true });
}

// Một số dịch vụ kiểm tra webhook bằng GET — trả 200 cho chắc.
export async function GET() {
  return NextResponse.json({ ok: true, service: "zalo-webhook" });
}
