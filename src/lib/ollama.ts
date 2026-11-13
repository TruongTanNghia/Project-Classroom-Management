/**
 * Nói chuyện với Ollama chạy TRÊN MÁY NGƯỜI DÙNG.
 *
 * Vì sao gọi từ trình duyệt chứ không qua server?
 * App nằm trên Vercel, còn Ollama nghe ở 127.0.0.1:11434 của máy thầy —
 * máy chủ Vercel không với tới localhost của máy khác được. Nên trình duyệt
 * (đang chạy ngay trên máy có Ollama) phải tự gọi.
 *
 * Hệ quả: chat local chỉ chạy khi mở app TRÊN máy đang bật Ollama.
 * Mở ở điện thoại hay máy khác thì rơi về Gemini (xem /api/chat).
 */

const DEFAULT_HOST = "http://127.0.0.1:11434";
const HOST_KEY = "aihlt-ollama-host";

export function ollamaHost(): string {
  if (typeof window === "undefined") return DEFAULT_HOST;
  try {
    return localStorage.getItem(HOST_KEY) || DEFAULT_HOST;
  } catch {
    return DEFAULT_HOST;
  }
}

export function setOllamaHost(url: string) {
  try {
    localStorage.setItem(HOST_KEY, url.replace(/\/+$/, ""));
  } catch {
    /* chế độ riêng tư chặn localStorage — bỏ qua */
  }
}

export interface OllamaModel {
  name: string;
  sizeGB: number;
  family: string;
  params: string;
}

export type ProbeResult =
  | { ok: true; version: string; models: OllamaModel[] }
  | { ok: false; reason: "offline" | "cors"; detail: string };

/** Kiểm tra Ollama có chạy và có cho phép origin hiện tại không. */
export async function probeOllama(signal?: AbortSignal): Promise<ProbeResult> {
  const host = ollamaHost();
  try {
    const vRes = await fetch(host + "/api/version", { signal, cache: "no-store" });
    if (!vRes.ok) return { ok: false, reason: "offline", detail: "HTTP " + vRes.status };
    const { version } = (await vRes.json()) as { version: string };

    const tRes = await fetch(host + "/api/tags", { signal, cache: "no-store" });
    const data = (await tRes.json()) as {
      models?: Array<{
        name: string;
        size: number;
        details?: { family?: string; parameter_size?: string };
      }>;
    };
    const models: OllamaModel[] = (data.models ?? []).map((m) => ({
      name: m.name,
      sizeGB: Math.round((m.size / 1024 ** 3) * 10) / 10,
      family: m.details?.family ?? "",
      params: m.details?.parameter_size ?? "",
    }));
    return { ok: true, version, models };
  } catch (e) {
    // fetch ném TypeError cho cả "không kết nối được" lẫn "bị CORS chặn";
    // trình duyệt cố tình không cho phân biệt. Nếu Ollama bật mà vẫn lỗi thì
    // gần như chắc là CORS, nên gợi ý cả hai hướng.
    const detail = e instanceof Error ? e.message : String(e);
    const sameMachine =
      typeof window !== "undefined" && /^https?:\/\/(localhost|127\.0\.0\.1)/.test(window.location.origin);
    return { ok: false, reason: sameMachine ? "offline" : "cors", detail };
  }
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Gửi hội thoại và nhận chữ về dần (streaming NDJSON).
 *
 * PHẢI để `think: true` — nghe ngược đời nhưng đúng với dòng qwen3:
 *  - think:false  → model vẫn suy nghĩ, nhưng Ollama đổ TẤT CẢ vào `content`,
 *                   nên người dùng thấy cả đoạn lẩm bẩm tiếng Anh.
 *  - think:true   → Ollama tách suy nghĩ sang `thinking`, `content` chỉ còn
 *                   đáp án sạch. Ta đọc `content`, bỏ `thinking` đi.
 * (Đã thử trên Ollama 0.32.15 với qwen3-4b-gpu và qwen3:8b.)
 */
export async function streamOllamaChat(opts: {
  model: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
  onToken: (chunk: string) => void;
  onThinking?: (chars: number) => void;
}): Promise<void> {
  const res = await fetch(ollamaHost() + "/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: opts.signal,
    body: JSON.stringify({
      model: opts.model,
      messages: opts.messages,
      stream: true,
      think: true,
      options: { temperature: 0.6, num_ctx: 8192 },
    }),
  });
  if (!res.ok || !res.body) throw new Error("Ollama trả về HTTP " + res.status);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    // mỗi dòng là một JSON riêng
    let nl: number;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      try {
        const obj = JSON.parse(line) as {
          message?: { content?: string; thinking?: string };
          error?: string;
          done?: boolean;
        };
        if (obj.error) throw new Error(obj.error);
        // phần lẩm bẩm: chỉ đếm để báo "đang nghĩ", không hiện ra
        const think = obj.message?.thinking;
        if (think && opts.onThinking) opts.onThinking(think.length);
        const piece = obj.message?.content;
        if (piece) opts.onToken(piece);
      } catch (e) {
        if (e instanceof SyntaxError) continue; // dòng chưa trọn, bỏ qua
        throw e;
      }
    }
  }
}
