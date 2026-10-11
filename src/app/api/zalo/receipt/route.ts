import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { receiptSig } from "@/app/bienlai/[code]/route";

// Gửi LINK BIÊN LAI thu học phí cho học viên qua Zalo.
// Chỉ admin đã đăng nhập mới gọi được (gửi Bearer token của phiên Supabase).
//   POST { paymentId: number }

/* eslint-disable @typescript-eslint/no-explicit-any */

const money = (v?: string) => {
  const n = parseInt(String(v ?? "").replace(/[^0-9]/g, ""), 10) || 0;
  return n > 0 ? n.toLocaleString("vi-VN") + "₫" : String(v || "—");
};

export async function POST(request: Request) {
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supaKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supaUrl || !supaKey) {
    return NextResponse.json({ ok: false, error: "Chưa cấu hình Supabase" }, { status: 503 });
  }
  const supa = createClient(supaUrl, supaKey, { auth: { persistSession: false } });

  // Xác thực: admin đang đăng nhập trong app
  const tok = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!tok) return NextResponse.json({ ok: false, error: "Chưa đăng nhập" }, { status: 401 });
  const { data: who } = await supa.auth.getUser(tok);
  if (!who?.user) return NextResponse.json({ ok: false, error: "Không có quyền" }, { status: 401 });

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body không hợp lệ" }, { status: 400 });
  }
  const paymentId = Number(body.paymentId);
  if (!paymentId) return NextResponse.json({ ok: false, error: "Thiếu paymentId" }, { status: 400 });

  const { data: p } = await supa.from("payments").select("*").eq("id", paymentId).maybeSingle();
  if (!p) return NextResponse.json({ ok: false, error: "Không tìm thấy phiếu thu" }, { status: 404 });

  const { data: st } = await supa.from("students").select("name").eq("id", (p as any).student_id).maybeSingle();
  const name = (st as any)?.name || "";
  const { data: links } = await supa.from("zalo_links").select("student_name,token,chat_id");
  const link = (links || []).find((z: any) => z.student_name === name && String(z.chat_id || "").trim());
  if (!link) {
    return NextResponse.json({ ok: false, error: name + " chưa liên kết Zalo" }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const url = origin + "/bienlai/" + paymentId + "." + receiptSig(paymentId);
  const BR = String.fromCharCode(10);
  const text = [
    "🧾 AIhoclaptrinh · BIÊN LAI THU HỌC PHÍ",
    "",
    "Chào em " + name + ",",
    "",
    "Thầy đã nhận học phí của em, cảm ơn em nhiều nha:",
    "",
    "   • Số buổi: " + (p as any).sessions + " buổi",
    "   • Số tiền: " + money((p as any).amount),
    "   • Ngày thu: " + (p as any).date,
    "",
    "Em xem biên lai chi tiết tại đây:",
    url,
    "",
    "Chúc em học thật tốt! 💙",
  ].join(BR);

  const token = String((link as any).token || "").trim() || process.env.ZALO_BOT_TOKEN || "";
  if (!token) return NextResponse.json({ ok: false, error: "Chưa có bot token" }, { status: 503 });

  const r = await fetch("https://bot-api.zapps.me/bot" + token + "/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: (link as any).chat_id, text }),
  });
  const d: any = await r.json().catch(() => ({}));
  return NextResponse.json({ ok: r.ok && d?.ok !== false, url, student: name, raw: d });
}
