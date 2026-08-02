"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot, BookOpen, Calendar, ChevronsUpDown, CreditCard, House, Mail, Settings, Sparkles,
  UserRound, Users,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts, navLabels } from "@/lib/i18n";

const workspaceNav = [
  { key: "about", href: "/about", Icon: UserRound },
  { key: "dashboard", href: "/dashboard", Icon: House },
  { key: "students", href: "/students", Icon: Users, badgeKey: "students" as const },
  { key: "courses", href: "/courses", Icon: BookOpen, badgeKey: "courses" as const },
  // { key: "insights", href: "/insights", Icon: Sparkles }, // tạm ẩn Phân tích AI
  { key: "schedule", href: "/schedule", Icon: Calendar },
];

const manageNav = [
  { key: "zalobot", href: "/zalobot", Icon: Bot },
  { key: "billing", href: "/tuition", Icon: CreditCard },
  { key: "messages", href: "/messages", Icon: Mail },
  { key: "settings", href: "/settings", Icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const lang = useApp((s) => s.lang);
  const menuOpen = useApp((s) => s.menuOpen);
  const setMenuOpen = useApp((s) => s.setMenuOpen);
  const studentCount = useApp((s) => s.students.length);
  const courseCount = useApp((s) => s.courses.length);
  const t = dicts[lang];
  const labels = navLabels[lang];
  const badgeFor = (k?: "students" | "courses") =>
    k === "students" ? studentCount : k === "courses" ? courseCount : 0;

  const navItem = (n: { key: string; href: string; Icon: typeof House; badgeKey?: "students" | "courses" }) => {
    const active = pathname === n.href || (n.href === "/dashboard" && pathname === "/");
    const badge = badgeFor(n.badgeKey);
    return (
      <Link
        key={n.key}
        href={n.href}
        onClick={() => setMenuOpen(false)}
        className={"nav-item " + (active ? "active" : "")}
        style={{ textDecoration: "none" }}
      >
        <span style={{ display: "flex", width: 16 }}>
          <n.Icon size={15} strokeWidth={2} color={active ? "var(--accent)" : "var(--muted-ic)"} />
        </span>
        <span style={{ flex: 1, textAlign: "left", color: active ? "var(--accent)" : undefined }}>
          {labels[n.key]}
        </span>
        {n.badgeKey && badge > 0 && (
          <span
            style={{
              background: "var(--badge)", color: "var(--text-2)", fontSize: 11,
              fontWeight: 600, padding: "1px 7px", borderRadius: 99,
            }}
          >
            {badge.toLocaleString("vi-VN")}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {menuOpen && (
        <div
          className="sb-backdrop"
          onClick={() => setMenuOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 55, background: "rgba(28,25,23,0.4)" }}
        />
      )}
      <aside
        className={"sidebar" + (menuOpen ? " open" : "")}
        style={{
          width: 248, minWidth: 248, background: "var(--sidebar)",
          borderRight: "1px solid var(--border)", color: "var(--body-c)",
          display: "flex", flexDirection: "column", padding: "16px 12px",
          overflowY: "auto", minHeight: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px 20px" }}>
          <Image
            src="/uploads/Logo.jpeg"
            alt="AIhoclaptrinh logo"
            width={34}
            height={34}
            style={{ borderRadius: 10, objectFit: "cover", boxShadow: "0 2px 6px rgba(28,25,23,0.18)" }}
          />
          <div>
            <div style={{ color: "var(--text)", fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em" }}>
              AIhoclaptrinh
            </div>
            <div style={{ fontSize: 11, color: "var(--muted-ic)" }}>{t.tagline}</div>
          </div>
        </div>

        <div style={sectionHeaderStyle}>{t.wsHeader}</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {workspaceNav.map(navItem)}
        </nav>

        <div style={{ ...sectionHeaderStyle, padding: "20px 10px 6px" }}>{t.manageHeader}</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {manageNav.map(navItem)}
        </nav>

        <div style={{ flex: 1, minHeight: 16 }} />

        <div
          style={{
            margin: "0 4px 8px", background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 12, padding: 14, flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Sparkles size={14} strokeWidth={2} color="var(--body-c)" />
            <span style={{ color: "var(--text)", fontWeight: 600, fontSize: 12.5 }}>AI credits</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--body-c)", marginBottom: 10 }}>{t.creditsUsed}</div>
          <div style={{ height: 5, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
            <div
              style={{
                width: "43%", height: "100%", borderRadius: 99,
                background: "linear-gradient(90deg,#6C6AF0,#5E5CE6)", animation: "growW 0.9s ease both",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex", alignItems: "center", gap: 10, padding: 10,
            borderTop: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              width: 32, height: 32, borderRadius: 99, background: "var(--border)",
              color: "var(--text)", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 12, fontWeight: 600,
            }}
          >
            TN
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "var(--text)", fontSize: 13, fontWeight: 500 }}>Trương Tấn Nghĩa</div>
            <div style={{ fontSize: 11.5, color: "var(--muted-ic)" }}>{t.adminRole}</div>
          </div>
          <ChevronsUpDown size={15} strokeWidth={2} color="var(--muted-ic)" />
        </div>
      </aside>
    </>
  );
}

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--head-c)",
  padding: "8px 10px 6px",
};
