"use client";

import { Trash2, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts } from "@/lib/i18n";

interface ModalShellProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  cta: string;
  canSave: boolean;
  showDelete: boolean;
  onSave: () => void;
  width?: number;
  children: React.ReactNode;
}

/** Shared add/edit modal chrome: overlay, sticky header, scrollable body, sticky footer. */
export default function ModalShell({
  icon, title, subtitle, cta, canSave, showDelete, onSave, width = 540, children,
}: ModalShellProps) {
  const lang = useApp((s) => s.lang);
  const closeModal = useApp((s) => s.closeModal);
  const askDelete = useApp((s) => s.askDelete);
  const t = dicts[lang];

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
          position: "relative", width: "100%", maxWidth: width, maxHeight: "calc(100vh - 48px)",
          display: "flex", flexDirection: "column", background: "var(--surface)",
          border: "1px solid var(--border)", borderRadius: 16, boxShadow: "var(--modal-shadow)",
          animation: "fadeUp 0.24s cubic-bezier(0.16,1,0.3,1) both", overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex", alignItems: "flex-start", gap: 12, padding: "22px 24px 16px",
            borderBottom: "1px solid var(--hairline)", flexShrink: 0,
          }}
        >
          <span
            style={{
              width: 38, height: 38, minWidth: 38, borderRadius: 10, background: "var(--accent-tint)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {icon}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>{title}</div>
            <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 2 }}>{subtitle}</div>
          </div>
          <button className="ghost-icon-btn" onClick={closeModal} style={{ margin: "-4px -4px 0 0" }}>
            <X size={17} strokeWidth={2} color="var(--text-2)" />
          </button>
        </div>

        <div
          style={{
            padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16,
            overflowY: "auto", minHeight: 0,
          }}
        >
          {children}
        </div>

        <div
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "16px 24px",
            borderTop: "1px solid var(--hairline)", background: "var(--sidebar)", flexShrink: 0,
          }}
        >
          {showDelete && (
            <button className="btn-danger-ghost" onClick={askDelete}>
              <Trash2 size={14} strokeWidth={2} />
              {t.deleteWord}
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button className="btn" style={{ padding: "9px 16px" }} onClick={closeModal}>
            {t.cancel}
          </button>
          <button
            className="btn-primary"
            style={{ padding: "9px 18px", opacity: canSave ? 1 : 0.5 }}
            onClick={onSave}
          >
            {cta}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

export function Choices({
  options,
  wrap = false,
}: {
  options: { label: string; on: boolean; onPick: () => void; attStyle?: boolean; noFlex?: boolean }[];
  wrap?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: wrap ? "wrap" : undefined }}>
      {options.map((o, i) => (
        <button
          key={i}
          onClick={o.onPick}
          className={"seg " + (o.on ? (o.attStyle ? "att-on" : "on") : "")}
          style={o.noFlex ? { flex: "0 0 auto" } : undefined}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
