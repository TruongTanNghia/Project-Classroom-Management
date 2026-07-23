"use client";

import { TriangleAlert } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts } from "@/lib/i18n";

export default function DeleteConfirm() {
  const lang = useApp((s) => s.lang);
  const modal = useApp((s) => s.modal);
  const closeModal = useApp((s) => s.closeModal);
  const confirmDelete = useApp((s) => s.confirmDelete);
  const students = useApp((s) => s.students);
  const courses = useApp((s) => s.courses);
  const zalo = useApp((s) => s.zalo);
  const threads = useApp((s) => s.threads);
  const sessions = useApp((s) => s.sessions);
  const t = dicts[lang];

  if (!modal || modal.id == null) return null;

  const titleByKind = {
    student: t.mDeleteTitle,
    course: t.mDelCourse,
    zalo: t.mDelZalo,
    thread: t.mDelThread,
    sched: t.mDelSched,
  }[modal.kind];
  const msgByKind = {
    student: t.mDeleteMsg,
    course: t.mDeleteMsgCourse,
    zalo: t.mDelMsgGeneric,
    thread: t.mDelMsgGeneric,
    sched: t.mDelMsgGeneric,
  }[modal.kind];
  const name =
    modal.kind === "student" ? students.find((r) => r.id === modal.id)?.name
    : modal.kind === "course" ? courses.find((r) => r.id === modal.id)?.name
    : modal.kind === "zalo" ? zalo.find((r) => r.id === modal.id)?.name
    : modal.kind === "thread" ? threads.find((r) => r.id === modal.id)?.from
    : sessions.find((r) => r.id === modal.id)?.n;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50, display: "flex",
        alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <div
        onClick={closeModal}
        style={{ position: "absolute", inset: 0, background: "var(--overlay)", animation: "fadeUp 0.18s ease both" }}
      />
      <div
        style={{
          position: "relative", width: "100%", maxWidth: 420,
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16,
          boxShadow: "var(--modal-shadow)", animation: "fadeUp 0.24s cubic-bezier(0.16,1,0.3,1) both",
          padding: 24, display: "flex", flexDirection: "column", gap: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span
            style={{
              width: 38, height: 38, minWidth: 38, borderRadius: 10, background: "var(--danger-tint)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <TriangleAlert size={18} strokeWidth={2} color="var(--danger)" />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
              {titleByKind} · {name || ""}
            </div>
            <div style={{ fontSize: 13.5, color: "var(--text-2)", marginTop: 4, lineHeight: 1.55 }}>
              {msgByKind}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <button className="btn" style={{ padding: "9px 16px" }} onClick={closeModal}>
            {t.mDeleteKeep}
          </button>
          <button
            onClick={confirmDelete}
            style={{
              background: "#DC2626", color: "#fff", border: "none", borderRadius: 8,
              padding: "9px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}
          >
            {t.deleteWord}
          </button>
        </div>
      </div>
    </div>
  );
}
