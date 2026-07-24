"use client";

import { ChevronDown, Download, Filter, Pencil, Plus } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts, statusLabels } from "@/lib/i18n";
import { attendanceStat, tuitionProgress } from "@/lib/derived";
import type { Student } from "@/lib/types";
import { Avatar, Page, PageHeader } from "@/components/ui/bits";

const GRID = "32px 1fr 160px 160px 130px 40px";

export default function StudentsPage() {
  const lang = useApp((s) => s.lang);
  const students = useApp((s) => s.students);
  const sessions = useApp((s) => s.sessions);
  const filter = useApp((s) => s.filter);
  const setFilter = useApp((s) => s.setFilter);
  const openModal = useApp((s) => s.openModal);
  const t = dicts[lang];
  const vi = lang !== "en";

  const filtered = students.filter((s) => filter === "All" || s.status === filter);

  const openAdd = () =>
    openModal(
      { mode: "add", kind: "student" },
      { name: "", email: "", phone: "", cycle: "10", fee: "", status: "Active" }
    );

  const openEdit = (s: Student) =>
    openModal(
      { mode: "edit", kind: "student", id: s.id },
      {
        name: s.name, email: s.email, phone: s.phone || "",
        cycle: String(s.cycle || 10), fee: s.fee || "", status: s.status,
      }
    );

  const statusClass = (st: string) =>
    st === "Active" ? "pill-success" : st === "At risk" ? "pill-danger" : "pill-neutral";

  const filterLabels: Record<string, string> = vi
    ? { All: "Tất cả", Active: "Đang học", "At risk": "Rủi ro", Inactive: "Nghỉ học" }
    : { All: "All", Active: "Active", "At risk": "At risk", Inactive: "Inactive" };

  const activeCount = students.filter((s) => s.status === "Active").length;
  const subtitle = vi
    ? `${students.length} học viên · ${activeCount} đang học`
    : `${students.length} students · ${activeCount} active`;
  const showing = vi
    ? `Hiển thị ${filtered.length} / ${students.length} học viên`
    : `Showing ${filtered.length} of ${students.length} students`;

  return (
    <Page>
      <PageHeader
        title={t.studentsTitle}
        subtitle={subtitle}
        actions={
          <>
            <button className="btn">
              <Download size={14} strokeWidth={2} color="var(--text-2)" />
              {t.exportBtn}
            </button>
            <button className="btn-primary" onClick={openAdd}>
              <Plus size={14} strokeWidth={2.2} />
              {t.addStudent}
            </button>
          </>
        }
      />

      <div className="card tblc" style={{ overflow: "hidden" }}>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "14px 20px",
            borderBottom: "1px solid var(--hairline)",
          }}
        >
          {["All", "Active", "At risk", "Inactive"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 500,
                padding: "6px 12px", borderRadius: 8,
                background: filter === f ? "var(--accent-tint)" : "transparent",
                color: filter === f ? "var(--accent)" : "var(--text-2)",
              }}
            >
              {filterLabels[f]}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button className="btn" style={{ padding: "7px 12px", fontSize: 12.5 }}>
            <Filter size={13} strokeWidth={2} color="var(--text-2)" />
            {t.filtersBtn}
          </button>
          <button className="btn" style={{ padding: "7px 12px", fontSize: 12.5 }}>
            {t.gradeLevel}
            <ChevronDown size={13} strokeWidth={2} color="var(--text-2)" />
          </button>
        </div>

        <div className="table-head trow" style={{ gridTemplateColumns: GRID, padding: "9px 20px" }}>
          <input type="checkbox" style={{ width: 15, height: 15, accentColor: "#5E5CE6" }} />
          <span>{t.colStudent}</span>
          <span>{t.colAttendance}</span>
          <span>{t.colFee}</span>
          <span>{t.colStatus}</span>
          <span />
        </div>

        {filtered.map((s, i) => {
          const att = attendanceStat(s, sessions);
          const fee = tuitionProgress(s, sessions);
          return (
            <div
              key={s.id}
              className="list-row trow"
              style={{ gridTemplateColumns: GRID, padding: "11px 20px" }}
            >
              <input type="checkbox" style={{ width: 15, height: 15, accentColor: "#5E5CE6" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <Avatar name={s.name} index={i} />
                <div>
                  <div style={{ fontWeight: 500 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-2)" }}>{s.email}</div>
                </div>
              </div>
              <div>
                <div className="progress-track" style={{ width: "100%", maxWidth: 110, height: 4, marginBottom: 5 }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: (att.pct == null ? 0 : att.pct) + "%",
                      background:
                        att.pct == null ? "var(--border)"
                        : att.pct >= 90 ? "var(--success-2)"
                        : att.pct >= 70 ? "var(--warn-2)"
                        : "var(--danger-2)",
                    }}
                  />
                </div>
                <span style={{ fontSize: 12, color: att.pct == null ? "var(--text-3)" : "var(--body-c)" }}>
                  {att.taken
                    ? att.present + "/" + att.taken + (vi ? " buổi" : "") + " · " + att.pct + "%"
                    : vi ? "Chưa có dữ liệu" : "No data"}
                </span>
              </div>
              <div>
                <div className="progress-track" style={{ width: "100%", maxWidth: 110, height: 4, marginBottom: 5 }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: (fee.shown / fee.cycle) * 100 + "%",
                      background: fee.due ? "var(--warn-2)" : "var(--accent-strong)",
                    }}
                  />
                </div>
                <div style={{ fontSize: 12, color: "var(--body-c)" }}>
                  {fee.shown}/{fee.cycle}
                  {vi ? " buổi" : ""}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: fee.due ? "var(--warn)" : "var(--text-3)",
                    fontWeight: fee.due ? 600 : 400,
                  }}
                >
                  {fee.due
                    ? vi ? "Đến kỳ thu học phí" : "Payment due"
                    : vi ? "còn " + fee.remain + " buổi" : fee.remain + " left"}
                </div>
              </div>
              <span>
                <span className={"pill " + statusClass(s.status)}>{statusLabels[lang][s.status]}</span>
              </span>
              <button className="ghost-icon-btn" title={t.editAction} onClick={() => openEdit(s)}>
                <Pencil size={15} strokeWidth={2} color="var(--text-3)" />
              </button>
            </div>
          );
        })}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
          <span style={{ fontSize: 13, color: "var(--text-2)" }}>{showing}</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              style={{
                border: "1px solid var(--border)", background: "var(--surface)", borderRadius: 8,
                padding: "6px 12px", fontSize: 12.5, color: "var(--text-3)", cursor: "default",
              }}
            >
              {t.prev}
            </button>
            <button className="btn" style={{ padding: "6px 12px", fontSize: 12.5 }}>{t.next}</button>
          </div>
        </div>
      </div>
    </Page>
  );
}
