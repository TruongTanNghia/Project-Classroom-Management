"use client";

import { Calendar, GraduationCap, RefreshCw, TrendingUp, TriangleAlert } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts } from "@/lib/i18n";
import { Page, PageHeader } from "@/components/ui/bits";

export default function InsightsPage() {
  const lang = useApp((s) => s.lang);
  const t = dicts[lang];
  const vi = lang !== "en";

  const insights = [
    {
      title: vi ? "Toán Khối 9 cần can thiệp" : "Grade 9 Math needs intervention",
      tag: "Risk",
      Icon: TriangleAlert,
      iconColor: "var(--danger)",
      wrapBg: "var(--danger-tint)",
      body: vi
        ? "Điểm trung bình Algebra II giảm từ 84% xuống 72% trong ba tuần. Sáu học viên chiếm phần lớn mức giảm; cả sáu cũng giảm chuyên cần vào thứ Hai."
        : "Average scores in Algebra II dropped from 84% to 72% over three weeks. Six students account for most of the decline; all six also show falling attendance on Mondays.",
      cta: vi ? "Tạo kế hoạch can thiệp" : "Create intervention plan",
    },
    {
      title: vi ? "Chuyên cần hồi phục toàn trường" : "Attendance recovering school-wide",
      tag: "Trend",
      Icon: TrendingUp,
      iconColor: "var(--accent)",
      wrapBg: "var(--hairline)",
      body: vi
        ? "Chuyên cần tăng 1,1 điểm từ khi áp dụng chính sách đi trễ mới ngày 06/07. Khối 10 và 12 cải thiện nhiều nhất; Khối 9 vẫn thấp hơn mục tiêu 2,3 điểm."
        : "Attendance is up 1.1 points since the new late-arrival policy took effect on Jul 6. Grades 10 and 12 improved most; Grade 9 remains 2.3 points below target.",
      cta: vi ? "Xem chi tiết" : "View breakdown",
    },
    {
      title: vi ? "12 học viên sẵn sàng lớp nâng cao" : "12 students ready for advanced placement",
      tag: "Opportunity",
      Icon: GraduationCap,
      iconColor: "var(--success)",
      wrapBg: "var(--success-tint)",
      body: vi
        ? "Dựa trên xu hướng GPA và bách phân vị bài đánh giá, 12 học viên Khối 10–11 đủ điều kiện vào lộ trình nâng cao kỳ tới. Hạn đăng ký 15/08."
        : "Based on GPA trajectory and assessment percentile, 12 students in Grades 10–11 qualify for AP-track courses next term. Enrollment deadline is Aug 15.",
      cta: vi ? "Xem danh sách" : "Review candidates",
    },
    {
      title: vi ? "Mẫu vắng bất thường ở lớp 11-B" : "Unusual absence pattern in 11-B",
      tag: "Anomaly",
      Icon: Calendar,
      iconColor: "var(--warn)",
      wrapBg: "var(--warn-tint)",
      body: vi
        ? "Lớp 11-B có cụm vắng mặt vào thứ Năm suốt bốn tuần liên tiếp — gấp 3,4 lần mức nền. Có thể liên quan thay đổi lịch ngày 19/06."
        : "Homeroom 11-B shows clustered absences every Thursday for four consecutive weeks — 3.4× the school baseline. May correlate with the schedule change on Jun 19.",
      cta: vi ? "Kiểm tra" : "Investigate",
    },
  ];

  const tagClass: Record<string, string> = {
    Risk: "pill-danger",
    Opportunity: "pill-success",
    Trend: "pill-accent",
    Anomaly: "pill-warn",
  };
  const tagLabel: Record<string, string> = vi
    ? { Risk: "Rủi ro", Trend: "Xu hướng", Opportunity: "Cơ hội", Anomaly: "Bất thường" }
    : { Risk: "Risk", Trend: "Trend", Opportunity: "Opportunity", Anomaly: "Anomaly" };

  return (
    <Page>
      <PageHeader
        title={t.insightsTitle}
        subtitle={t.insightsSub}
        actions={
          <button className="btn">
            <RefreshCw size={14} strokeWidth={2} color="var(--text-2)" />
            {t.refresh}
          </button>
        }
      />
      <div data-stagger="true" className="g2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {insights.map((ins) => (
          <div
            key={ins.tag}
            className="card"
            style={{ padding: 22, display: "flex", flexDirection: "column", gap: 12 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 30, height: 30, minWidth: 30, borderRadius: 8, background: ins.wrapBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <ins.Icon size={14} strokeWidth={2} color={ins.iconColor} />
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{ins.title}</span>
              <span className={"pill " + tagClass[ins.tag]}>{tagLabel[ins.tag]}</span>
            </div>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "var(--body-c)" }}>{ins.body}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
              <button className="btn-primary" style={{ padding: "7px 13px", fontSize: 12.5 }}>{ins.cta}</button>
              <button className="btn" style={{ padding: "7px 13px", fontSize: 12.5 }}>{t.dismiss}</button>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}
