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
  const students = useApp((s) => s.students);
  const zaloAuto = useApp((s) => s.zaloAuto);
  const toggleAuto = useApp((s) => s.toggleAuto);
  const openModal = useApp((s) => s.openModal);
  const msgStats = useApp((s) => s.msgStats);
  const t = dicts[lang];
  const vi = lang !== "en";

  // KPI thật: đã liên kết = có chat_id & không "Not linked"; hủy nhận = "Not linked"
  const linked = zalo.filter((z) => z.chatId && z.status !== "Not linked").length;
  const optOut = zalo.filter((z) => z.status === "Not linked").length;
  const total = students.length || zalo.length;
  const rate = linked && total ? Math.round((linked / total) * 1000) / 10 : 0;
  // Số tin nhắn: từ message_log tháng này (msgStats). Chưa migration → hiện "—".
  const monthTotal = msgStats ? msgStats.total : null;
  const delivery = msgStats && msgStats.total ? Math.round((msgStats.ok / msgStats.total) * 1000) / 10 : null;
  const kindCount = (k: string) => (msgStats ? msgStats.byKind[k] || 0 : null);
  const statText = (n: number | null) =>
    n == null ? (vi ? "chờ chạy" : "pending") : n + (vi ? " tin tháng này" : " sent this month");

  const kpis = [
    { label: vi ? "Gia đình đã liên kết" : "Linked families", value: String(linked), note: (vi ? "trên " : "of ") + total + (vi ? " học viên · " : " students · ") + rate + "%" },
    { label: vi ? "Tin nhắn tháng này" : "Messages this month", value: monthTotal == null ? "—" : String(monthTotal), note: vi ? "tự động + thủ công" : "automated + manual" },
    { label: vi ? "Tỷ lệ gửi thành công" : "Delivery rate", value: delivery == null ? "—" : delivery + "%", note: vi ? "gửi tới bot thành công" : "delivered to bot" },
    { label: vi ? "Hủy nhận tin" : "Opt-outs", value: String(optOut), note: vi ? "chưa liên kết Zalo" : "not linked" },
  ];

  const autos: { key: keyof ZaloAuto; logKind: string; title: string; desc: string }[] = [
    {
      key: "attend", logKind: "attendance",
      title: vi ? "Cảnh báo chuyên cần" : "Attendance alerts",
      desc: vi ? "Báo phụ huynh qua Zalo ~15 phút sau khi điểm danh vắng" : "Notify parents on Zalo ~15 min after an unmarked absence",
    },
    {
      key: "grades", logKind: "grades",
      title: vi ? "Báo cáo điểm hàng tuần" : "Weekly grade reports",
      desc: vi ? "Gửi tóm tắt điểm cho từng gia đình thứ Sáu 17:00 hằng tuần" : "Send each family a grade summary every Friday at 5:00 PM",
    },
    {
      key: "tuition", logKind: "tuition",
      title: vi ? "Nhắc học phí" : "Tuition reminders",
      desc: vi ? "Tự nhắc khi học viên đã học đủ số buổi của kỳ" : "Auto-remind when a student completes their paid cycle",
    },
    {
      key: "risk", logKind: "risk",
      title: vi ? "Cảnh báo rủi ro AI" : "AI risk escalation",
      desc: vi ? "Báo phụ huynh khi học viên bị gắn cờ rủi ro cao" : "Alert parents when a student is flagged at risk",
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
            <span style={{ fontSize: 12, color: "var(--text-3)", whiteSpace: "nowrap" }}>{statText(kindCount(a.logKind))}</span>
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
