"use client";

import { Pencil, Plus } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts } from "@/lib/i18n";
import type { Thread } from "@/lib/types";
import { Avatar, Page, PageHeader } from "@/components/ui/bits";

export default function MessagesPage() {
  const lang = useApp((s) => s.lang);
  const threads = useApp((s) => s.threads);
  const openModal = useApp((s) => s.openModal);
  const t = dicts[lang];

  const openAdd = () =>
    openModal({ mode: "add", kind: "thread" }, { name: "", subject: "", content: "" });

  const openEdit = (th: Thread) =>
    openModal(
      { mode: "edit", kind: "thread", id: th.id },
      { name: th.from, subject: th.subject, content: th.preview }
    );

  return (
    <Page maxWidth={1000}>
      <PageHeader
        title={t.messagesTitle}
        subtitle={t.messagesSub}
        actions={
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={14} strokeWidth={2.2} />
            {t.compose}
          </button>
        }
      />

      <div className="card tblc" style={{ overflow: "hidden" }}>
        {threads.map((th, i) => (
          <div
            key={th.id}
            className="hover-row"
            style={{
              display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 20px",
              borderBottom: "1px solid var(--hairline)",
            }}
          >
            <Avatar name={th.from} index={i} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontWeight: th.unread ? 600 : 500, fontSize: 13.5 }}>{th.from}</span>
                <span style={{ fontSize: 11.5, color: "var(--text-3)" }}>{th.role}</span>
                <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--text-3)", whiteSpace: "nowrap" }}>
                  {th.time}
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginTop: 2 }}>
                {th.subject}
              </div>
              <div className="truncate-1" style={{ fontSize: 12.5, color: "var(--text-2)", marginTop: 2 }}>
                {th.preview}
              </div>
            </div>
            {th.unread && (
              <span
                style={{
                  width: 8, height: 8, minWidth: 8, borderRadius: 99,
                  background: "var(--accent-strong)", marginTop: 6,
                }}
              />
            )}
            <button
              className="ghost-icon-btn"
              style={{ alignSelf: "flex-start" }}
              onClick={() => openEdit(th)}
            >
              <Pencil size={14} strokeWidth={2} color="var(--text-3)" />
            </button>
          </div>
        ))}
      </div>
    </Page>
  );
}
