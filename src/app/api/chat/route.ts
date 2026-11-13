import { NextResponse } from "next/server";
import { askGemini } from "@/lib/gemini";

/**
 * Dự phòng cho trang Trợ lý khi máy không có Ollama (mở ở điện thoại,
 * máy khác, hoặc chưa bật Ollama). Chạy trên máy chủ nên giữ được
 * GEMINI_API_KEY, không lộ ra trình duyệt.
 *
 * Chỉ nhận yêu cầu từ người đã đăng nhập? — Không cần: route này không
 * đọc/ghi dữ liệu học viên, chỉ chuyển tiếp câu hỏi. Dữ liệu lớp (nếu có)
 * do trình duyệt tự gắn vào, và trình duyệt chỉ có dữ liệu khi đã đăng nhập.
 */

export const runtime = "nodejs";

interface Msg {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  let body: { messages?: Msg[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body không phải JSON" }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (!messages.length) {
    return NextResponse.json({ ok: false, error: "Thiếu messages" }, { status: 400 });
  }

  const system = messages
    .filter((m) => m.role === "system")
    .map((m) => m.content)
    .join("\n\n");

  // Gemini ở đây nhận một lượt hỏi, nên gộp lịch sử thành một khối có nhãn.
  const history = messages.filter((m) => m.role !== "system");
  const question = history
    .map((m) => (m.role === "user" ? "Thầy: " : "Trợ lý: ") + m.content)
    .join("\n\n");

  const r = await askGemini(
    system || "Bạn là trợ lý AI của thầy Trương Tấn Nghĩa. Trả lời bằng tiếng Việt, ngắn gọn, đi thẳng vào việc.",
    question
  );

  if (!r.ok) {
    return NextResponse.json({ ok: false, error: r.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, text: r.text, model: "gemini" });
}
