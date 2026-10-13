// Gọi Google Gemini — dùng cho bot trợ lý của Thầy trên Zalo.
// Khóa API để ở biến môi trường GEMINI_API_KEY (server-only, KHÔNG có
// NEXT_PUBLIC_ nên không lộ ra trình duyệt).

/* eslint-disable @typescript-eslint/no-explicit-any */

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// Thử lần lượt: model mới nhất trước, bận (503) thì tự nhảy sang con kế tiếp
// → bot không bao giờ im lặng vì Google quá tải.
const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash",
  "gemini-flash-latest",
  "gemini-3-flash-preview",
  "gemini-3.1-flash-lite",
];

export function geminiKey() {
  return (process.env.GEMINI_API_KEY || "").trim();
}

export interface AskResult {
  ok: boolean;
  text?: string;
  model?: string;
  error?: string;
}

/** Hỏi Gemini một câu, có ngữ cảnh dữ liệu lớp học. */
export async function askGemini(system: string, question: string, key?: string): Promise<AskResult> {
  const apiKey = (key || geminiKey()).trim();
  if (!apiKey) return { ok: false, error: "Chưa cấu hình GEMINI_API_KEY" };

  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts: [{ text: question }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 2000 },
  };

  let lastErr = "";
  for (const model of MODELS) {
    try {
      const res = await fetch(BASE + "/" + model + ":generateContent?key=" + encodeURIComponent(apiKey), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        lastErr = "HTTP " + res.status + " (" + model + ")";
        // 503/429 = bận hoặc quá hạn mức → thử model kế tiếp
        if (res.status === 503 || res.status === 429 || res.status === 404) continue;
        const detail = await res.text().catch(() => "");
        try {
          lastErr = JSON.parse(detail)?.error?.message || lastErr;
        } catch {
          /* giữ lastErr */
        }
        continue;
      }
      const d: any = await res.json();
      const text = (d?.candidates?.[0]?.content?.parts || [])
        .map((p: any) => p?.text || "")
        .join("")
        .trim();
      if (text) return { ok: true, text, model };
      lastErr = "Model trả về rỗng (" + model + ")";
    } catch (e) {
      lastErr = String(e).slice(0, 120);
    }
  }
  return { ok: false, error: lastErr || "Không gọi được Gemini" };
}
