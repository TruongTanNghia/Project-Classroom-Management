"use client";

import {
  ChevronRight, FileText, GraduationCap, Mail, Sparkles, Users,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts } from "@/lib/i18n";
import { Page, PageHeader } from "@/components/ui/bits";

export default function SettingsPage() {
  const lang = useApp((s) => s.lang);
  const t = dicts[lang];
  const vi = lang !== "en";

  const sections = [
    {
      title: vi ? "Hồ sơ trung tâm" : "School profile",
      desc: vi ? "Tên, logo, năm học và thông tin liên hệ" : "Name, logo, academic year and contact details",
      Icon: GraduationCap,
    },
    {
      title: vi ? "Người dùng & phân quyền" : "Users & permissions",
      desc: vi ? "24 tài khoản nhân sự · 3 vai trò admin" : "24 staff accounts · 3 admin roles",
      Icon: Users,
    },
    {
      title: vi ? "Tùy chọn AI" : "AI preferences",
      desc: vi ? "Ngưỡng rủi ro, lịch bản tin, nguồn dữ liệu" : "Risk thresholds, briefing schedule, data sources",
      Icon: Sparkles,
    },
    {
      title: vi ? "Thông báo" : "Notifications",
      desc: vi ? "Email tổng hợp, định tuyến cảnh báo, liên lạc phụ huynh" : "Email digests, alert routing, parent communication",
      Icon: Mail,
    },
    {
      title: vi ? "Dữ liệu & tích hợp" : "Data & integrations",
      desc: vi ? "Đồng bộ SIS, nhập sổ điểm, truy cập API" : "SIS sync, gradebook import, API access",
      Icon: FileText,
    },
  ];

  return (
    <Page maxWidth={760}>
      <PageHeader title={t.settingsTitle} subtitle={t.settingsSub} />

      <div className="card tblc" style={{ overflow: "hidden" }}>
        {sections.map((s) => (
          <div
            key={s.title}
            className="hover-row"
            style={{
              display: "flex", alignItems: "center", gap: 14, padding: "16px 20px",
              borderBottom: "1px solid var(--hairline)",
            }}
          >
            <span
              style={{
                width: 36, height: 36, minWidth: 36, borderRadius: 8, background: "var(--sidebar)",
                border: "1px solid var(--border)", display: "flex", alignItems: "center",
                justifyContent: "center",
              }}
            >
              <s.Icon size={15} strokeWidth={2} color="var(--text-2)" />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>{s.title}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-2)", marginTop: 1 }}>{s.desc}</div>
            </div>
            <ChevronRight size={15} strokeWidth={2} color="var(--text-3)" />
          </div>
        ))}
      </div>

      <div
        style={{
          background: "var(--surface)", border: "1px solid var(--danger-border)", borderRadius: 12,
          padding: 20, display: "flex", alignItems: "center", gap: 14,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, color: "var(--danger)" }}>{t.dangerTitle}</div>
          <div style={{ fontSize: 12.5, color: "var(--text-2)", marginTop: 1 }}>{t.dangerSub}</div>
        </div>
        <button className="btn" style={{ padding: "7px 13px", fontSize: 12.5 }}>{t.exportData}</button>
        <button
          style={{
            background: "var(--danger-tint)", color: "var(--danger)",
            border: "1px solid var(--danger-border)", borderRadius: 8, padding: "7px 13px",
            fontSize: 12.5, fontWeight: 500, cursor: "pointer",
          }}
        >
          {t.archive}
        </button>
      </div>
    </Page>
  );
}
