import { NextResponse } from "next/server";

// Lấy các cập nhật gần đây của bot (Zapps getUpdates) để tìm chat_id.
// Cách onboard 1 học viên: bảo em nhắn 1 tin bất kỳ cho bot → gọi route này
// → lấy chat_id trong kết quả → dán vào Chat ID của học viên ở trang Zalo Bot.
//
// - GET  /api/zalo/updates          → dùng token server (ZALO_BOT_TOKEN)
// - POST /api/zalo/updates {token}  → dùng token do người dùng nhập (nút "Lấy Chat ID")

const ZAPPS_BASE = "https://bot-api.zapps.me";

/* eslint-disable @typescript-eslint/no-explicit-any */
async function fetchUpdates(token: string) {
  const res = await fetch(`${ZAPPS_BASE}/bot${token}/getUpdates`, { cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  // Zapps trả result là 1 object đơn; Telegram trả mảng — xử lý cả hai.
  const raw = data.result;
  const updates: any[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const chats = updates
    .map((u: any) => {
      const msg = u.message || u.edited_message || u || {};
      const chat = msg.chat || {};
      const from = msg.from || {};
      return {
        chatId: chat.id || from.id || "",
        name:
          from.display_name ||
          chat.title ||
          [from.first_name, from.last_name].filter(Boolean).join(" ") ||
          from.username ||
          "",
        text: msg.text || "",
      };
    })
    .filter((c: any) => c.chatId);
  // Khử trùng lặp theo chatId, giữ tin mới nhất của mỗi người
  const byId = new Map<string, any>();
  for (const c of chats) byId.set(String(c.chatId), c);
  return { chats: Array.from(byId.values()), raw: data };
}

async function handle(token: string | undefined) {
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Chưa có bot token (nhập token hoặc cấu hình ZALO_BOT_TOKEN)" },
      { status: 400 }
    );
  }
  try {
    const { chats } = await fetchUpdates(token);
    return NextResponse.json({ ok: true, chats });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 502 });
  }
}

export async function GET() {
  return handle(process.env.ZALO_BOT_TOKEN);
}

export async function POST(request: Request) {
  let token: string | undefined;
  try {
    const body = await request.json();
    token = (body?.token || "").trim() || undefined;
  } catch {
    /* body rỗng cũng được */
  }
  return handle(token || process.env.ZALO_BOT_TOKEN);
}
