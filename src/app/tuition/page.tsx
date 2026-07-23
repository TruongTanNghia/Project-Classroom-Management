"use client";

import { Download, Send } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts } from "@/lib/i18n";
import {
  dueStudents, fmtAmt, recentPayments, revenueByCourse, revenueTotals,
} from "@/lib/derived";
import { revBarPalette } from "@/lib/subjects";
import { Avatar, Page, PageHeader } from "@/components/ui/bits";

const INV_GRID = "1.4fr 1fr 1fr 1fr 1fr 40px";

export default function TuitionPage() {
  const lang = useApp((s) => s.lang);
  const students = useApp((s) => s.students);
  const sessions = useApp((s) => s.sessions);
  const remindFee = useApp((s) => s.remindFee);
  const remindAll = useApp((s) => s.remindAll);
  const t = dicts[lang];
  const vi = lang !== "en";

  const { revAll, revMonth, revCount, revMonthCount } = revenueTotals(students);
  const due = dueStudents(students, sessions);
  const recent = recentPayments(students);
  const byCourse = revenueByCourse(students, sessions);
  const maxCourse = byCourse.reduce((m, c) => Math.max(m, c.amount), 1);

  const revKpis = [
    { label: vi ? "Tổng doanh thu" : "Total revenue", value: fmtAmt(revAll), note: revCount + (vi ? " lượt thu" : " payments") },
    { label: vi ? "Doanh thu tháng 7" : "July revenue", value: fmtAmt(revMonth), note: revMonthCount + (vi ? " lượt thu" : " payments") },
    { label: vi ? "Chờ thu" : "Awaiting payment", value: due.length + (vi ? " học viên" : " students"), note: vi ? "đã đủ số buổi" : "reached cycle" },
    { label: vi ? "Học viên đang học" : "Active students", value: String(students.filter((s) => s.status === "Active").length), note: (vi ? "trên tổng " : "of ") + students.length },
  ];

  const invoices = [
    { id: "INV-2026-007", period: vi ? "Tháng 7, 2026" : "July 2026", amount: "$1,240.00", date: "Jul 1, 2026", status: "Due" },
    { id: "INV-2026-006", period: vi ? "Tháng 6, 2026" : "June 2026", amount: "$1,240.00", date: "Jun 1, 2026", status: "Paid" },
    { id: "INV-2026-005", period: vi ? "Tháng 5, 2026" : "May 2026", amount: "$1,180.00", date: "May 1, 2026", status: "Paid" },
    { id: "INV-2026-004", period: vi ? "Tháng 4, 2026" : "April 2026", amount: "$1,180.00", date: "Apr 1, 2026", status: "Paid" },
    { id: "INV-2026-003", period: vi ? "Tháng 3, 2026" : "March 2026", amount: "$1,180.00", date: "Mar 1, 2026", status: "Paid" },
  ];

  const plans = [
    { name: vi ? "Số học viên" : "Seats", value: "1,284 / 1,500", note: vi ? "học viên đang dùng" : "students enrolled", pct: 86 },
    { name: "AI credits", value: "2,140 / 5,000", note: vi ? "đã dùng tháng này" : "used this month", pct: 43 },
    { name: vi ? "Lưu trữ" : "Storage", value: "182 / 500 GB", note: vi ? "tài liệu & media" : "documents & media", pct: 36 },
  ];

  return (
    <Page>
      <PageHeader
        title={t.billingTitle}
        subtitle={t.billingSub}
        actions={<button className="btn">{t.managePlan}</button>}
      />

      <div style={{ fontSize: 15, fontWeight: 600 }}>{t.revTitle}</div>
      <div data-stagger="true" className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {revKpis.map((k) => (
          <div key={k.label} className="card" style={{ padding: 20 }}>
            <div style={{ color: "var(--text-2)", fontSize: 13, fontWeight: 500 }}>{k.label}</div>
            <div className="tnum" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 10 }}>
              {k.value}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 4 }}>{k.note}</div>
          </div>
        ))}
      </div>

      <div className="g2a" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, alignItems: "start" }}>
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px 12px", fontSize: 14, fontWeight: 600 }}>{t.recentTitle}</div>
          {recent.length === 0 && (
            <div style={{ padding: "12px 20px 20px", fontSize: 13, color: "var(--text-3)" }}>
              {t.recentEmptyMsg}
            </div>
          )}
          {recent.map((p, i) => (
            <div
              key={p.student + "-" + p.id + "-" + i}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 20px",
                borderTop: "1px solid var(--hairline)",
              }}
            >
              <Avatar name={p.student} index={i} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 13.5 }}>{p.student}</div>
                <div style={{ fontSize: 12, color: "var(--text-2)" }}>
                  {p.date} · {p.sessions} {vi ? "buổi" : "sessions"}
                </div>
              </div>
              <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--success)" }}>{p.amount}</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 12px" }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{t.dueTitle}</span>
            {due.length > 0 && (
              <button
                onClick={() => remindAll(due.map((s) => ({ name: s.name, fee: s.fee })))}
                style={{
                  display: "flex", alignItems: "center", gap: 6, background: "var(--accent-tint)",
                  border: "1px solid var(--accent-border)", color: "var(--accent)", borderRadius: 8,
                  padding: "5px 11px", fontSize: 12, fontWeight: 500, cursor: "pointer",
                }}
              >
                <Send size={12} strokeWidth={2} />
                {t.remindAllBtn}
              </button>
            )}
          </div>
          {due.length === 0 && (
            <div style={{ padding: "12px 20px 20px", fontSize: 13, color: "var(--text-3)" }}>
              {t.dueEmptyMsg}
            </div>
          )}
          {due.map((s, i) => (
            <div
              key={s.id}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 20px",
                borderTop: "1px solid var(--hairline)",
              }}
            >
              <Avatar name={s.name} index={i + 2} />
              <div className="truncate-1" style={{ flex: 1, minWidth: 0, fontWeight: 500, fontSize: 13.5 }}>
                {s.name}
              </div>
              <span
                className="pill pill-warn"
                style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}
              >
                {s.fee || "—"}
              </span>
              <button
                onClick={() => remindFee(s.name, s.fee)}
                title={t.remindBtn}
                style={{
                  display: "flex", alignItems: "center", gap: 5, background: "var(--surface)",
                  border: "1px solid var(--border)", color: "var(--accent)", borderRadius: 8,
                  padding: "5px 10px", fontSize: 12, fontWeight: 500, cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <Send size={12} strokeWidth={2} />
                {t.remindBtn}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{t.revByCourse}</div>
        <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 2 }}>{t.revByCourseSub}</div>
        {byCourse.length === 0 && (
          <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 14 }}>{t.revNoData}</div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
          {byCourse.map((c, i) => (
            <div key={c.name}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--body-c)" }}>{c.name}</span>
                <span className="tnum" style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                  {fmtAmt(c.amount)}
                </span>
              </div>
              <div className="progress-track" style={{ height: 8 }}>
                <div
                  className="progress-fill"
                  style={{
                    width: Math.max(4, (c.amount / maxCourse) * 100) + "%",
                    background: revBarPalette[i % 7],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{t.managePlan}</div>
      <div data-stagger="true" className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {plans.map((p) => (
          <div key={p.name} className="card" style={{ padding: 20 }}>
            <div style={{ color: "var(--text-2)", fontSize: 13, fontWeight: 500, marginBottom: 10 }}>{p.name}</div>
            <div className="tnum" style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>{p.value}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-3)", margin: "2px 0 14px" }}>{p.note}</div>
            <div className="progress-track" style={{ height: 5 }}>
              <div
                className="progress-fill"
                style={{
                  width: p.pct + "%",
                  background: p.pct > 80 ? "var(--warn-2)" : "var(--accent-strong)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="card tblc" style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px 14px" }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{t.invoices}</div>
          <a href="#" style={{ fontSize: 13, fontWeight: 500 }}>{t.downloadAll}</a>
        </div>
        <div className="table-head trow" style={{ gridTemplateColumns: INV_GRID }}>
          <span>{t.colInvoice}</span>
          <span>{t.colPeriod}</span>
          <span>{t.colAmount}</span>
          <span>{t.colIssued}</span>
          <span>{t.colStatus}</span>
          <span />
        </div>
        {invoices.map((v) => (
          <div
            key={v.id}
            className="list-row trow"
            style={{ gridTemplateColumns: INV_GRID, padding: "12px 24px" }}
          >
            <span style={{ fontWeight: 500 }}>{v.id}</span>
            <span style={{ color: "var(--body-c)" }}>{v.period}</span>
            <span style={{ color: "var(--body-c)" }}>{v.amount}</span>
            <span style={{ color: "var(--text-2)" }}>{v.date}</span>
            <span>
              <span className={"pill " + (v.status === "Paid" ? "pill-success" : "pill-warn")}>
                {vi ? (v.status === "Paid" ? "Đã thanh toán" : "Đến hạn") : v.status}
              </span>
            </span>
            <button className="ghost-icon-btn">
              <Download size={14} strokeWidth={2} color="var(--text-3)" />
            </button>
          </div>
        ))}
      </div>
    </Page>
  );
}
