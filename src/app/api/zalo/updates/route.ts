import { NextResponse } from "next/server";

// Lấy các cập nhật gần đây của bot (Zapps getUpdates) để tìm chat_id.
// Cách onboard 1 phụ huynh: bảo họ nhắn 1 tin bất kỳ cho bot → gọi route này
// → lấy chat_id trong kết quả → dán vào Chat ID của học viên ở trang Zalo Bot.

const ZAPPS_BASE = "https://bot-api.zapps.me";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET() {
  const token = process.env.ZALO_BOT_TOKEN;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Chưa cấu hình ZALO_BOT_TOKEN trên server" },
      { status: 503 }
    );
  }
  try {
    const res = await fetch(`${ZAPPS_BASE}/bot${token}/getUpdates`, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    // Rút gọn: mỗi update → { chat_id, name, text }
    const chats = (data.result || [])
      .map((u: any) => {
        const msg = u.message || u.edited_message || {};
        const chat = msg.chat || {};
        return {
          chatId: chat.id,
          name: chat.title || [chat.first_name, chat.last_name].filter(Boolean).join(" ") || chat.username,
          text: msg.text,
        };
      })
      .filter((c: any) => c.chatId);
    return NextResponse.json({ ok: true, chats, raw: data });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 502 });
  }
}
