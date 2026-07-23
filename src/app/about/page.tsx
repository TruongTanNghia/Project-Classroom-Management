"use client";

import Image from "next/image";
import { Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts } from "@/lib/i18n";
import { Page } from "@/components/ui/bits";

const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  boxShadow: "var(--card-shadow)",
};

export default function AboutPage() {
  const lang = useApp((s) => s.lang);
  const t = dicts[lang];

  const chips = [
    "AI Agents", "Automation AI", "Chatbot & LLM", t.chip4, t.chipNlp, t.chipCv,
    "Machine Learning", "Deep Learning", "Reinforcement Learning",
  ];
  const stats = [
    { value: "8+", label: t.stat1 },
    { value: "120+", label: t.stat2 },
    { value: "96%", label: t.stat3 },
  ];

  return (
    <Page maxWidth={1200} gap={24}>
      <div
        className="g2a"
        style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 24, alignItems: "stretch" }}
      >
        <div
          style={{
            ...cardStyle, padding: 36, display: "flex", flexDirection: "column",
            gap: 18, justifyContent: "center",
          }}
        >
          <span
            className="pill pill-accent"
            style={{ alignSelf: "flex-start", gap: 7, fontWeight: 600, padding: "5px 12px" }}
          >
            <Sparkles size={12} strokeWidth={2} style={{ marginRight: 7 }} />
            {t.founderTag}
          </span>
          <div>
            <h1 style={{ margin: 0, fontSize: 34, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15 }}>
              Trương Tấn Nghĩa
            </h1>
            <p style={{ margin: "8px 0 0", fontSize: 15, color: "var(--text-2)", lineHeight: 1.65 }}>
              {t.aboutBio}
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {chips.map((c) => (
              <span
                key={c}
                style={{
                  background: "var(--sidebar)", border: "1px solid var(--border)", borderRadius: 99,
                  padding: "5px 12px", fontSize: 12.5, color: "var(--body-c)", whiteSpace: "nowrap",
                }}
              >
                {c}
              </span>
            ))}
          </div>
          <div
            style={{
              display: "flex", flexDirection: "column", gap: 10,
              borderTop: "1px solid var(--hairline)", paddingTop: 16,
            }}
          >
            <div style={contactRowStyle}>
              <Mail size={15} strokeWidth={2} color="var(--text-3)" />
              aihoclaptrinh@gmail.com
            </div>
            <div style={contactRowStyle}>
              <Phone size={15} strokeWidth={2} color="var(--text-3)" />
              0862 554 248 · Zalo
            </div>
            <div style={contactRowStyle}>
              <MapPin size={15} strokeWidth={2} color="var(--text-3)" />
              TP. Hồ Chí Minh, Việt Nam
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button className="btn-primary" style={{ padding: "9px 16px" }}>{t.contactMe}</button>
            <button className="btn" style={{ padding: "9px 16px" }}>{t.downloadCv}</button>
          </div>
        </div>

        <div
          style={{
            ...cardStyle, overflow: "hidden", display: "flex", flexDirection: "column", padding: 14,
          }}
        >
          <div style={{ position: "relative", flex: 1, minHeight: 440, borderRadius: 10, overflow: "hidden" }}>
            <Image
              src="/uploads/founder.png"
              alt="Trương Tấn Nghĩa tại Đà Nẵng"
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              style={{ objectFit: "cover", objectPosition: "center 45%", filter: "contrast(1.04) saturate(1.08)" }}
              priority
            />
            <div
              style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, transparent 55%, rgba(28,25,23,0.55) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute", left: 16, right: 16, bottom: 14, display: "flex",
                alignItems: "flex-end", justifyContent: "space-between", gap: 12,
              }}
            >
              <div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 14.5, textShadow: "0 1px 3px rgba(0,0,0,0.35)" }}>
                  Trương Tấn Nghĩa
                </div>
                <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 2 }}>
                  Founder · AIhoclaptrinh
                </div>
              </div>
              <span
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.92)", color: "#44403C", fontSize: 11.5,
                  fontWeight: 500, padding: "5px 11px", borderRadius: 99, whiteSpace: "nowrap",
                }}
              >
                <MapPin size={12} strokeWidth={2} color="#78716C" />
                Đà Nẵng, Việt Nam
              </span>
            </div>
          </div>
        </div>
      </div>

      <div data-stagger="true" className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {stats.map((s) => (
          <div key={s.value} style={{ ...cardStyle, padding: 20 }}>
            <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </Page>
  );
}

const contactRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontSize: 13.5,
  color: "var(--body-c)",
};
