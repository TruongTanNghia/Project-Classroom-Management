"use client";

import { Check, CircleCheck, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts } from "@/lib/i18n";
import { CA_SLOTS } from "@/lib/derived";

// Popup điểm danh gọn: chỉ danh sách học viên của buổi, tick có mặt, bấm Lưu.
export default function AttendanceModal() {
  const lang = useApp((s) => s.lang);
  const attendId = useApp((s) => s.attendId);
  const attendDate = useApp((s) => s.attendDate);
  const draft = useApp((s) => s.attendDraft);
  const sessions = useApp((s) => s.sessions);
  const students = useApp((s) => s.students);
  const setAttendDate = useApp((s) => s.setAttendDate);
  const toggleAttend = useApp((s) => s.toggleAttend);
  const saveAttend = useApp((s) => s.saveAttend);
  const closeAttend = useApp((s) => s.closeAttend);
  const vi = lang !== "en";
  const t = dicts[lang];

  if (attendId == null) return null;
  const session = sessions.find((x) => x.id === attendId);
  if (!session) return null;

  const ids = session.studentIds || [];
  const present = ids.filter((id) => draft[id]).length;
  const caIdx = CA_SLOTS.indexOf(session.t);
  const caLabel = (caIdx >= 0 ? (vi ? "Ca " : "Slot ") + (caIdx + 1) + " · " : "") + session.t;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50, display: "flex",
        alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <div
        onClick={closeAttend}
        style={{ position: "absolute", inset: 0, background: "var(--overlay)", animation: "fadeUp 0.18s ease both" }}
      />
      <div
        style={{
          position: "relative", width: "100%", maxWidth: 460, maxHeight: "calc(100vh - 48px)",
          display: "flex", flexDirection: "column", background: "var(--surface)",
          border: "1px solid var(--border)", borderRadius: 16, boxShadow: "var(--modal-shadow)",
          animation: "fadeUp 0.24s cubic-bezier(0.16,1,0.3,1) both", overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex", alignItems: "flex-start", gap: 12, padding: "22px 24px 16px",
            borderBottom: "1px solid var(--hairline)", flexShrink: 0,
          }}
        >
          <span
            style={{
              width: 38, height: 38, minWidth: 38, borderRadius: 10, background: "var(--accent-tint)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <CircleCheck size={18} strokeWidth={2} color="var(--accent)" />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
              {vi ? "Điểm danh · " : "Attendance · "}
              {session.n}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 2 }}>{caLabel}</div>
          </div>
          <button className="ghost-icon-btn" onClick={closeAttend} style={{ margin: "-4px -4px 0 0" }}>
            <X size={17} strokeWidth={2} color="var(--text-2)" />
          </button>
        </div>

        {/* Ngày học */}
        <div style={{ padding: "16px 24px 0", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--body-c)", minWidth: 72 }}>
            {vi ? "Ngày học" : "Class date"}
          </span>
          <input
            type="date"
            className="input"
            value={attendDate}
            onChange={(e) => setAttendDate(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>

        {/* Danh sách học viên */}
        <div style={{ padding: "12px 24px 16px", overflowY: "auto", minHeight: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {ids.length === 0 && (
            <div style={{ fontSize: 13, color: "var(--text-3)" }}>
              {vi ? "Buổi này chưa có học viên." : "No students in this session."}
            </div>
          )}
          {ids.map((id) => {
            const st = students.find((x) => x.id === id);
            const on = Boolean(draft[id]);
            return (
              <button
                key={id}
                onClick={() => toggleAttend(id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
                  borderRadius: 10, cursor: "pointer", textAlign: "left",
                  border: "1px solid " + (on ? "var(--success-border)" : "var(--border)"),
                  background: on ? "var(--success-tint)" : "var(--surface)",
                }}
              >
                <span
                  style={{
                    width: 24, height: 24, minWidth: 24, borderRadius: 99,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: on ? "var(--success)" : "var(--hairline)",
                  }}
                >
                  {on && <Check size={15} strokeWidth={3} color="#fff" />}
                </span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "var(--text)" }}>
                  {st?.name || "?"}
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: on ? "var(--success)" : "var(--text-3)" }}>
                  {on ? (vi ? "Có mặt" : "Present") : (vi ? "Vắng" : "Absent")}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "16px 24px",
            borderTop: "1px solid var(--hairline)", background: "var(--sidebar)", flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 13, color: "var(--text-2)", fontWeight: 500 }}>
            {vi ? "Có mặt: " : "Present: "}
            {present}/{ids.length}
          </span>
          <div style={{ flex: 1 }} />
          <button className="btn" style={{ padding: "9px 16px" }} onClick={closeAttend}>
            {t.cancel}
          </button>
          <button className="btn-primary" style={{ padding: "9px 18px" }} onClick={saveAttend}>
            {vi ? "Lưu điểm danh" : "Save attendance"}
          </button>
        </div>
      </div>
    </div>
  );
}
