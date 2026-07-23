"use client";

import { initials } from "@/lib/derived";
import { avatarTint } from "@/lib/subjects";

/** Page header row: title + subtitle on the left, action buttons on the right. */
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>{title}</h1>
        {subtitle && <p style={{ margin: "4px 0 0", color: "var(--text-2)" }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{actions}</div>}
    </div>
  );
}

export function Avatar({ name, index, max = 2 }: { name: string; index: number; max?: number }) {
  return <span className={"avatar " + avatarTint(index)}>{initials(name, max)}</span>;
}

/** Page content wrapper: centered column with the standard fade-up entrance. */
export function Page({
  children,
  maxWidth = 1200,
  gap = 20,
}: {
  children: React.ReactNode;
  maxWidth?: number;
  gap?: number;
}) {
  return (
    <div
      className="fade-up"
      style={{ maxWidth, margin: "0 auto", display: "flex", flexDirection: "column", gap }}
    >
      {children}
    </div>
  );
}
