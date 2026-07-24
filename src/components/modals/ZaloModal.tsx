"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Check, RefreshCw, Send } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts, zaloStatusLabels } from "@/lib/i18n";
import ModalShell, { Choices, Field } from "./ModalShell";

interface FoundChat {
  chatId: string;
  name: string;
  text: string;
}

export default function ZaloModal() {
  const lang = useApp((s) => s.lang);
  const modal = useApp((s) => s.modal);
  const form = useApp((s) => s.form);
  const setForm = useApp((s) => s.setForm);
  const saveZalo = useApp((s) => s.saveZalo);
  const showToast = useApp((s) => s.showToast);
  const students = useApp((s) => s.students);
  const zalo = useApp((s) => s.zalo);
  const t = dicts[lang];
  const vi = lang !== "en";

  const [listening, setListening] = useState(false);
  const [found, setFound] = useState<FoundChat[]>([]);
  const [sending, setSending] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  const triesRef = useRef(0);

  // Dọn interval khi đóng modal
  useEffect(() => () => window.clearInterval(timerRef.current), []);

  if (!modal) return null;
  const isEdit = modal.mode === "edit";

  const poll = async () => {
    try {
      const res = await fetch("/api/zalo/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: form.token || "" }),
      });
      const data = await res.json();
      if (data.ok && Array.isArray(data.chats) && data.chats.length) {
        setFound(data.chats);
        // Bắt được rồi thì dừng nghe (tránh getUpdates "nuốt" tin kế tiếp)
        stopListening();
        // Tự điền nếu chỉ có đúng 1 người nhắn
        if (data.chats.length === 1 && !form.chatId) {
          setForm({ chatId: String(data.chats[0].chatId) });
          showToast(vi ? "Đã lấy được Chat ID ✓" : "Chat ID captured ✓");
        }
      } else if (!data.ok) {
        stopListening();
        showToast((vi ? "Lỗi: " : "Error: ") + (data.error || "?"));
        return;
      }
    } catch {
      /* bỏ qua, thử lại ở nhịp sau */
    }
    triesRef.current += 1;
    if (triesRef.current >= 20) stopListening(); // ~50s rồi dừng
  };

  const startListening = () => {
    setFound([]);
    triesRef.current = 0;
    setListening(true);
    poll();
    timerRef.current = window.setInterval(poll, 2500);
  };

  const stopListening = () => {
    window.clearInterval(timerRef.current);
    setListening(false);
  };

  const pickChat = (c: FoundChat) => {
    setForm({ chatId: String(c.chatId) });
    if (!form.name || !form.name.trim()) setForm({ name: c.name });
    stopListening();
  };

  const sendTest = async () => {
    if (!form.chatId) return;
    setSending(true);
    try {
      const res = await fetch("/api/zalo/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: form.token || "",
          chatId: form.chatId,
          text: vi
            ? "✅ AIhoclaptrinh: liên kết Zalo thành công! Đây là tin nhắn thử."
            : "✅ AIhoclaptrinh: Zalo link connected! This is a test message.",
        }),
      });
      const data = await res.json();
      showToast(
        data.ok
          ? vi ? "Đã gửi tin thử qua Zalo ✓" : "Test message sent ✓"
          : (vi ? "Gửi lỗi: " : "Send error: ") + (data.error || "?")
      );
    } catch {
      showToast(vi ? "Không gọi được Zalo API" : "Zalo API unreachable");
    } finally {
      setSending(false);
    }
  };

  return (
    <ModalShell
      icon={<Bot size={18} strokeWidth={2} color="var(--accent)" />}
      title={isEdit ? t.mEditZalo : t.mAddZalo}
      subtitle={isEdit ? t.mSubZaloEdit : t.mSubZaloAdd}
      cta={isEdit ? t.saveUpdate : t.addLinkCta}
      canSave={Boolean(form.name && form.name.trim())}
      showDelete={isEdit}
      onSave={saveZalo}
    >
      <Field label={vi ? "Học viên" : "Student"}>
        {students.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--text-3)" }}>
            {vi ? "Chưa có học viên — hãy thêm học viên trước." : "No students yet — add students first."}
          </div>
        ) : (
          <Choices
            wrap
            options={students.map((st) => {
              // Học viên đã có liên kết Zalo khác (không tính bản ghi đang sửa)
              const linkedElsewhere = zalo.some(
                (z) => z.name === st.name && !(isEdit && z.id === modal.id)
              );
              return {
                label: st.name + (linkedElsewhere ? " ✓" : ""),
                on: form.name === st.name,
                onPick: () => setForm({ name: st.name }),
                noFlex: true,
              };
            })}
          />
        )}
      </Field>
      <Field label={t.fToken}>
        <input
          className="input mono"
          value={form.token || ""}
          onChange={(e) => setForm({ token: e.target.value })}
          placeholder={t.fTokenPh}
        />
      </Field>

      <Field label={t.fChatId}>
        <div style={{ display: "flex", gap: 6 }}>
          <input
            className="input mono"
            value={form.chatId || ""}
            onChange={(e) => setForm({ chatId: e.target.value })}
            placeholder={t.fChatIdPh}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={listening ? stopListening : startListening}
            className="btn"
            style={{ whiteSpace: "nowrap", padding: "9px 12px", fontSize: 12.5 }}
          >
            <RefreshCw
              size={13}
              strokeWidth={2}
              color="var(--accent)"
              style={listening ? { animation: "spin 1s linear infinite" } : undefined}
            />
            {listening ? (vi ? "Đang chờ…" : "Listening…") : vi ? "Lấy Chat ID" : "Get Chat ID"}
          </button>
        </div>

        {/* Hướng dẫn + kết quả chờ nghe */}
        {listening && found.length === 0 && (
          <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2, lineHeight: 1.5 }}>
            {vi
              ? "Nhờ học viên nhắn 1 tin bất kỳ cho bot ngay bây giờ — Chat ID sẽ tự hiện ở đây."
              : "Ask the student to message the bot now — their Chat ID will appear here."}
          </div>
        )}
        {found.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
            <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>
              {vi ? "Người vừa nhắn bot (bấm để chọn):" : "Recent chatters (tap to pick):"}
            </div>
            {found.map((c) => {
              const active = String(c.chatId) === String(form.chatId);
              return (
                <button
                  key={c.chatId}
                  type="button"
                  onClick={() => pickChat(c)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, textAlign: "left",
                    padding: "8px 10px", borderRadius: 8, cursor: "pointer",
                    border: "1px solid " + (active ? "var(--accent)" : "var(--border)"),
                    background: active ? "var(--accent-tint)" : "var(--surface)",
                  }}
                >
                  {active && <Check size={14} strokeWidth={2.4} color="var(--accent)" />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name || (vi ? "(không tên)" : "(no name)")}</div>
                    <div className="mono truncate-1" style={{ fontSize: 11.5, color: "var(--text-2)" }}>
                      {c.chatId}
                    </div>
                  </div>
                  {c.text && (
                    <span className="truncate-1" style={{ fontSize: 11.5, color: "var(--text-3)", maxWidth: 120 }}>
                      “{c.text}”
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Gửi thử để kiểm tra kết nối */}
        {form.chatId ? (
          <button
            type="button"
            onClick={sendTest}
            disabled={sending}
            className="btn"
            style={{ alignSelf: "flex-start", marginTop: 2, padding: "7px 12px", fontSize: 12.5, opacity: sending ? 0.6 : 1 }}
          >
            <Send size={13} strokeWidth={2} color="var(--accent)" />
            {sending ? (vi ? "Đang gửi…" : "Sending…") : vi ? "Gửi tin thử" : "Send test"}
          </button>
        ) : null}
      </Field>

      <Field label={t.fStatus}>
        <Choices
          options={(["Connected", "Pending", "Not linked"] as const).map((v) => ({
            label: zaloStatusLabels[lang][v],
            on: form.status === v,
            onPick: () => setForm({ status: v }),
          }))}
        />
      </Field>
    </ModalShell>
  );
}
