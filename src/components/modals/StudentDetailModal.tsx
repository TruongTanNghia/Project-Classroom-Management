"use client";

import { useState } from "react";
import { CalendarPlus, Check, Pencil, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { dayMeta, dicts, statusLabels } from "@/lib/i18n";
import { CA_SLOTS, presentCount, paidSessions, studentHistory, tuitionProgress } from "@/lib/derived";

function localTodayISO() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}

export default function StudentDetailModal() {
  const lang = useApp((s) => s.lang);
  const detailId = useApp((s) => s.detailId);
  const closeDetail = useApp((s) => s.closeDetail);
  const openModal = useApp((s) => s.openModal);
  const students = useApp((s) => s.students);
  const sessions = useApp((s) => s.sessions);
  const attRecords = useApp((s) => s.attRecords);
  const markAttendance = useApp((s) => s.markAttendance);
  const removeAttendance = useApp((s) => s.removeAttendance);
  const vi = lang !== "en";
  const t = dicts[lang];

  const [buSession, setBuSession] = useState<number | "">("");
  const [buDate, setBuDate] = useState(localTodayISO());

  if (detailId == null) return null;
  const st = students.find((x) => x.id === detailId);
  if (!st) return null;

  const learned = presentCount(st, attRecords); // số buổi đã học (có mặt)
  const paid = paidSessions(st);
  const prog = tuitionProgress(st, attRecords);
  const history = studentHistory(st, attRecords);
  const mySessions = sessions.filter((s) => (s.studentIds || []).includes(st.id));
  // buổi đang chọn để điểm danh bù (mặc định buổi đầu nếu chưa chọn hợp lệ)
  const effBuSession = buSession && mySessions.some((s) => s.id === buSession) ? buSession : mySessions[0]?.id || "";
  const statusClass =
    st.status === "Active" ? "pill-success" : st.status === "At risk" ? "pill-danger" : "pill-neutral";

  const dayName = (d: number) => dayMeta[lang][d]?.day || "";
  const caName = (slot: string) => {
    const i = CA_SLOTS.indexOf(slot);
    return (i >= 0 ? (vi ? "Ca " : "Slot ") + (i + 1) + " · " : "") + slot;
  };
  const sessName = (sid: number) => sessions.find((s) => s.id === sid)?.n || "—";
  const fmtDate = (iso: string) => iso.slice(8, 10) + "/" + iso.slice(5, 7) + "/" + iso.slice(0, 4);

  const editStudent = () => {
    closeDetail();
    openModal(
      { mode: "edit", kind: "student", id: st.id },
      {
        name: st.name, email: st.email, phone: st.phone || "",
        cycle: String(st.cycle || 10), fee: st.fee || "", status: st.status,
      }
    );
  };

  const stat = (label: string, value: string | number, color?: string) => (
    <div style={{ flex: 1, background: "var(--sidebar)", border: "1px solid var(--subtle)", borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ fontSize: 12, color: "var(--text-2)" }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2, color: color || "var(--text)" }}>{value}</div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={closeDetail} style={{ position: "absolute", inset: 0, background: "var(--overlay)", animation: "fadeUp 0.18s ease both" }} />
      <div
        style={{
          position: "relative", width: "100%", maxWidth: 560, maxHeight: "calc(100vh - 48px)",
          display: "flex", flexDirection: "column", background: "var(--surface)",
          border: "1px solid var(--border)", borderRadius: 16, boxShadow: "var(--modal-shadow)",
          animation: "fadeUp 0.24s cubic-bezier(0.16,1,0.3,1) both", overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "22px 24px 16px", borderBottom: "1px solid var(--hairline)" }}>
          <span className="avatar tint-0" style={{ width: 42, height: 42, minWidth: 42, fontSize: 15 }}>
            {st.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em" }}>{st.name}</span>
              <span className={"pill " + statusClass}>{statusLabels[lang][st.status]}</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 2 }}>
              {st.email || ""}
              {st.phone ? " · " + st.phone : ""}
            </div>
          </div>
          <button className="btn" style={{ padding: "6px 11px", fontSize: 12.5 }} onClick={editStudent}>
            <Pencil size={13} strokeWidth={2} color="var(--text-2)" />
            {t.editAction}
          </button>
          <button className="ghost-icon-btn" onClick={closeDetail} style={{ margin: "-2px -4px 0 0" }}>
            <X size={17} strokeWidth={2} color="var(--text-2)" />
          </button>
        </div>

        <div style={{ padding: "18px 24px", overflowY: "auto", minHeight: 0, display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Thống kê */}
          <div style={{ display: "flex", gap: 10 }}>
            {stat(vi ? "Đã học" : "Learned", learned + (vi ? " buổi" : ""), "var(--accent)")}
            {stat(vi ? "Đã đóng" : "Paid", paid + (vi ? " buổi" : ""))}
            {stat(
              vi ? "Còn nợ / chu kỳ" : "Owed / cycle",
              Math.max(0, learned - paid) + "/" + prog.cycle,
              prog.due ? "var(--warn)" : "var(--text)"
            )}
          </div>
          {prog.due && (
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--warn)", marginTop: -8 }}>
              ⚠️ {vi ? "Đã đến kỳ thu học phí" : "Payment due"}
              {st.fee ? " · " + st.fee : ""}
            </div>
          )}

          {/* Lịch học */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              {vi ? "Lịch học trong tuần" : "Weekly schedule"}
            </div>
            {mySessions.length === 0 ? (
              <div style={{ fontSize: 13, color: "var(--text-3)" }}>
                {vi ? "Chưa xếp lịch cho học viên này." : "No sessions scheduled."}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {mySessions
                  .slice()
                  .sort((a, b) => a.day - b.day || CA_SLOTS.indexOf(a.t) - CA_SLOTS.indexOf(b.t))
                  .map((s) => (
                    <div
                      key={s.id}
                      style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                        border: "1px solid var(--border)", borderRadius: 8, fontSize: 13,
                      }}
                    >
                      <span style={{ fontWeight: 600, minWidth: 64 }}>{dayName(s.day)}</span>
                      <span style={{ color: "var(--text-2)" }}>{caName(s.t)}</span>
                      <span style={{ marginLeft: "auto", fontWeight: 500 }}>{s.n}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Điểm danh bù */}
          {mySessions.length > 0 && (
            <div
              style={{
                background: "var(--sidebar)", border: "1px solid var(--subtle)",
                borderRadius: 10, padding: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <CalendarPlus size={16} strokeWidth={2} color="var(--accent)" />
                <span style={{ fontSize: 14, fontWeight: 600 }}>{vi ? "Điểm danh bù" : "Backfill attendance"}</span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <select
                  className="input"
                  value={effBuSession}
                  onChange={(e) => setBuSession(Number(e.target.value))}
                  style={{ flex: "1 1 160px", cursor: "pointer" }}
                >
                  {mySessions
                    .slice()
                    .sort((a, b) => a.day - b.day || CA_SLOTS.indexOf(a.t) - CA_SLOTS.indexOf(b.t))
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {dayName(s.day)} · {caName(s.t)} · {s.n}
                      </option>
                    ))}
                </select>
                <input
                  type="date"
                  className="input"
                  value={buDate}
                  onChange={(e) => setBuDate(e.target.value)}
                  style={{ flex: "0 1 150px" }}
                />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1, background: "var(--success)", padding: "9px 14px" }}
                  disabled={!effBuSession || !buDate}
                  onClick={() => effBuSession && markAttendance(Number(effBuSession), st.id, buDate, true)}
                >
                  <Check size={14} strokeWidth={2.4} />
                  {vi ? "Ghi nhận Có mặt" : "Mark present"}
                </button>
                <button
                  className="btn"
                  style={{ padding: "9px 14px" }}
                  disabled={!effBuSession || !buDate}
                  onClick={() => effBuSession && markAttendance(Number(effBuSession), st.id, buDate, false)}
                >
                  {vi ? "Vắng" : "Absent"}
                </button>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 8 }}>
                {vi
                  ? "Chọn buổi + ngày rồi bấm — dùng để ghi nhận các buổi đã học trước khi có hệ thống."
                  : "Pick a session + date to backfill past attendance."}
              </div>
            </div>
          )}

          {/* Lịch sử điểm danh */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              {vi ? `Lịch sử điểm danh (${history.length})` : `Attendance history (${history.length})`}
            </div>
            {history.length === 0 ? (
              <div style={{ fontSize: 13, color: "var(--text-3)" }}>
                {vi ? "Chưa có buổi nào được điểm danh." : "No attendance recorded yet."}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {history.map((r, i) => (
                  <div
                    key={r.sessionId + "-" + r.date + "-" + i}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                      borderRadius: 8, fontSize: 13,
                      border: "1px solid " + (r.present ? "var(--success-border)" : "var(--danger-border)"),
                      background: r.present ? "var(--success-tint)" : "var(--danger-tint)",
                    }}
                  >
                    <span
                      style={{
                        width: 20, height: 20, minWidth: 20, borderRadius: 99, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        background: r.present ? "var(--success)" : "var(--danger)",
                      }}
                    >
                      {r.present ? <Check size={13} strokeWidth={3} color="#fff" /> : <X size={13} strokeWidth={3} color="#fff" />}
                    </span>
                    <span className="tnum" style={{ fontWeight: 600 }}>{fmtDate(r.date)}</span>
                    <span style={{ color: "var(--text-2)" }}>{sessName(r.sessionId)}</span>
                    <span style={{ marginLeft: "auto", fontWeight: 600, color: r.present ? "var(--success)" : "var(--danger)" }}>
                      {r.present ? (vi ? "Đã học" : "Present") : (vi ? "Vắng" : "Absent")}
                    </span>
                    <button
                      className="ghost-icon-btn"
                      title={vi ? "Xoá" : "Remove"}
                      onClick={() => removeAttendance(r.sessionId, st.id, r.date)}
                      style={{ padding: 4 }}
                    >
                      <X size={13} strokeWidth={2} color="var(--text-3)" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
