"use client";

import { CircleCheck, Clock, Plus, Users } from "lucide-react";
import { useApp } from "@/lib/store";
import { dayMeta, dicts } from "@/lib/i18n";
import { attendanceTally, sessionDayPresent, slotTimes } from "@/lib/derived";
import { subjectTintClass } from "@/lib/subjects";
import type { Session } from "@/lib/types";
import { Page, PageHeader } from "@/components/ui/bits";

const GRID = "80px repeat(7, 1fr)";

export default function SchedulePage() {
  const lang = useApp((s) => s.lang);
  const sessions = useApp((s) => s.sessions);
  const students = useApp((s) => s.students);
  const attRecords = useApp((s) => s.attRecords);
  const openModal = useApp((s) => s.openModal);
  const openAttend = useApp((s) => s.openAttend);
  const t = dicts[lang];
  const vi = lang !== "en";
  const days = dayMeta[lang];
  const slots = slotTimes(sessions);
  const todayISO = (() => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  })();

  const openAdd = (day?: number, time = "07:30–09:00") =>
    openModal(
      { mode: "add", kind: "sched" },
      {
        name: "", room: "", date: "", subject: "CS", studentIds: [],
        dayCa: day != null ? { [day]: time } : {},
      }
    );

  const openEdit = (b: Session) =>
    openModal(
      { mode: "edit", kind: "sched", id: b.id },
      {
        name: b.n, room: b.r, time: b.t, day: b.day, date: b.date || "", subject: b.s,
        studentIds: (b.studentIds || []).slice(), att: { ...(b.att || {}) },
      }
    );

  let filled = 0;
  const grid = slots.map((tm, ti) => ({
    time: tm,
    caName: (vi ? "Ca " : "Slot ") + (ti + 1),
    cells: days.map((_, di) => {
      const b = sessions.find((r) => r.day === di && r.t === tm);
      if (!b) return { session: undefined, day: di };
      filled++;
      return { session: b, day: di };
    }),
  }));
  const freeCells = slots.length * 7 - filled;
  const tally = attendanceTally(attRecords);
  const attSummary = tally.marks
    ? (vi ? " · Điểm danh: " : " · Attendance: ") + tally.present + "/" + tally.marks + (vi ? " lượt có mặt" : " present")
    : "";
  const summary = vi
    ? filled + " buổi học · " + freeCells + " ca trống trong tuần" + attSummary
    : filled + " sessions · " + freeCells + " free slots this week" + attSummary;

  return (
    <Page>
      <PageHeader
        title={t.scheduleTitle}
        subtitle={vi ? "Lịch học theo tuần · đủ 7 ngày" : "Weekly schedule · all 7 days"}
        actions={
          <button className="btn-primary" onClick={() => openAdd()}>
            <Plus size={14} strokeWidth={2.2} />
            {t.addSchedCta}
          </button>
        }
      />

      <div className="card tblc fade-up" style={{ padding: 16 }}>
        <div className="trow" style={{ display: "grid", gridTemplateColumns: GRID, gap: 8, minWidth: 900 }}>
          <div />
          {days.map((d) => (
            <div
              key={d.day}
              style={{
                padding: "10px 8px", borderRadius: 10, textAlign: "center",
                background: "var(--sidebar)", border: "1px solid var(--subtle)",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{d.short}</div>
              <div style={{ fontSize: 11, color: "var(--text-2)" }}>{d.day}</div>
            </div>
          ))}
        </div>

        {grid.map((row) => (
          <div
            key={row.time}
            className="trow"
            style={{ display: "grid", gridTemplateColumns: GRID, gap: 8, marginTop: 8, minWidth: 900 }}
          >
            <div style={{ textAlign: "right", padding: "8px 6px 0 0" }}>
              <div style={{ fontSize: 12, color: "var(--body-c)", fontWeight: 600 }}>{row.caName}</div>
              <div className="tnum" style={{ fontSize: 10, color: "var(--text-3)", whiteSpace: "nowrap" }}>
                {row.time}
              </div>
            </div>
            {row.cells.map((cell) => {
              const b = cell.session;
              if (!b) {
                return (
                  <button
                    key={cell.day}
                    className="free-slot"
                    title={t.addSchedCta}
                    onClick={() => openAdd(cell.day, row.time)}
                  >
                    <Plus size={13} strokeWidth={2.2} />
                    {t.freeSlot}
                  </button>
                );
              }
              const ids = b.studentIds || [];
              const names = ids
                .map((id) => students.find((x) => x.id === id)?.name)
                .filter(Boolean)
                .map((nm) => (nm as string).split(" ")[0]);
              const stu = names.length
                ? names.slice(0, 2).join(", ") + (names.length > 2 ? " +" + (names.length - 2) : "")
                : "";
              const attCount = sessionDayPresent(b.id, todayISO, attRecords); // có mặt hôm nay
              const dateBadge = b.date ? (vi ? "Từ " : "From ") + b.date.slice(8, 10) + "/" + b.date.slice(5, 7) : "";
              return (
                <div
                  key={cell.day}
                  className={"sched-block " + (subjectTintClass[b.s] || "tint-0")}
                  style={{ borderLeft: "3px solid currentColor" }}
                  onClick={() => openEdit(b)}
                >
                  {dateBadge && (
                    <div style={{ fontSize: 10, opacity: 0.75, marginBottom: 2, fontWeight: 700 }}>
                      {dateBadge}
                    </div>
                  )}
                  {b.n}
                  {ids.length > 0 && (
                    <div
                      style={{
                        display: "flex", alignItems: "center", gap: 4, fontSize: 10.5,
                        opacity: 0.85, marginTop: 3, fontWeight: 500,
                      }}
                    >
                      <Users size={10} strokeWidth={2.4} />
                      {ids.length} · {stu}
                      {/* Bấm badge để mở popup điểm danh */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openAttend(b.id);
                        }}
                        title={vi ? "Điểm danh" : "Attendance"}
                        style={{
                          marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 3,
                          fontWeight: 700, whiteSpace: "nowrap", cursor: "pointer",
                          border: "1px solid currentColor", borderRadius: 99, padding: "1px 7px",
                          background: "rgba(255,255,255,0.35)", color: "inherit", fontSize: 10,
                        }}
                      >
                        <CircleCheck size={11} strokeWidth={2.4} />
                        {attCount}/{ids.length}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <div
          style={{
            display: "flex", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 14,
            borderTop: "1px solid var(--hairline)", fontSize: 12.5, color: "var(--text-2)",
          }}
        >
          <Clock size={14} strokeWidth={2} color="var(--text-3)" />
          {summary}
        </div>
      </div>
    </Page>
  );
}
