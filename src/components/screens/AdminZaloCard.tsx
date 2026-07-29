"use client";

import { useEffect, useRef, useState } from "react";
import { Check, RefreshCw, Send, UserCog } from "lucide-react";
import { useApp } from "@/lib/store";

// Cấu hình bot của Thầy (Admin): nhập Chat ID để nhận thông báo MỌI buổi học.
// Dùng bot chung (ZALO_BOT_TOKEN server) nên chỉ cần Chat ID.
export default function AdminZaloCard() {
  // remount khi adminChatId tải xong từ Supabase → ô nhập lấy giá trị mới
  const adminChatId = useApp((s) => s.adminChatId);
  return <AdminZaloCardInner key={adminChatId} initialChatId={adminChatId} />;
}

function AdminZaloCardInner({ initialChatId }: { initialChatId: string }) {
  const lang = useApp((s) => s.lang);
  const adminChatId = useApp((s) => s.adminChatId);
  const setAdminChatId = useApp((s) => s.setAdminChatId);
  const showToast = useApp((s) => s.showToast);
  const vi = lang !== "en";

  const [val, setVal] = useState(initialChatId);
  const [listening, setListening] = useState(false);
  const [sending, setSending] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  const triesRef = useRef(0);

  useEffect(() => () => window.clearInterval(timerRef.current), []);

  const stop = () => {
    window.clearInterval(timerRef.current);
    setListening(false);
  };
  const poll = async () => {
    try {
      const res = await fetch("/api/zalo/updates"); // GET → dùng token server (bot chung)
      const data = await res.json();
      if (data.ok && data.chats?.length) {
        const c = data.chats[0];
        setVal(String(c.chatId));
        stop();
        showToast(vi ? "Đã lấy Chat ID của Thầy ✓" : "Admin Chat ID captured ✓");
        return;
      }
      if (!data.ok) {
        stop();
        showToast((vi ? "Lỗi: " : "Error: ") + (data.error || "?"));
      }
    } catch {
      /* thử lại nhịp sau */
    }
    if (++triesRef.current >= 20) stop();
  };
  const start = () => {
    triesRef.current = 0;
    setListening(true);
    poll();
    timerRef.current = window.setInterval(poll, 2500);
  };

  const save = () => {
    setAdminChatId(val.trim());
    showToast(vi ? "Đã lưu bot của Thầy ✓" : "Admin bot saved ✓");
  };

  const sendTest = async () => {
    if (!val.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/zalo/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: val.trim(),
          text: vi
            ? "👨‍🏫 AIhoclaptrinh: Bot của Thầy đã kết nối! Thầy sẽ nhận thông báo mọi buổi học tại đây."
            : "👨‍🏫 AIhoclaptrinh: Admin bot connected! You'll receive all session notifications here.",
        }),
      });
      const data = await res.json();
      showToast(data.ok ? (vi ? "Đã gửi tin thử ✓" : "Test sent ✓") : (vi ? "Gửi lỗi: " : "Send error: ") + (data.error || "?"));
    } catch {
      showToast(vi ? "Không gọi được Zalo API" : "Zalo API unreachable");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span
          style={{
            width: 30, height: 30, minWidth: 30, borderRadius: 8, background: "var(--accent-tint)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <UserCog size={16} strokeWidth={2} color="var(--accent)" />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>
            {vi ? "Bot của Thầy (Admin)" : "Teacher bot (Admin)"}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text-2)", marginTop: 1 }}>
            {vi
              ? "Nhận thông báo MỌI buổi học sắp tới. Học viên chỉ nhận buổi của mình."
              : "Receives ALL upcoming session alerts. Students only get their own."}
          </div>
        </div>
        {adminChatId ? (
          <span className="pill pill-success" style={{ gap: 5 }}>
            <Check size={12} strokeWidth={2.4} style={{ marginRight: 4 }} />
            {vi ? "Đã bật" : "On"}
          </span>
        ) : (
          <span className="pill pill-neutral">{vi ? "Chưa cấu hình" : "Not set"}</span>
        )}
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
        <input
          className="input mono"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={vi ? "Chat ID Zalo của Thầy" : "Teacher's Zalo Chat ID"}
          style={{ flex: 1, minWidth: 200 }}
        />
        <button type="button" onClick={listening ? stop : start} className="btn" style={{ whiteSpace: "nowrap", padding: "9px 12px", fontSize: 12.5 }}>
          <RefreshCw size={13} strokeWidth={2} color="var(--accent)" style={listening ? { animation: "spin 1s linear infinite" } : undefined} />
          {listening ? (vi ? "Đang chờ…" : "Listening…") : vi ? "Lấy Chat ID" : "Get Chat ID"}
        </button>
        {val.trim() && (
          <button type="button" onClick={sendTest} disabled={sending} className="btn" style={{ padding: "9px 12px", fontSize: 12.5, opacity: sending ? 0.6 : 1 }}>
            <Send size={13} strokeWidth={2} color="var(--accent)" />
            {vi ? "Gửi thử" : "Test"}
          </button>
        )}
        <button type="button" onClick={save} className="btn-primary" style={{ padding: "9px 16px", fontSize: 12.5 }}>
          {vi ? "Lưu" : "Save"}
        </button>
      </div>
      {listening && (
        <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 8 }}>
          {vi
            ? "Thầy nhắn 1 tin bất kỳ cho bot ngay bây giờ — Chat ID sẽ tự hiện."
            : "Message the bot now — the Chat ID will appear."}
        </div>
      )}
    </div>
  );
}
