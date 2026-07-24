"use client";

import {
  ArrowUpRight, Check, Download, FileText, GraduationCap, Mail, MoreHorizontal, Sparkles,
  TriangleAlert, Users,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts, riskLabels } from "@/lib/i18n";
import { attendanceStat } from "@/lib/derived";
import { Avatar, Page, PageHeader } from "@/components/ui/bits";

const ATT_DATA = [91.2, 92.4, 93.1, 92.8, 94.0, 93.6, 92.1, 90.4, 91.8, 92.9, 93.7, 93.4];

export default function DashboardPage() {
  const lang = useApp((s) => s.lang);
  const students = useApp((s) => s.students);
  const sessions = useApp((s) => s.sessions);
  const t = dicts[lang];
  const vi = lang !== "en";

  // KPI tính thật từ dữ liệu học viên
  const atRiskStudents = students.filter((s) => s.status === "At risk");
  const gpas = students.map((s) => parseFloat(s.gpa || "")).filter((n) => !isNaN(n));
  const avgGpa = gpas.length ? (gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(2) : "—";
  const attPcts = students
    .map((s) => attendanceStat(s, sessions).pct)
    .filter((p): p is number => p != null);
  const avgAtt = attPcts.length ? Math.round(attPcts.reduce((a, b) => a + b, 0) / attPcts.length) + "%" : "—";

  const kpis = [
    { label: vi ? "Tổng học viên" : "Total students", value: students.length.toLocaleString("vi-VN"), Icon: Users },
    { label: vi ? "Tỷ lệ chuyên cần" : "Attendance rate", value: avgAtt, Icon: Check },
    { label: vi ? "GPA trung bình" : "Average GPA", value: avgGpa, Icon: GraduationCap },
    { label: vi ? "Học viên rủi ro" : "At-risk students", value: String(atRiskStudents.length), Icon: TriangleAlert },
  ];

  const aiActions = [
    { label: vi ? "Soạn tin cho gia đình có rủi ro" : "Draft outreach to at-risk families", Icon: Mail },
    { label: vi ? "Tạo kế hoạch can thiệp học tập" : "Generate an intervention plan", Icon: FileText },
    { label: vi ? "Xem bất thường chuyên cần" : "Review attendance anomalies", Icon: TriangleAlert },
  ];

  // Bảng "cần chú ý" = học viên rủi ro thật
  const atRisk = atRiskStudents.slice(0, 6).map((s) => {
    const att = attendanceStat(s, sessions);
    return {
      name: s.name,
      id: s.email || "",
      grade: s.grade ? (vi ? "Khối " : "Grade ") + s.grade : "—",
      attendance: att.pct != null ? att.pct + "%" : "—",
      signal: s.homeroom || (vi ? "Cần theo dõi" : "Needs monitoring"),
      risk: "High",
    };
  });

  const riskClass = (r: string) =>
    r === "High" ? "pill-danger" : r === "Medium" ? "pill-warn" : "pill-success";

  return (
    <Page gap={24}>
      <PageHeader
        title={t.greeting}
        subtitle={t.dashSub}
        actions={
          <button className="btn">
            <Download size={14} strokeWidth={2} color="var(--text-2)" />
            {t.exportReport}
          </button>
        }
      />

      <div data-stagger="true" className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {kpis.map((k) => (
          <div key={k.label} className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ color: "var(--text-2)", fontSize: 13, fontWeight: 500 }}>{k.label}</span>
              <k.Icon size={16} strokeWidth={2} color="var(--text-3)" />
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em" }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="g2a" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, alignItems: "start" }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{t.weeklyAtt}</div>
              <div style={{ color: "var(--text-2)", fontSize: 13, marginTop: 2 }}>{t.weeklyAttSub}</div>
            </div>
            <div
              style={{
                display: "flex", gap: 4, background: "var(--sidebar)",
                border: "1px solid var(--border)", borderRadius: 8, padding: 3,
              }}
            >
              <button style={{ ...rangeBtnStyle, background: "var(--seg-active-bg)", boxShadow: "0 1px 2px rgba(16,24,40,0.06)" }}>
                12w
              </button>
              <button style={{ ...rangeBtnStyle, color: "var(--text-2)" }}>{t.term}</button>
              <button style={{ ...rangeBtnStyle, color: "var(--text-2)" }}>{t.year}</button>
            </div>
          </div>
          {attPcts.length === 0 ? (
            <div
              style={{
                height: 180, marginTop: 20, display: "flex", alignItems: "center",
                justifyContent: "center", color: "var(--text-3)", fontSize: 13,
              }}
            >
              {vi ? "Chưa có dữ liệu điểm danh để thống kê." : "No attendance data yet."}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 180, marginTop: 20 }}>
              {ATT_DATA.map((v, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 8, height: "100%", justifyContent: "flex-end",
                  }}
                >
                  <div
                    title={v + "%"}
                    style={{
                      width: "100%", maxWidth: 34, borderRadius: "8px 8px 4px 4px",
                      background: i === ATT_DATA.length - 1 ? "var(--accent-strong)" : "var(--accent-bar-dim)",
                      height: ((v - 82) / 13) * 100 + "%",
                      animation: "growUp 0.7s cubic-bezier(0.16,1,0.3,1) both",
                      animationDelay: i * 0.05 + "s",
                    }}
                  />
                  <span style={{ fontSize: 11, color: "var(--text-3)" }}>W{i + 1}</span>
                </div>
              ))}
            </div>
          )}
          <div
            style={{
              display: "flex", gap: 20, marginTop: 16, paddingTop: 16,
              borderTop: "1px solid var(--hairline)",
            }}
          >
            <div style={legendStyle}>
              <span style={{ width: 8, height: 8, borderRadius: 3, background: "var(--accent-strong)" }} />
              {t.attRate}
            </div>
            <div style={legendStyle}>
              <span style={{ width: 8, height: 8, borderRadius: 3, background: "var(--border)" }} />
              {t.target}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 26, height: 26, borderRadius: 9, background: "var(--accent-tint)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Sparkles size={13} strokeWidth={2} color="var(--accent)" />
            </span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{t.aiBrief}</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-3)" }}>08:00 AM</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--body-c)" }}>
            {students.length === 0
              ? vi
                ? "Chưa có dữ liệu học viên. Hãy thêm học viên, xếp lịch và điểm danh — AI sẽ tổng hợp tình hình mỗi ngày tại đây."
                : "No student data yet. Add students, build the schedule and take attendance — the AI will summarize each day here."
              : t.briefBody}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {aiActions.map((a) => (
              <button key={a.label} className="ai-action-btn">
                <a.Icon size={14} strokeWidth={2} color="var(--accent)" />
                <span style={{ flex: 1 }}>{a.label}</span>
                <ArrowUpRight size={13} strokeWidth={2} color="var(--text-3)" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card tblc" style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{t.needAttention}</div>
            <div style={{ color: "var(--text-2)", fontSize: 13, marginTop: 2 }}>{t.needAttentionSub}</div>
          </div>
        </div>
        <div className="table-head trow" style={{ gridTemplateColumns: "2.2fr 1fr 1fr 1.4fr 1fr 40px" }}>
          <span>{t.colStudent}</span>
          <span>{t.colGrade}</span>
          <span>{t.colAttendance}</span>
          <span>{t.colSignal}</span>
          <span>{t.colRisk}</span>
          <span />
        </div>
        {atRisk.length === 0 && (
          <div style={{ padding: "16px 24px", fontSize: 13, color: "var(--text-3)" }}>
            {vi ? "Chưa có học viên rủi ro." : "No at-risk students."}
          </div>
        )}
        {atRisk.map((s, i) => (
          <div
            key={s.id}
            className="list-row trow"
            style={{ gridTemplateColumns: "2.2fr 1fr 1fr 1.4fr 1fr 40px", padding: "12px 24px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <Avatar name={s.name} index={i} max={3} />
              <div>
                <div style={{ fontWeight: 500 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-2)" }}>{s.id}</div>
              </div>
            </div>
            <span style={{ color: "var(--body-c)" }}>{s.grade}</span>
            <span style={{ color: "var(--body-c)" }}>{s.attendance}</span>
            <span style={{ color: "var(--text-2)", fontSize: 13 }}>{s.signal}</span>
            <span>
              <span className={"pill " + riskClass(s.risk)}>{riskLabels[lang][s.risk]}</span>
            </span>
            <button className="ghost-icon-btn">
              <MoreHorizontal size={15} strokeWidth={2} color="var(--text-3)" />
            </button>
          </div>
        ))}
      </div>
    </Page>
  );
}

const rangeBtnStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  borderRadius: 8,
  padding: "4px 10px",
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  color: "var(--text)",
};

const legendStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  fontSize: 12.5,
  color: "var(--text-2)",
};
