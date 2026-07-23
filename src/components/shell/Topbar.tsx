"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, Moon, Plus, Search, Sun } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts, screenTitles } from "@/lib/i18n";
import { screenFromPath } from "./screen";

export default function Topbar() {
  const pathname = usePathname();
  const lang = useApp((s) => s.lang);
  const dark = useApp((s) => s.dark);
  const setLang = useApp((s) => s.setLang);
  const toggleDark = useApp((s) => s.toggleDark);
  const setMenuOpen = useApp((s) => s.setMenuOpen);
  const menuOpen = useApp((s) => s.menuOpen);
  const t = dicts[lang];
  const title = screenTitles[lang][screenFromPath(pathname)] || screenTitles[lang].dashboard;

  const langBtn = (active: boolean): React.CSSProperties => ({
    border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 11.5,
    fontWeight: 600, padding: "5px 9px", borderRadius: 6,
    background: active ? "var(--seg-active-bg)" : "transparent",
    color: active ? "var(--text)" : "var(--text-3)",
    boxShadow: active ? "0 1px 2px rgba(16,24,40,0.08)" : "none",
  });

  return (
    <header
      className="topbar-pad"
      style={{
        height: 60, minHeight: 60, background: "var(--surface)",
        borderBottom: "1px solid var(--border)", display: "flex",
        alignItems: "center", gap: 16, padding: "0 24px",
      }}
    >
      <button
        className="hamburger icon-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ display: "none" }}
        aria-label="Menu"
      >
        <Menu size={16} strokeWidth={2} color="var(--body-c)" />
      </button>
      <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>{title}</div>
      <div style={{ flex: 1 }} />
      <div
        className="searchbox"
        style={{
          display: "flex", alignItems: "center", gap: 8, background: "var(--sidebar)",
          border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px", width: 280,
        }}
      >
        <Search size={14} strokeWidth={2} color="var(--text-3)" />
        <input
          placeholder={t.search}
          style={{
            border: "none", outline: "none", background: "transparent",
            fontFamily: "inherit", fontSize: 13, flex: 1, color: "var(--text)",
          }}
        />
        <span
          style={{
            fontSize: 11, color: "var(--text-3)", border: "1px solid var(--border)",
            borderRadius: 6, padding: "1px 5px", background: "var(--surface)",
          }}
        >
          ⌘K
        </span>
      </div>
      <div
        style={{
          display: "flex", gap: 2, background: "var(--sidebar)",
          border: "1px solid var(--border)", borderRadius: 8, padding: 3,
        }}
      >
        <button onClick={() => setLang("vi")} style={langBtn(lang === "vi")}>VI</button>
        <button onClick={() => setLang("en")} style={langBtn(lang === "en")}>EN</button>
      </div>
      <button className="icon-btn" onClick={toggleDark} aria-label="Toggle theme">
        {dark ? (
          <Sun size={15} strokeWidth={2} color="var(--text-2)" />
        ) : (
          <Moon size={15} strokeWidth={2} color="var(--text-2)" />
        )}
      </button>
      <button className="icon-btn" style={{ position: "relative" }} aria-label="Notifications">
        <Bell size={16} strokeWidth={2} color="var(--text-2)" />
        <span
          style={{
            position: "absolute", top: 7, right: 8, width: 7, height: 7, borderRadius: 99,
            background: "#EF4444", border: "1.5px solid var(--surface)",
            animation: "pulseDot 2s infinite",
          }}
        />
      </button>
      <button className="btn-primary" style={{ padding: "9px 14px" }}>
        <Plus size={14} strokeWidth={2.2} />
        {t.newBtn}
      </button>
    </header>
  );
}
