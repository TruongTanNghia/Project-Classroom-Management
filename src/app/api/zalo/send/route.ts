import { NextResponse } from "next/server";

// Gửi tin nhắn Zalo Bot qua Zapps Bot API — CHẠY SERVER-SIDE.
// Token đọc từ biến môi trường server-only ZALO_BOT_TOKEN (KHÔNG có tiền tố
// NEXT_PUBLIC_ để không lộ ra trình duyệt). Frontend chỉ gọi POST tới route này.

const ZAPPS_BASE = "https://bot-api.zapps.me";

interface SendBody {
  chatId?: string;
  text?: string;
  photoUrl?: string;
  token?: string; // tuỳ chọn: token nhập từ modal; mặc định dùng ZALO_BOT_TOKEN
}

export async function POST(request: Request) {
  let body: SendBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body không hợp lệ" }, { status: 400 });
  }

  const token = (body.token || "").trim() || process.env.ZALO_BOT_TOKEN;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Chưa có bot token (nhập token hoặc cấu hình ZALO_BOT_TOKEN)" },
      { status: 503 }
    );
  }

  const chatId = (body.chatId || "").trim();
  const text = (body.text || "").trim();
  if (!chatId) return NextResponse.json({ ok: false, error: "Thiếu chat_id" }, { status: 400 });
  if (!text && !body.photoUrl)
    return NextResponse.json({ ok: false, error: "Thiếu nội dung" }, { status: 400 });

  const method = body.photoUrl ? "sendPhoto" : "sendMessage";
  const payload = body.photoUrl
    ? { chat_id: chatId, photo: body.photoUrl, caption: text }
    : { chat_id: chatId, text };

  try {
    const res = await fetch(`${ZAPPS_BASE}/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      return NextResponse.json(
        { ok: false, error: data.description || data.error || "Zalo API lỗi", raw: data },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, result: data.result });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message || "Không gọi được Zalo API" },
      { status: 502 }
    );
  }
}
