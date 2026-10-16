import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { askGemini, geminiKey } from "@/lib/gemini";

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

/** Tin quá dài thì cắt thành nhiều tin (Zalo giới hạn độ dài). */
async function sendLong(token: string, chatId: string, text: string) {
  const LIMIT = 1800;
  if (text.length <= LIMIT) return send(token, chatId, text);
  const NL = String.fromCharCode(10);
  const lines = text.split(NL);
  let buf = "";
  for (const ln of lines) {
    if ((buf + NL + ln).length > LIMIT && buf) {
      await send(token, chatId, buf);
      buf = ln;
    } else {
      buf = buf ? buf + NL + ln : ln;
    }
  }
  if (buf) await send(token, chatId, buf);
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

  // Ai đang nhắn? Thầy (admin) hay học viên — nhận diện bằng chat_id.
  // Học viên chỉ xem được dữ liệu CỦA CHÍNH MÌNH, không thấy của ai khác.
  const [setRes, linkRes] = await Promise.all([
    supa.from("app_settings").select("value").eq("key", "adminZalo").maybeSingle(),
    supa.from("zalo_links").select("student_name,token,chat_id,status"),
  ]);
  const adminChatId = (((setRes.data as any)?.value?.chatId as string) || "").trim();
  const link = (linkRes.data || []).find(
    (z: any) => String(z.chat_id || "").trim() === chatId && String(z.chat_id || "").trim() !== ""
  );
  const isAdmin = Boolean(adminChatId) && chatId === adminChatId;
  // Trả lời bằng CHÍNH con bot đã nhận tin (bot riêng của từng học viên)
  const replyToken = isAdmin ? token : String(link?.token || "").trim() || token;
  if (!isAdmin && !link) {
    await send(
      replyToken,
      chatId,
      `Xin chào! Đây là bot của AIhoclaptrinh 🤖

Bot chỉ phục vụ học viên đã được kết nối. Em liên hệ Thầy để được kết nối nha!`
    );
    return NextResponse.json({ ok: true, note: "unknown sender" });
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
  const zalos = linkRes.data || [];

  const now = Date.now();
  const vn = new Date(now + VN_MS);
  const todayISO = `${vn.getUTCFullYear()}-${p2(vn.getUTCMonth() + 1)}-${p2(vn.getUTCDate())}`;
  const dow = vn.getUTCDay();
  const todayIdx = dow === 0 ? 6 : dow - 1; // 0=T2 … 6=CN
  const stamp = `${p2(vn.getUTCHours())}:${p2(vn.getUTCMinutes())} ${dmy(todayISO)}`;
  const nameById = new Map<number, string>(students.map((s: any) => [s.id, s.name]));
  const unpaidOf = (sid: number) =>
    att.filter((r: any) => r.student_id === sid && r.present && !r.paid).length;
  // Họ tên ĐẦY ĐỦ của học viên trong buổi
  const rosterOf = (s: any) =>
    (s.student_ids || []).map((id: number) => nameById.get(id) || "").filter(Boolean);
  // "đã học N / chu kỳ buổi" — chu kỳ = số buổi quy định thì thu học phí
  const progressOf = (id: number) => {
    const st = students.find((x: any) => x.id === id);
    if (!st) return null;
    const n = unpaidOf(id);
    const cyc = st.cycle || 10;
    return { name: st.name, n, cyc, due: n >= cyc };
  };
  // Buổi đã tới ngày bắt đầu chưa
  const started = (s: any) => !s.date || String(s.date) <= todayISO;

  const q = noAccent(text);

  /* ================= HỌC VIÊN: chỉ dữ liệu CỦA CHÍNH MÌNH ================= */
  if (!isAdmin) {
    const me = students.find((s: any) => s.name === String((link as any)?.student_name || ""));
    if (!me) {
      await send(replyToken, chatId, "Bot chưa tìm thấy hồ sơ học viên của em. Em báo Thầy giúp nha 🙏");
      return NextResponse.json({ ok: true, note: "student not found" });
    }
    // CHỈ lấy các buổi mà chính em này được xếp vào
    const mine = sessions
      .filter((s: any) => (s.student_ids || []).includes(me.id) && started(s))
      .sort((a: any, b: any) => a.day - b.day || String(a.slot).localeCompare(String(b.slot)));
    const myAtt = att.filter((r: any) => r.student_id === me.id);
    const learned = myAtt.filter((r: any) => r.present).length;
    const owe = unpaidOf(me.id);
    const cyc = me.cycle || 10;
    let r = "";

    if (q === "tuan" || q.includes("lich tuan") || q.includes("ca tuan")) {
      r = `🗓️ LỊCH HỌC CẢ TUẦN CỦA EM

👤 ${me.name}
`;
      if (!mine.length) {
        r += `
Em chưa được xếp lịch học nào. Em hỏi Thầy giúp nha!`;
      } else {
        for (let d = 0; d < 7; d++) {
          const list = mine.filter((s: any) => s.day === d);
          if (!list.length) continue;
          r += `
${DAYS[d]}:
`;
          list.forEach((s: any) => {
            r += `  • ${s.slot} · ${s.name}${s.room ? " · " + s.room : ""}
`;
          });
        }
        r += `
📊 Tổng: ${mine.length} buổi/tuần`;
      }
    } else if (q === "hp" || q.includes("hoc phi")) {
      r =
        `💰 HỌC PHÍ CỦA EM

👤 ${me.name}
` +
        `📚 Đã học chưa đóng: ${owe}/${cyc} buổi
` +
        `💵 Học phí: ${money(me.fee)}
`;
      r +=
        owe >= cyc
          ? `
⚠️ Em đã học đủ ${cyc} buổi rồi, nhớ sắp xếp đóng học phí giúp Thầy nha!`
          : `
Em còn ${cyc - owe} buổi nữa là tới kỳ đóng học phí.`;
    } else if (q === "bh" || q.includes("buoi") || q === "dd" || q.includes("diem danh")) {
      r =
        `✅ SỐ BUỔI ĐÃ HỌC CỦA EM

👤 ${me.name}
` +
        `📚 Tổng đã học: ${learned} buổi
` +
        `📌 Chưa đóng học phí: ${owe}/${cyc} buổi
`;
      const last = myAtt
        .filter((x: any) => x.present)
        .sort((a: any, b: any) => String(b.date).localeCompare(String(a.date)))
        .slice(0, 5);
      if (last.length) {
        r += `
🕘 5 buổi gần nhất:
`;
        last.forEach((x: any) => {
          const s = sessions.find((y: any) => y.id === x.session_id);
          r += `• ${s?.name || "Buổi học"} · ${dmy(x.date)}
`;
        });
      }
    } else if (q === "lich" || q === "ld" || q.includes("lich hoc") || q.includes("hom nay")) {
      const today = mine.filter((s: any) => s.day === todayIdx);
      r = `📅 LỊCH HỌC HÔM NAY · ${DAYS[todayIdx]} ${dmy(todayISO)}

👤 ${me.name}
`;
      if (!today.length) {
        r += `
Hôm nay em không có buổi học nào nha 😌`;
      } else {
        today.forEach((s: any, i: number) => {
          r += `
${i + 1}) ${s.slot} · ${s.name}
`;
          if (s.room) r += `   🏫 ${s.room}
`;
        });
        r += `
Chúc em học tốt! 💪`;
      }
    } else {
      r =
        `🤖 AIhoclaptrinh · Chào em ${me.name}!

` +
        `Em gõ một trong các lệnh sau:

` +
        `📅 lich — lịch học HÔM NAY
` +
        `🗓️ tuan — lịch học CẢ TUẦN
` +
        `✅ bh — số buổi em đã học
` +
        `💰 hp — học phí của em
` +
        `❓ menu — xem lại bảng lệnh này

` +
        `(Gõ có dấu hay không dấu đều được)`;
    }
    await send(replyToken, chatId, r);
    return NextResponse.json({ ok: true, replied: true, as: "student" });
  }

  /* ===================== THẦY (ADMIN) ===================== */
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
          reply += `• ${x.s.name}\n   đã học ${x.n}/${x.s.cycle || 10} buổi · ${money(x.s.fee)}\n`;
        });
      }
      if (soon.length) {
        reply += `\n🟡 Đang học dở (${soon.length}):\n`;
        soon.forEach((x) => {
          reply += `• ${x.s.name}\n   đã học ${x.n}/${x.s.cycle || 10} buổi\n`;
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
        const ids: number[] = s.student_ids || [];
        const done = att.filter((a: any) => a.session_id === s.id && a.date === todayISO && a.present).length;
        reply += `\n${i + 1}) ${s.slot} · ${s.name}\n`;
        if (s.room) reply += `   🏫 ${s.room}\n`;
        if (!ids.length) {
          reply += `   👥 (chưa xếp học viên)\n`;
        } else {
          ids.forEach((id) => {
            const p = progressOf(id);
            if (!p) return;
            reply += `   👤 ${p.name}\n      đã học ${p.n}/${p.cyc} buổi${p.due ? " ⚠️ ĐẾN KỲ THU" : ""}\n`;
          });
        }
        if (done > 0) reply += `   ✅ Đã điểm danh: ${done}/${ids.length}\n`;
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
  } else if (q === "kt" || q.includes("kiem tra") || q === "audit" || q.includes("suc khoe")) {
    /* ---------- 🩺 KIỂM TRA HỆ THỐNG ---------- */
    const payQ = await supa.from("payments").select("id,student_id,date,sessions,amount");
    const pays = (payQ.data || []) as any[];
    const issues: string[] = [];

    const dupAtt = Object.entries(
      att.reduce((m: any, a: any) => {
        const k = a.session_id + "|" + a.student_id + "|" + a.date;
        m[k] = (m[k] || 0) + 1;
        return m;
      }, {})
    ).filter(([, n]) => (n as number) > 1);
    if (dupAtt.length) issues.push("• " + dupAtt.length + " bản ghi điểm danh bị trùng");

    const sesIds = new Set(sessions.map((x: any) => x.id));
    const orphan = att.filter((a: any) => a.session_id != null && !sesIds.has(a.session_id));
    if (orphan.length) issues.push("• " + orphan.length + " điểm danh trỏ tới buổi đã xoá");

    const dupPay = Object.entries(
      pays.reduce((m: any, p) => {
        const k = [p.student_id, p.date, p.sessions, p.amount].join("|");
        m[k] = (m[k] || 0) + 1;
        return m;
      }, {})
    ).filter(([, n]) => (n as number) > 1);
    if (dupPay.length) issues.push("• " + dupPay.length + " phiếu thu bị trùng");

    const overPay = pays.filter((p) => {
      const c = students.find((x: any) => x.id === p.student_id)?.cycle || 10;
      return p.sessions > c;
    });
    if (overPay.length) issues.push("• " + overPay.length + " phiếu thu vượt chu kỳ");

    const hasPay = new Set(pays.map((p) => p.student_id));
    const ghost = att.filter((a: any) => a.paid && !hasPay.has(a.student_id));
    if (ghost.length) issues.push("• " + ghost.length + " buổi đánh dấu đã thu mà không có phiếu");

    const noFee = students.filter((x: any) => !String(x.fee || "").trim());
    if (noFee.length) issues.push("• Chưa đặt học phí: " + noFee.map((x: any) => x.name).join(", "));

    const noBot = students.filter(
      (x: any) => !(zalos || []).some((z: any) => z.student_name === x.name && String(z.chat_id || "").trim())
    );
    if (noBot.length) issues.push("• Chưa có bot Zalo: " + noBot.map((x: any) => x.name).join(", "));

    reply =
      "🩺 KIỂM TRA HỆ THỐNG · " + stamp + "\n\n" +
      "📊 Dữ liệu hiện có:\n" +
      "   • " + students.length + " học viên\n" +
      "   • " + sessions.length + " buổi học/tuần\n" +
      "   • " + att.length + " bản ghi điểm danh\n" +
      "   • " + pays.length + " phiếu thu\n\n" +
      (issues.length
        ? "⚠️ Cần để ý (" + issues.length + "):\n" + issues.join("\n")
        : "✅ Mọi thứ sạch sẽ, không có lỗi dữ liệu nào.");
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
    // Không khớp lệnh cố định nào → nhờ Gemini trả lời, kèm ngữ cảnh dữ liệu lớp.
    const key = geminiKey();
    if (!key) {
      reply = MENU;
    } else {
      const BR = String.fromCharCode(10);
      const ctxLines: string[] = [];
      ctxLines.push("HÔM NAY: " + DAYS[todayIdx] + " " + dmy(todayISO));
      ctxLines.push("");
      ctxLines.push("HỌC VIÊN (tên | trạng thái | chu kỳ thu | tổng buổi đã học | buổi chưa đóng | học phí):");
      students.forEach((st: any) => {
        const mine = att.filter((a: any) => a.student_id === st.id && a.present);
        ctxLines.push(
          "- " + st.name + " | " + (st.status || "") + " | " + (st.cycle || 10) + " buổi/kỳ | " +
          mine.length + " buổi | " + unpaidOf(st.id) + " buổi chưa đóng | " + (st.fee || "chưa đặt")
        );
      });
      ctxLines.push("");
      ctxLines.push("LỊCH HỌC HÀNG TUẦN (thứ | giờ | lớp | phòng | học viên):");
      sessions
        .filter((x: any) => started(x))
        .sort((a: any, b: any) => a.day - b.day || String(a.slot).localeCompare(String(b.slot)))
        .forEach((x: any) => {
          ctxLines.push(
            "- " + DAYS[x.day] + " | " + x.slot + " | " + x.name + " | " + (x.room || "—") +
            " | " + (rosterOf(x).join(", ") || "chưa xếp")
          );
        });

      const system = [
        "Bạn là trợ lý AI riêng của thầy Trương Tấn Nghĩa (trung tâm AIhoclaptrinh).",
        "Người đang nhắn là THẦY. Trả lời bằng tiếng Việt, xưng 'em', gọi người hỏi là 'Thầy'.",
        "",
        "BẠN LÀM ĐƯỢC 2 VIỆC:",
        "1) TRỢ LÝ LỚP HỌC — khi Thầy hỏi về học viên, lịch dạy, điểm danh, học phí:",
        "   chỉ dùng DỮ LIỆU bên dưới, TUYỆT ĐỐI KHÔNG bịa số liệu/tên/ngày giờ.",
        "   Dữ liệu không có thì nói thẳng là chưa có, đừng đoán.",
        "2) TRỢ LÝ ĐA NĂNG — mọi câu hỏi khác (lập trình, AI, toán, dịch thuật, soạn",
        "   nội dung, ý tưởng dạy học, đời sống...): cứ trả lời đầy đủ và hữu ích",
        "   như một trợ lý AI thông thường, KHÔNG cần bám vào dữ liệu lớp học.",
        "",
        "CÁCH VIẾT (đây là tin nhắn Zalo):",
        "- KHÔNG dùng markdown (**, ##, bảng, khối code ```). Viết chữ thuần.",
        "- Dùng gạch đầu dòng '-' hoặc đánh số, emoji vừa phải cho dễ đọc.",
        "- Câu hỏi tra cứu thì trả lời ngắn gọn; câu hỏi cần giải thích thì được",
        "  viết dài hơn nhưng tránh lan man.",
        "",
        "=== DỮ LIỆU LỚP HỌC (chỉ dùng khi câu hỏi liên quan) ===",
        ctxLines.join(BR),
      ].join(BR);

      const r = await askGemini(system, text);
      reply = r.ok
        ? (r.text as string)
        : "Em chưa trả lời được câu này (" + (r.error || "lỗi AI") + ")." + BR + BR + MENU;
    }
  }

  await sendLong(token, adminChatId, reply);
  return NextResponse.json({ ok: true, replied: true });
}

// Một số dịch vụ kiểm tra webhook bằng GET — trả 200 cho chắc.
export async function GET() {
  return NextResponse.json({ ok: true, service: "zalo-webhook" });
}
