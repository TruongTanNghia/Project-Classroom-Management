"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle, Bot, Cpu, Eraser, Loader2, Send, Server, Sparkles, StopCircle, User,
} from "lucide-react";
import { Page, PageHeader } from "@/components/ui/bits";
import { useApp } from "@/lib/store";
import { dicts } from "@/lib/i18n";
import { dueStudents, fmtAmt, revenueTotals, tuitionProgress, unpaidSessions } from "@/lib/derived";
import { probeOllama, streamOllamaChat, type ChatMessage, type OllamaModel } from "@/lib/ollama";

type Bubble = { role: "user" | "assistant"; content: string };

const GREETING =
  "Em là trợ lý của thầy, chạy bằng model ngay trên máy thầy nên hỏi gì cũng được, không lo lộ dữ liệu học viên ra ngoài.\n\nThầy có thể hỏi: “tuần này ai tới kỳ thu học phí?”, “soạn tin nhắn nhắc phụ huynh bé Mai”, hay bất cứ chuyện gì khác.";

export default function ChatPage() {
  const lang = useApp((s) => s.lang);
  const t = dicts[lang];
  const students = useApp((s) => s.students);
  const courses = useApp((s) => s.courses);
  const sessions = useApp((s) => s.sessions);
  const attRecords = useApp((s) => s.attRecords);

  const [probe, setProbe] = useState<
    { state: "checking" } | { state: "ready"; version: string; models: OllamaModel[] } | { state: "none"; reason: "offline" | "cors" }
  >({ state: "checking" });
  const [model, setModel] = useState("");
  const [msgs, setMsgs] = useState<Bubble[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [thinking, setThinking] = useState(0);
  const [useCloud, setUseCloud] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  /* ---- tìm Ollama trên máy ---- */
  useEffect(() => {
    const ac = new AbortController();
    probeOllama(ac.signal).then((r) => {
      if (ac.signal.aborted) return;
      if (r.ok) {
        setProbe({ state: "ready", version: r.version, models: r.models });
        const prefer =
          r.models.find((m) => /qwen3.*gpu/i.test(m.name)) ??
          r.models.find((m) => /qwen3:8b/i.test(m.name)) ??
          r.models.find((m) => /qwen/i.test(m.name)) ??
          r.models[0];
        if (prefer) setModel(prefer.name);
      } else {
        setProbe({ state: "none", reason: r.reason });
        setUseCloud(true);
      }
    });
    return () => ac.abort();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, busy]);

  /* ---- tóm tắt tình hình lớp để model trả lời có căn cứ ---- */
  const digest = useMemo(() => {
    const due = dueStudents(students, attRecords);
    const rev = revenueTotals(students);
    const lines: string[] = [];
    lines.push(`Sĩ số: ${students.length} học viên · ${courses.length} khóa học · ${sessions.length} buổi trong lịch.`);
    lines.push(`Doanh thu đã thu: ${fmtAmt(rev.revAll)}.`);
    if (due.length) {
      lines.push(`Đang tới kỳ thu học phí (${due.length}):`);
      for (const s of due.slice(0, 15)) {
        const p = tuitionProgress(s, attRecords);
        lines.push(`  - ${s.name}: ${p.shown}/${p.cycle} buổi, cần thu ${s.fee || "(chưa đặt học phí)"}.`);
      }
    } else {
      lines.push("Hiện chưa ai tới kỳ thu học phí.");
    }
    const debt = students
      .map((s) => ({ s, n: unpaidSessions(s, attRecords) }))
      .filter((x) => x.n > 0)
      .sort((a, b) => b.n - a.n)
      .slice(0, 10);
    if (debt.length) {
      lines.push("Buổi đã học nhưng chưa thu tiền:");
      for (const d of debt) lines.push(`  - ${d.s.name}: ${d.n} buổi.`);
    }
    return lines.join("\n");
  }, [students, courses, sessions, attRecords]);

  const system = useMemo(
    () =>
      [
        "Bạn là trợ lý riêng của thầy Trương Tấn Nghĩa (AIhoclaptrinh) — người dạy lập trình và AI.",
        "Xưng 'em', gọi người dùng là 'thầy'. Trả lời bằng tiếng Việt, ngắn gọn, đi thẳng vào việc.",
        "Khi câu hỏi liên quan tới lớp học, hãy dùng SỐ LIỆU THẬT dưới đây, tuyệt đối không bịa thêm tên hay con số.",
        "Nếu dữ liệu chưa đủ để trả lời, nói thẳng là chưa có chứ đừng đoán.",
        "Câu hỏi ngoài chuyện lớp học thì cứ trả lời bình thường như một trợ lý đa năng.",
        "",
        "=== TÌNH HÌNH LỚP HIỆN TẠI ===",
        digest,
      ].join("\n"),
    [digest]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setBusy(false);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || busy) return;
      setErr("");
      setDraft("");
      const next: Bubble[] = [...msgs, { role: "user", content: q }];
      setMsgs([...next, { role: "assistant", content: "" }]);
      setBusy(true);
      setThinking(0);

      const history: ChatMessage[] = [
        { role: "system", content: system },
        ...next.map((m) => ({ role: m.role, content: m.content })),
      ];

      const ac = new AbortController();
      abortRef.current = ac;

      const push = (chunk: string) =>
        setMsgs((cur) => {
          const copy = [...cur];
          copy[copy.length - 1] = {
            role: "assistant",
            content: copy[copy.length - 1].content + chunk,
          };
          return copy;
        });

      try {
        if (!useCloud && probe.state === "ready" && model) {
          await streamOllamaChat({
            model,
            messages: history,
            signal: ac.signal,
            onToken: push,
            onThinking: (n) => setThinking((c) => c + n),
          });
        } else {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: history }),
            signal: ac.signal,
          });
          const data = (await res.json()) as { ok: boolean; text?: string; error?: string };
          if (!data.ok) throw new Error(data.error || "Gemini không trả lời được");
          push(data.text ?? "");
        }
      } catch (e) {
        if ((e as Error)?.name === "AbortError") {
          push("\n\n_(thầy đã dừng)_");
        } else {
          const m = e instanceof Error ? e.message : String(e);
          setErr(m);
          setMsgs((cur) => cur.slice(0, -1));
        }
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, msgs, system, useCloud, probe, model]
  );

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(draft);
    }
  };

  const local = probe.state === "ready" && !useCloud;

  return (
    <Page maxWidth={980} gap={16}>
      <PageHeader
        title={lang === "en" ? "AI Assistant" : "Trợ lý AI"}
        subtitle={
          lang === "en"
            ? "Chat with a model running on your own machine — your student data never leaves it."
            : "Trò chuyện với model chạy ngay trên máy thầy — dữ liệu học viên không ra khỏi máy."
        }
      />

      {/* thanh trạng thái nguồn model */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 12, padding: "10px 14px", fontSize: 13,
        }}
      >
        {probe.state === "checking" && (
          <>
            <Loader2 size={15} className="spin" color="var(--accent)" />
            <span style={{ color: "var(--text-2)" }}>Đang tìm Ollama trên máy…</span>
          </>
        )}

        {probe.state === "ready" && (
          <>
            <Cpu size={15} strokeWidth={2.2} color={local ? "var(--success)" : "var(--text-3)"} />
            <span style={{ fontWeight: 600, color: "var(--text)" }}>
              Ollama {probe.version}
            </span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={useCloud || busy}
              style={{
                padding: "5px 9px", borderRadius: 8, border: "1px solid var(--border)",
                background: "var(--bg)", color: "var(--text)", fontSize: 12.5,
              }}
            >
              {probe.models.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name} · {m.sizeGB}GB
                </option>
              ))}
            </select>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--text-2)", cursor: "pointer" }}>
              <input type="checkbox" checked={useCloud} onChange={(e) => setUseCloud(e.target.checked)} disabled={busy} />
              Dùng Gemini thay vì model trên máy
            </label>
          </>
        )}

        {probe.state === "none" && (
          <>
            <Server size={15} strokeWidth={2.2} color="var(--warn)" />
            <span style={{ color: "var(--text-2)" }}>
              Không thấy Ollama — đang dùng <b style={{ color: "var(--text)" }}>Gemini</b> trên máy chủ.
            </span>
          </>
        )}
      </div>

      {/* hướng dẫn bật Ollama khi bị chặn */}
      {probe.state === "none" && (
        <div
          style={{
            background: "var(--warn-tint)", border: "1px solid var(--border)",
            borderRadius: 12, padding: "14px 16px", fontSize: 13, lineHeight: 1.7, color: "var(--body-c)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
            <AlertTriangle size={15} strokeWidth={2.2} color="var(--warn)" />
            Muốn chạy bằng model trên máy thầy?
          </div>
          {probe.reason === "cors" ? (
            <>
              Trang này đang mở từ Internet, mà Ollama chỉ cho phép <code>localhost</code> gọi.
              Mở PowerShell rồi chạy một lần:
              <pre style={pre}>setx OLLAMA_ORIGINS &quot;{typeof window !== "undefined" ? window.location.origin : ""}&quot;</pre>
              Khởi động lại Ollama rồi tải lại trang. Hoặc đơn giản hơn: chạy app ngay trên máy bằng{" "}
              <code>npm run dev</code> rồi mở <code>http://localhost:3001/chat</code> — khỏi cấu hình gì.
            </>
          ) : (
            <>
              Chưa thấy Ollama chạy. Mở PowerShell rồi gõ <code>ollama serve</code> (hoặc bật app Ollama),
              sau đó tải lại trang này.
            </>
          )}
        </div>
      )}

      {/* khung hội thoại */}
      <div
        style={{
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16,
          display: "flex", flexDirection: "column", minHeight: 420,
        }}
      >
        <div style={{ flex: 1, padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          {msgs.length === 0 && (
            <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
              <Avatar who="assistant" />
              <div style={bubbleStyle(false)}>{GREETING}</div>
            </div>
          )}

          {msgs.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex", gap: 11, alignItems: "flex-start",
                flexDirection: m.role === "user" ? "row-reverse" : "row",
              }}
            >
              <Avatar who={m.role} />
              <div style={bubbleStyle(m.role === "user")}>
                {m.content ||
                  (busy && i === msgs.length - 1 ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--text-3)" }}>
                      <Loader2 size={13} className="spin" />
                      {thinking > 0
                        ? `đang suy nghĩ… (${thinking.toLocaleString("vi-VN")} ký tự)`
                        : "đang nghĩ…"}
                    </span>
                  ) : null)}
              </div>
            </div>
          ))}

          {err && (
            <div style={{ fontSize: 12.5, color: "#EF4444", fontWeight: 500 }}>
              Lỗi: {err}
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* ô nhập */}
        <div style={{ borderTop: "1px solid var(--hairline)", padding: 12, display: "flex", gap: 9, alignItems: "flex-end" }}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKey}
            rows={2}
            placeholder={local ? `Hỏi ${model || "model"} bất cứ điều gì…` : "Hỏi trợ lý bất cứ điều gì…"}
            style={{
              flex: 1, resize: "none", padding: "10px 12px", borderRadius: 10,
              border: "1px solid var(--border)", background: "var(--bg)",
              color: "var(--text)", fontSize: 14, outline: "none", fontFamily: "inherit", lineHeight: 1.5,
            }}
          />
          {busy ? (
            <button type="button" onClick={stop} className="btn" style={sendBtn} title="Dừng">
              <StopCircle size={16} strokeWidth={2.2} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => send(draft)}
              disabled={!draft.trim()}
              className="btn-primary"
              style={sendBtn}
              title="Gửi (Enter)"
            >
              <Send size={16} strokeWidth={2.2} />
            </button>
          )}
          <button
            type="button"
            onClick={() => { setMsgs([]); setErr(""); }}
            disabled={busy || msgs.length === 0}
            className="btn"
            style={sendBtn}
            title="Xoá hội thoại"
          >
            <Eraser size={16} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <div style={{ fontSize: 11.5, color: "var(--text-3)", textAlign: "center" }}>
        {local ? (
          <>
            <Sparkles size={11} strokeWidth={2.2} style={{ verticalAlign: -1 }} /> Câu hỏi và dữ liệu lớp được xử lý
            ngay trên máy thầy, không gửi đi đâu cả.
          </>
        ) : (
          <>Đang dùng Gemini — câu hỏi kèm tóm tắt lớp sẽ được gửi tới Google.</>
        )}
      </div>
    </Page>
  );
}

function Avatar({ who }: { who: "user" | "assistant" }) {
  const isUser = who === "user";
  return (
    <span
      style={{
        flexShrink: 0, width: 30, height: 30, borderRadius: 9,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: isUser ? "var(--subtle)" : "var(--accent-tint)",
        color: isUser ? "var(--text-2)" : "var(--accent)",
      }}
    >
      {isUser ? <User size={15} strokeWidth={2.2} /> : <Bot size={15} strokeWidth={2.2} />}
    </span>
  );
}

function bubbleStyle(isUser: boolean): React.CSSProperties {
  return {
    maxWidth: "min(78%, 640px)",
    background: isUser ? "var(--accent-tint)" : "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: 13,
    padding: "10px 13px",
    fontSize: 14,
    lineHeight: 1.65,
    color: "var(--body-c)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };
}

const sendBtn: React.CSSProperties = {
  padding: "10px 12px", display: "inline-flex", alignItems: "center", justifyContent: "center",
};

const pre: React.CSSProperties = {
  margin: "8px 0", padding: "9px 11px", background: "var(--bg)",
  border: "1px solid var(--border)", borderRadius: 8,
  fontSize: 12, overflowX: "auto", fontFamily: "ui-monospace, monospace",
};
