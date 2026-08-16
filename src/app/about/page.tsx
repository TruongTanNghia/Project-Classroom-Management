"use client";

import Image from "next/image";
import {
  ArrowRight, Award, BadgeCheck, Bot, Building2, GraduationCap, HeartHandshake,
  Mail, MapPin, MessagesSquare, Phone, Rocket, Sparkles, Workflow,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts } from "@/lib/i18n";
import { Page } from "@/components/ui/bits";

export default function AboutPage() {
  const lang = useApp((s) => s.lang);
  const t = dicts[lang];
  const vi = lang !== "en";

  const chips = [
    "AI Agents", "Automation AI", "Chatbot & LLM", t.chip4, t.chipNlp, t.chipCv,
    "Machine Learning", "Deep Learning", "Reinforcement Learning",
  ];

  const stats = [
    { value: "8+", label: t.stat1, Icon: Award },
    { value: "120+", label: t.stat2, Icon: Building2 },
    { value: "96%", label: t.stat3, Icon: HeartHandshake },
  ];

  const skills = [
    { Icon: Bot, title: "AI Agents", desc: vi ? "Xây dựng agent tự vận hành, thay con người làm việc lặp lại." : "Autonomous agents that run the repetitive work for you." },
    { Icon: Workflow, title: "Automation AI", desc: vi ? "Tự động hoá quy trình end-to-end, tiết kiệm hàng giờ mỗi ngày." : "End-to-end automation that saves hours every day." },
    { Icon: MessagesSquare, title: "Chatbot & LLM", desc: vi ? "Chatbot thông minh, tích hợp mô hình ngôn ngữ lớn." : "Smart chatbots powered by large language models." },
    { Icon: GraduationCap, title: vi ? "Đào tạo AI" : "AI Training", desc: vi ? "Kèm học viên ứng dụng AI thực chiến, học là làm được." : "Hands-on coaching that turns learners into builders." },
  ];

  return (
    <Page maxWidth={1220} gap={22}>
      {/* ============ HERO ============ */}
      <section className="abt-hero fade-up" style={{ padding: "clamp(24px, 4vw, 44px)" }}>
        <div className="abt-aurora a1" />
        <div className="abt-aurora a2" />
        <div className="abt-aurora a3" />

        <div
          className="g2a"
          style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1.08fr 0.92fr", gap: 34, alignItems: "center" }}
        >
          {/* Left — intro */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span
              className="pill"
              style={{
                alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 7,
                background: "var(--accent-tint)", color: "var(--accent)", fontWeight: 600,
                padding: "6px 13px", border: "1px solid var(--accent-border)",
              }}
            >
              <Sparkles size={13} strokeWidth={2.2} />
              {t.founderTag}
            </span>

            <div>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 6 }}>
                {vi ? "Xin chào, tôi là" : "Hi, I am"}
              </div>
              <h1
                className="abt-display abt-grad"
                style={{ margin: 0, fontSize: "clamp(38px, 5.2vw, 58px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05 }}
              >
                Trương Tấn Nghĩa
              </h1>
              <p style={{ margin: "16px 0 0", fontSize: 15.5, color: "var(--text-2)", lineHeight: 1.7, maxWidth: 520 }}>
                {t.aboutBio}
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {chips.map((c) => (
                <span key={c} className="abt-chip">{c}</span>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 18, borderTop: "1px solid var(--hairline)", paddingTop: 18, marginTop: 2 }}>
              <span style={contactRow}><Mail size={15} strokeWidth={2} color="var(--accent)" /> aihoclaptrinh@gmail.com</span>
              <span style={contactRow}><Phone size={15} strokeWidth={2} color="var(--accent)" /> 0862 554 248 · Zalo</span>
              <span style={contactRow}><MapPin size={15} strokeWidth={2} color="var(--accent)" /> {vi ? "TP. Hồ Chí Minh" : "Ho Chi Minh City"}</span>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
              <a href="mailto:aihoclaptrinh@gmail.com" className="btn-primary" style={{ padding: "11px 20px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                {t.contactMe} <ArrowRight size={15} strokeWidth={2.4} />
              </a>
              <button className="btn" style={{ padding: "11px 20px" }}>{t.downloadCv}</button>
            </div>
          </div>

          {/* Right — portrait */}
          <div style={{ position: "relative", padding: "6px 6px 6px 2px" }}>
            <div className="abt-portrait" style={{ position: "relative", aspectRatio: "4 / 5", width: "100%" }}>
              <Image
                src="/uploads/founder.png"
                alt="Trương Tấn Nghĩa"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                style={{ objectFit: "cover", objectPosition: "center 42%", filter: "contrast(1.05) saturate(1.08)" }}
                priority
              />
              <div className="abt-shine" />
              <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, transparent 52%, rgba(20,18,16,0.62) 100%)" }} />
              <div style={{ position: "absolute", zIndex: 4, left: 16, right: 16, bottom: 14, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div className="abt-display" style={{ color: "#fff", fontWeight: 700, fontSize: 16, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
                    Trương Tấn Nghĩa
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.88)", fontSize: 12, marginTop: 2 }}>Founder · AIhoclaptrinh</div>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.94)", color: "#44403C", fontSize: 11.5, fontWeight: 600, padding: "5px 10px", borderRadius: 99, whiteSpace: "nowrap" }}>
                  <MapPin size={12} strokeWidth={2.2} color="#78716C" /> Đà Nẵng
                </span>
              </div>
            </div>

            {/* Floating badge */}
            <div
              className="abt-float"
              style={{
                position: "absolute", zIndex: 5, top: 18, right: -6, display: "flex", alignItems: "center", gap: 9,
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 13,
                padding: "9px 13px", boxShadow: "0 12px 30px rgba(28,25,23,0.18)",
              }}
            >
              <span className="abt-iconbox" style={{ width: 32, height: 32, borderRadius: 9 }}>
                <BadgeCheck size={17} strokeWidth={2.2} />
              </span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text)" }}>{vi ? "Chuyên gia AI" : "AI Expert"}</div>
                <div style={{ fontSize: 11, color: "var(--text-3)" }}>{vi ? "Đã kiểm chứng" : "Verified"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {stats.map((s, i) => (
          <div key={s.value} className="abt-card fade-up" style={{ padding: 22, animationDelay: `${0.05 + i * 0.07}s` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="abt-iconbox"><s.Icon size={20} strokeWidth={2} /></span>
            </div>
            <div className="abt-display abt-grad" style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", marginTop: 14, lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 6, lineHeight: 1.5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ============ SKILLS ============ */}
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "6px 2px 14px" }}>
          <h2 className="abt-display" style={{ margin: 0, fontSize: 21, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)" }}>
            {vi ? "Thế mạnh" : "What I do"}
          </h2>
          <span style={{ fontSize: 13, color: "var(--text-3)" }}>{vi ? "làm mọi thứ về AI" : "everything AI"}</span>
        </div>
        <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {skills.map((sk, i) => (
            <div key={sk.title} className="abt-card fade-up" style={{ padding: 22, animationDelay: `${0.05 + i * 0.06}s` }}>
              <span className="abt-iconbox"><sk.Icon size={20} strokeWidth={2} /></span>
              <div className="abt-display" style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginTop: 14 }}>{sk.title}</div>
              <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 6, lineHeight: 1.6 }}>{sk.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ MISSION ============ */}
      <section className="abt-mission fade-up" style={{ padding: "clamp(24px, 3.5vw, 38px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, maxWidth: 720 }}>
            <span className="abt-iconbox" style={{ width: 48, height: 48, borderRadius: 14 }}>
              <Rocket size={24} strokeWidth={2} />
            </span>
            <div>
              <div className="abt-display" style={{ fontSize: 19, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>
                {vi ? "Sứ mệnh" : "The mission"}
              </div>
              <p style={{ margin: "6px 0 0", fontSize: 15, color: "var(--text-2)", lineHeight: 1.7 }}>
                {vi
                  ? "Đưa AI đến gần mọi người — để ai cũng có thể ứng dụng AI vào công việc và học tập, nếu được kèm đúng cách, đúng lúc."
                  : "Bringing AI to everyone — so anyone can apply it to their work and learning, with the right guidance at the right time."}
              </p>
            </div>
          </div>
          <a href="mailto:aihoclaptrinh@gmail.com" className="btn-primary" style={{ padding: "11px 20px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
            {vi ? "Hợp tác cùng tôi" : "Work with me"} <ArrowRight size={15} strokeWidth={2.4} />
          </a>
        </div>
      </section>
    </Page>
  );
}

const contactRow: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13.5,
  color: "var(--body-c)",
};
