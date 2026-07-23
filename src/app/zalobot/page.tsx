"use client";

import { Pencil, Plus, Settings } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts, zaloStatusLabels } from "@/lib/i18n";
import type { ZaloAuto, ZaloLink } from "@/lib/types";
import { Avatar, Page, PageHeader } from "@/components/ui/bits";

const GRID = "2fr 1.5fr 1.1fr 1fr 1.6fr 40px";

export default function ZaloBotPage() {
  const lang = useApp((s) => s.lang);
  const zalo = useApp((s) => s.zalo);
  const zaloAuto = useApp((s) => s.zaloAuto);
  const toggleAuto = useApp((s) => s.toggleAuto);
  const openModal = useApp((s) => s.openModal);
  const t = dicts[lang];
  const vi = lang !== "en";

  const kpis = [
    { label: vi ? "Gia đình đã liên kết" : "Linked families", value: "1,047", note: vi ? "trên 1.284 học viên · 81,5%" : "of 1,284 students · 81.5%" },
    { label: vi ? "Tin nhắn tháng này" : "Messages this month", value: "1,501", note: vi ? "tự động + thủ công" : "automated + manual" },
    { label: vi ? "Tỷ lệ gửi thành công" : "Delivery rate", value: "97.2%", note: vi ? "tỷ lệ đọc 89,4%" : "read rate 89.4%" },
    { label: vi ? "Hủy nhận tin" : "Opt-outs", value: "12", note: vi ? "3 mới tháng này" : "3 new this month" },
  ];

  const autos: { key: keyof ZaloAuto; title: string; desc: string; stat: string }[] = [
    {
      key: "attend",
      title: vi ? "Cảnh báo chuyên cần" : "Attendance alerts",
      desc: vi ? "Báo phụ huynh qua Zalo trong 15 phút khi vắng không phép" : "Notify parents on Zalo within 15 min of an unexcused absence",
      stat: vi ? "214 tin tháng này" : "214 sent this month",
    },
    {
      key: "grades",
      title: vi ? "Báo cáo điểm hàng tuần" : "Weekly grade reports",
      desc: vi ? "Gửi tóm tắt điểm cho từng gia đình thứ Sáu 17:00 hằng tuần" : "Send each family a grade summary every Friday at 5:00 PM",
      stat: vi ? "1.180 tin tháng này" : "1,180 sent this month",
    },
    {
      key: "tuition",
      title: vi ? "Nhắc học phí" : "Tuition reminders",
      desc: vi ? "Nhắc trước hạn 3 ngày, nhắc lại sau 7 ngày quá hạn" : "Remind 3 days before invoice due date, follow up after 7 days overdue",
      stat: vi ? "96 tin tháng này" : "96 sent this month",
    },
    {
      key: "risk",
      title: vi ? "Cảnh báo rủi ro AI" : "AI risk escalation",
      desc: vi ? "Báo GV chủ nhiệm khi học viên bị gắn cờ rủi ro cao" : "Alert homeroom teacher when a student is flagged High risk",
      stat: vi ? "11 tin tháng này" : "11 sent this month",
    },
  ];

  const openAdd = () =>
    openModal({ mode: "add", kind: "zalo" }, { name: "", token: "", chatId: "", status: "Connected" });

  const openEdit = (z: ZaloLink) =>
    openModal(
      { mode: "edit", kind: "zalo", id: z.id },
      { name: z.name, token: z.token, chatId: z.chatId, status: z.status }
    );

  const statusClass = (st: string) =>
    st === "Connected" ? "pill-success" : st === "Pending" ? "pill-warn" : "pill-neutral";

  return (
    <Page>
      <PageHeader
        title="Zalo Bot"
        subtitle={t.zaloSub}
        actions={
          <>
            <button className="btn">
              <Settings size={14} strokeWidth={2} color="var(--text-2)" />
              {t.botSettings}
            </button>
            <button className="btn-primary">
              <Plus size={14} strokeWidth={2.2} />
              {t.sendBroadcast}
            </button>
          </>
        }
      />

      <div data-stagger="true" className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {kpis.map((k) => (
          <div key={k.label} className="card" style={{ padding: 20 }}>
            <div style={{ color: "var(--text-2)", fontSize: 13, fontWeight: 500 }}>{k.label}</div>
            <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 10 }}>{k.value}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 4 }}>{k.note}</div>
          </div>
        ))}
      </div>

      <div className="card tblc" style={{ overflow: "hidden" }}>
        <div style={{ padding: "18px 24px 14px" }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{t.autoTitle}</div>
          <div style={{ color: "var(--text-2)", fontSize: 13, marginTop: 2 }}>{t.autoSub}</div>
        </div>
        {autos.map((a) => (
          <div
            key={a.key}
            style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 24px",
              borderTop: "1px solid var(--hairline)",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>{a.title}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-2)", marginTop: 1 }}>{a.desc}</div>
            </div>
            <span style={{ fontSize: 12, color: "var(--text-3)", whiteSpace: "nowrap" }}>{a.stat}</span>
            <button
              className={"toggle " + (zaloAuto[a.key] ? "on" : "")}
              onClick={() => toggleAuto(a.key)}
              aria-label={"Toggle " + a.title}
            >
              <span className="knob" />
            </button>
          </div>
        ))}
      </div>

      <div className="card tblc" style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px 14px" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{t.connTitle}</div>
            <div style={{ color: "var(--text-2)", fontSize: 13, marginTop: 2 }}>{t.connSub}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="btn" style={{ padding: "6px 12px", fontSize: 12.5 }} onClick={openAdd}>
              <Plus size={13} strokeWidth={2.2} color="var(--text-2)" />
              {t.addLink}
            </button>
            <a href="#" style={{ fontSize: 13, fontWeight: 500 }}>{t.viewAllZalo}</a>
          </div>
        </div>
        <div className="table-head trow" style={{ gridTemplateColumns: GRID }}>
          <span>{t.colStudent}</span>
          <span>{t.colToken}</span>
          <span>{t.colChatId}</span>
          <span>{t.colStatus}</span>
          <span>{t.colLastMsg}</span>
          <span />
        </div>
        {zalo.map((z, i) => (
          <div
            key={z.id}
            className="list-row trow"
            style={{ gridTemplateColumns: GRID, padding: "11px 24px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <Avatar name={z.name} index={i} />
              <div>
                <div style={{ fontWeight: 500 }}>{z.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-2)" }}>{z.code}</div>
              </div>
            </div>
            <span className="mono truncate-1" style={{ color: "var(--body-c)", fontSize: 12.5 }}>
              {z.token || "—"}
            </span>
            <span className="mono" style={{ color: "var(--body-c)", fontSize: 12.5 }}>
              {z.chatId || "—"}
            </span>
            <span>
              <span className={"pill " + statusClass(z.status)}>{zaloStatusLabels[lang][z.status]}</span>
            </span>
            <span className="truncate-1" style={{ color: "var(--text-2)", fontSize: 12.5 }}>{z.lastMsg}</span>
            <button className="ghost-icon-btn" title={t.editAction} onClick={() => openEdit(z)}>
              <Pencil size={15} strokeWidth={2} color="var(--text-3)" />
            </button>
          </div>
        ))}
      </div>
    </Page>
  );
}
