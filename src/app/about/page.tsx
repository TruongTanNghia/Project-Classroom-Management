"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight, Award, BadgeCheck, BarChart3, BookOpen, Bot, Building2, Camera, GraduationCap,
  HeartHandshake, Mail, MapPin, Megaphone, MessagesSquare, Phone, PlayCircle, Quote, Rocket,
  ShoppingBag, Sparkles, Star, Workflow,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts } from "@/lib/i18n";
import { Page } from "@/components/ui/bits";

/* ---------- tương tác ---------- */
const spot3d = (max: number) => (e: React.MouseEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;
  const py = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty("--ry", `${(px * max).toFixed(2)}deg`);
  el.style.setProperty("--rx", `${(-py * max).toFixed(2)}deg`);
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
};
const reset3d = (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.setProperty("--ry", "0deg");
  e.currentTarget.style.setProperty("--rx", "0deg");
};

function useTilt(max = 11) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--ry", `${(px * max).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${(-py * max).toFixed(2)}deg`);
        el.style.setProperty("--gx", `${((px + 0.5) * 100).toFixed(1)}%`);
        el.style.setProperty("--gy", `${((py + 0.5) * 100).toFixed(1)}%`);
      });
    };
    const leave = () => { el.style.setProperty("--ry", "0deg"); el.style.setProperty("--rx", "0deg"); };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); cancelAnimationFrame(raf); };
  }, [max]);
  return ref;
}

function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={"abt-reveal" + (shown ? " in" : "")} style={{ transitionDelay: `${delay}ms`, ...style }}>{children}</div>;
}

function CountStat({ target, suffix, Icon, label }: { target: number; suffix: string; Icon: typeof Award; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const dur = 1500, start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target]);
  return (
    <div ref={ref} className="abt-card3d" onMouseMove={spot3d(7)} onMouseLeave={reset3d} style={{ padding: 24 }}>
      <span className="abt-iconbox"><Icon size={20} strokeWidth={2} /></span>
      <div className="abt-display abt-grad-anim" style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.02em", marginTop: 14, lineHeight: 1 }}>
        {val}{suffix}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 6, lineHeight: 1.5 }}>{label}</div>
    </div>
  );
}

function Heading({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <div style={{ margin: "8px 2px 18px" }}>
      <div className="abt-eyebrow">{eyebrow}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <h2 className="abt-h2">{title}</h2>
        {note && <span style={{ fontSize: 13.5, color: "var(--text-3)" }}>{note}</span>}
      </div>
    </div>
  );
}

/* Hoa văn trang trí cho ô ảnh (SVG, trắng mờ trên nền gradient) */
function TileMotif({ idx }: { idx: number }) {
  const p = { className: "abt-tile-motif", viewBox: "0 0 200 120", fill: "none" } as const;
  if (idx === 0)
    return (
      <svg {...p} preserveAspectRatio="xMidYMid slice">
        <g stroke="#fff" strokeWidth={1} opacity={0.4}>
          <line x1="26" y1="28" x2="92" y2="60" /><line x1="26" y1="92" x2="92" y2="60" />
          <line x1="92" y1="60" x2="152" y2="32" /><line x1="92" y1="60" x2="152" y2="88" />
          <line x1="152" y1="32" x2="190" y2="60" /><line x1="152" y1="88" x2="190" y2="60" />
        </g>
        <g fill="#fff" opacity={0.6}>
          <circle cx="26" cy="28" r="4" /><circle cx="26" cy="92" r="4" /><circle cx="92" cy="60" r="5.5" />
          <circle cx="152" cy="32" r="4" /><circle cx="152" cy="88" r="4" /><circle cx="190" cy="60" r="3" />
        </g>
      </svg>
    );
  if (idx === 1)
    return (
      <svg {...p} preserveAspectRatio="xMidYMid slice">
        <g stroke="#fff" opacity={0.3} strokeWidth={1.4}>
          <circle cx="168" cy="16" r="22" /><circle cx="168" cy="16" r="46" /><circle cx="168" cy="16" r="70" /><circle cx="168" cy="16" r="94" />
        </g>
      </svg>
    );
  if (idx === 2)
    return (
      <svg {...p} preserveAspectRatio="none">
        <g stroke="#fff" opacity={0.34} strokeWidth={1.6}>
          <path d="M0 42 Q50 22 100 42 T200 42" /><path d="M0 66 Q50 46 100 66 T200 66" /><path d="M0 90 Q50 70 100 90 T200 90" />
        </g>
      </svg>
    );
  if (idx === 3)
    return (
      <svg {...p} preserveAspectRatio="xMidYMid slice">
        <g fill="#fff" opacity={0.42}>
          {Array.from({ length: 7 }).flatMap((_, r) =>
            Array.from({ length: 12 }).map((__, c) => <circle key={`${r}-${c}`} cx={10 + c * 17} cy={10 + r * 17} r={1.7} />)
          )}
        </g>
      </svg>
    );
  if (idx === 4)
    return (
      <svg {...p} preserveAspectRatio="none">
        <g stroke="#fff" opacity={0.2} strokeWidth={11}>
          <line x1="-30" y1="130" x2="70" y2="-10" /><line x1="20" y1="130" x2="120" y2="-10" />
          <line x1="70" y1="130" x2="170" y2="-10" /><line x1="120" y1="130" x2="220" y2="-10" /><line x1="170" y1="130" x2="270" y2="-10" />
        </g>
      </svg>
    );
  return (
    <svg {...p} preserveAspectRatio="xMidYMid slice">
      <g stroke="#fff" opacity={0.26} strokeWidth={1.2}>
        {Array.from({ length: 6 }).flatMap((_, r) =>
          Array.from({ length: 9 }).map((__, c) => <rect key={`${r}-${c}`} x={8 + c * 22} y={8 + r * 19} width={12} height={12} rx={2.5} />)
        )}
      </g>
    </svg>
  );
}

function Tile({ from, to, Icon, label, motif, height = 128, iconSize = 46 }: {
  from: string; to: string; Icon: typeof Bot; label?: string; motif: number; height?: number; iconSize?: number;
}) {
  return (
    <div className="abt-tile" style={{ height, background: `linear-gradient(135deg, ${from}, ${to})` }}>
      <TileMotif idx={motif} />
      <Icon size={iconSize} strokeWidth={1.6} color="#fff" style={{ position: "relative", zIndex: 1, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }} />
      {label && <span className="abt-tile-label">{label}</span>}
    </div>
  );
}

export default function AboutPage() {
  const lang = useApp((s) => s.lang);
  const courses = useApp((s) => s.courses);
  const t = dicts[lang];
  const vi = lang !== "en";
  const portraitRef = useTilt(11);
  const fmtPrice = (p?: string) => {
    const n = Number(String(p ?? "").replace(/\D/g, ""));
    return n > 0 ? n.toLocaleString("vi-VN") + "₫" : (vi ? "Liên hệ" : "Contact");
  };

  const chips = ["AI Agents", "Automation AI", "Chatbot & LLM", t.chip4, t.chipNlp, t.chipCv, "Machine Learning", "Deep Learning", "Reinforcement Learning"];
  const stats = [
    { num: 8, suffix: "+", label: t.stat1, Icon: Award },
    { num: 120, suffix: "+", label: t.stat2, Icon: Building2 },
    { num: 96, suffix: "%", label: t.stat3, Icon: HeartHandshake },
  ];
  const skills = [
    { Icon: Bot, from: "#6C6AF0", to: "#8B5CF6", motif: 0, title: "AI Agents", desc: vi ? "Xây dựng agent tự vận hành, thay con người làm việc lặp lại." : "Autonomous agents that run the repetitive work for you." },
    { Icon: Workflow, from: "#1FB6B8", to: "#10A37F", motif: 4, title: "Automation AI", desc: vi ? "Tự động hoá quy trình end-to-end, tiết kiệm hàng giờ mỗi ngày." : "End-to-end automation that saves hours every day." },
    { Icon: MessagesSquare, from: "#B06BFF", to: "#6C6AF0", motif: 2, title: "Chatbot & LLM", desc: vi ? "Chatbot thông minh, tích hợp mô hình ngôn ngữ lớn." : "Smart chatbots powered by large language models." },
    { Icon: GraduationCap, from: "#FF8A5B", to: "#F5A623", motif: 1, title: vi ? "Đào tạo AI" : "AI Training", desc: vi ? "Kèm học viên ứng dụng AI thực chiến, học là làm được." : "Hands-on coaching that turns learners into builders." },
  ];
  const applications = [
    { Icon: GraduationCap, from: "#6C6AF0", to: "#1FB6B8", motif: 3, title: vi ? "Giáo dục & Đào tạo" : "Education", desc: vi ? "Trợ giảng AI, chấm bài, cá nhân hoá lộ trình học." : "AI tutors, grading, personalized learning." },
    { Icon: ShoppingBag, from: "#FF8A5B", to: "#EA4B71", motif: 2, title: vi ? "Bán hàng & Chốt đơn" : "Sales", desc: vi ? "Chatbot tư vấn, chốt đơn tự động 24/7." : "Advisor chatbots closing orders 24/7." },
    { Icon: MessagesSquare, from: "#22C1C3", to: "#3ECF8E", motif: 0, title: vi ? "Chăm sóc khách hàng" : "Customer care", desc: vi ? "Trả lời tự động, phản hồi tức thì mọi lúc." : "Instant automated replies, anytime." },
    { Icon: Megaphone, from: "#8B5CF6", to: "#E59BFF", motif: 4, title: "Marketing", desc: vi ? "Sinh nội dung, lên kế hoạch, phân tích chiến dịch." : "Content, planning, campaign analytics." },
    { Icon: Workflow, from: "#3776AB", to: "#6C6AF0", motif: 5, title: vi ? "Vận hành & Văn phòng" : "Operations", desc: vi ? "Tự động hoá quy trình, báo cáo, nhập liệu." : "Automate workflows, reports, data entry." },
    { Icon: BarChart3, from: "#10A37F", to: "#1FB6B8", motif: 1, title: vi ? "Phân tích dữ liệu" : "Data analytics", desc: vi ? "Bóc tách insight, dự báo từ dữ liệu thô." : "Extract insights & forecasts from raw data." },
  ];
  const solutions = [
    { Icon: MessagesSquare, from: "#6C6AF0", to: "#B06BFF", motif: 2, title: vi ? "Chatbot bán hàng & CSKH" : "Sales & support chatbot", desc: vi ? "Tư vấn, chốt đơn, chăm khách tự động trên Zalo & Website 24/7." : "Advise, close orders and support customers 24/7 on Zalo & Web.", tags: ["Zalo", "Website", "24/7"] },
    { Icon: Bot, from: "#1FB6B8", to: "#10A37F", motif: 0, title: vi ? "AI Agent tự động hoá" : "Automation AI agent", desc: vi ? "Agent tự nối các app, xử lý quy trình từ đầu đến cuối không cần người." : "Agents that connect apps and run full workflows hands-free.", tags: ["n8n", "API", "Workflow"] },
    { Icon: Camera, from: "#FF8A5B", to: "#EA4B71", motif: 4, title: vi ? "Thị giác máy tính" : "Computer vision", desc: vi ? "Nhận diện, đếm, cảnh báo qua camera bằng AI thời gian thực." : "Real-time detection, counting and alerts from camera feeds.", tags: ["YOLO", "OpenCV", "Realtime"] },
    { Icon: GraduationCap, from: "#8B5CF6", to: "#E59BFF", motif: 1, title: vi ? "Trợ giảng & chấm bài AI" : "AI tutor & grading", desc: vi ? "Trợ giảng ảo, chấm bài, cá nhân hoá lộ trình cho từng học viên." : "Virtual tutor, auto-grading and personalized learning paths.", tags: ["LLM", "Education", "RAG"] },
  ];
  const topics = [
    { Icon: Bot, from: "#6C6AF0", to: "#1FB6B8", motif: 0, title: vi ? "Bắt đầu với AI Agents" : "Getting started with AI Agents", tag: vi ? "Cơ bản" : "Basics" },
    { Icon: Workflow, from: "#FF8A5B", to: "#F5A623", motif: 4, title: vi ? "Automation cho người mới" : "Automation for beginners", tag: vi ? "Thực hành" : "Hands-on" },
    { Icon: Sparkles, from: "#B06BFF", to: "#6C6AF0", motif: 2, title: vi ? "LLM & nghệ thuật viết prompt" : "LLMs & the art of prompting", tag: vi ? "Nâng cao" : "Advanced" },
  ];
  const timeline = [
    { year: "2017", text: vi ? "Bắt đầu hành trình lập trình & nghiên cứu AI." : "Started the coding & AI research journey." },
    { year: "2020", text: vi ? "Đưa AI vào giảng dạy, kèm lứa học viên đầu tiên." : "Brought AI into teaching, coached the first cohort." },
    { year: "2022", text: vi ? "Sáng lập AIhoclaptrinh — nền tảng dạy & ứng dụng AI." : "Founded AIhoclaptrinh — an AI learning & automation platform." },
    { year: "2024", text: vi ? "120+ trường & trung tâm ứng dụng nền tảng." : "120+ schools & centers running on the platform." },
    { year: vi ? "Hôm nay" : "Today", text: vi ? "Xây AI agents & automation cho doanh nghiệp và lớp học." : "Building AI agents & automation for businesses and classrooms." },
  ];
  const steps = [
    { n: "01", title: vi ? "Lắng nghe & tư vấn" : "Listen & consult", desc: vi ? "Hiểu đúng bài toán, mục tiêu và ngân sách của anh/chị." : "Understand your problem, goals and budget." },
    { n: "02", title: vi ? "Xây dựng giải pháp AI" : "Build the AI solution", desc: vi ? "Thiết kế agent / automation / chatbot phù hợp thực tế." : "Design the right agent / automation / chatbot." },
    { n: "03", title: vi ? "Bàn giao & đồng hành" : "Handover & support", desc: vi ? "Hướng dẫn sử dụng và hỗ trợ vận hành lâu dài." : "Train your team and support you long-term." },
  ];
  const tech = [
    { name: "Python", c: "#3776AB" }, { name: "PyTorch", c: "#EE4C2C" }, { name: "TensorFlow", c: "#FF6F00" },
    { name: "LangChain", c: "#1C9C7C" }, { name: "OpenAI", c: "#10A37F" }, { name: "Hugging Face", c: "#FFB000" },
    { name: "n8n", c: "#EA4B71" }, { name: "Supabase", c: "#3ECF8E" }, { name: "Next.js", c: "#8B8B93" },
    { name: "OpenCV", c: "#5C3EE8" }, { name: "YOLO", c: "#00C2FF" }, { name: "Zalo API", c: "#0068FF" },
  ];
  const testimonials = [
    { name: vi ? "Chị Lan" : "Ms. Lan", role: vi ? "Chủ trung tâm" : "Center owner", av: "#6C6AF0", quote: vi ? "Thầy Nghĩa dạy dễ hiểu, làm được ngay. Automation giúp trung tâm em tiết kiệm hàng giờ mỗi ngày." : "Clear teaching, immediately applicable. Automation saves my center hours every day." },
    { name: vi ? "Anh Minh" : "Mr. Minh", role: vi ? "Chủ shop online" : "Online shop owner", av: "#22C1C3", quote: vi ? "Chatbot AI thầy xây cho shop mình chốt đơn cực tốt, khách khen phản hồi nhanh." : "The AI chatbot closes sales beautifully — customers love the fast replies." },
    { name: vi ? "Bạn Hà" : "Ha", role: vi ? "Học viên" : "Student", av: "#E59BFF", quote: vi ? "Từ mất gốc, sau khoá học em đã tự làm được AI agent cho công việc của mình." : "From zero, after the course I built my own AI agent for work." },
  ];

  return (
    <Page maxWidth={1220} gap={22}>
      {/* ============ HERO ============ */}
      <section className="abt-hero fade-up" style={{ padding: "clamp(24px, 4vw, 48px)" }}>
        <div className="abt-hero-grid" />
        <div className="abt-conic" style={{ top: "-30%", left: "-12%" }} />
        <div className="abt-aurora a1" />
        <div className="abt-aurora a2" />
        <div className="abt-aurora a3" />
        <div className="abt-orb" style={{ width: 12, height: 12, background: "var(--accent)", top: "22%", left: "46%", opacity: 0.5, animationDelay: "0s" }} />
        <div className="abt-orb" style={{ width: 8, height: 8, background: "#1FB6B8", top: "70%", left: "40%", opacity: 0.5, animationDelay: "1.5s" }} />
        <div className="abt-orb" style={{ width: 6, height: 6, background: "#E59BFF", top: "38%", left: "8%", opacity: 0.6, animationDelay: "2.5s" }} />

        <div className="g2a" style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1.08fr 0.92fr", gap: 34, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span className="pill" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent-tint)", color: "var(--accent)", fontWeight: 600, padding: "6px 13px", border: "1px solid var(--accent-border)" }}>
              <Sparkles size={13} strokeWidth={2.2} />
              {t.founderTag}
            </span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 6 }}>
                {vi ? "Xin chào, tôi là" : "Hi, I am"}
              </div>
              <h1 className="abt-display abt-grad-anim" style={{ margin: 0, fontSize: "clamp(38px, 5.2vw, 58px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
                Trương Tấn Nghĩa
              </h1>
              <p style={{ margin: "16px 0 0", fontSize: 15.5, color: "var(--text-2)", lineHeight: 1.7, maxWidth: 520 }}>{t.aboutBio}</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {chips.map((c) => <span key={c} className="abt-chip">{c}</span>)}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 18, borderTop: "1px solid var(--hairline)", paddingTop: 18, marginTop: 2 }}>
              <span style={contactRow}><Mail size={15} strokeWidth={2} color="var(--accent)" /> aihoclaptrinh@gmail.com</span>
              <span style={contactRow}><Phone size={15} strokeWidth={2} color="var(--accent)" /> 0862 554 248 · Zalo</span>
              <span style={contactRow}><MapPin size={15} strokeWidth={2} color="var(--accent)" /> {vi ? "TP. Hồ Chí Minh" : "Ho Chi Minh City"}</span>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
              <a href="mailto:aihoclaptrinh@gmail.com" className="btn-primary abt-btn-glow" style={{ padding: "12px 22px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                {t.contactMe} <ArrowRight size={15} strokeWidth={2.4} />
              </a>
              <button className="btn" style={{ padding: "12px 22px" }}>{t.downloadCv}</button>
            </div>
          </div>

          <div style={{ perspective: 1200 }}>
            <div ref={portraitRef} className="abt-tilt3d" style={{ position: "relative", width: "100%" }}>
              <div className="abt-portrait" style={{ position: "relative", aspectRatio: "4 / 5", width: "100%" }}>
                <Image src="/uploads/founder.png" alt="Trương Tấn Nghĩa" fill sizes="(max-width: 1024px) 100vw, 500px" style={{ objectFit: "cover", objectPosition: "center 42%", filter: "contrast(1.05) saturate(1.08)" }} priority />
                <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, transparent 52%, rgba(20,18,16,0.62) 100%)" }} />
                <div className="abt-sheen" />
                <div style={{ position: "absolute", zIndex: 4, left: 16, right: 16, bottom: 14, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div className="abt-display" style={{ color: "#fff", fontWeight: 700, fontSize: 16, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>Trương Tấn Nghĩa</div>
                    <div style={{ color: "rgba(255,255,255,0.88)", fontSize: 12, marginTop: 2 }}>Founder · AIhoclaptrinh</div>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.94)", color: "#44403C", fontSize: 11.5, fontWeight: 600, padding: "5px 10px", borderRadius: 99, whiteSpace: "nowrap" }}>
                    <MapPin size={12} strokeWidth={2.2} color="#78716C" /> Đà Nẵng
                  </span>
                </div>
              </div>
              <div className="abt-float abt-pop" style={{ position: "absolute", zIndex: 5, top: 16, right: -10, display: "flex", alignItems: "center", gap: 9, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 13, padding: "9px 13px", boxShadow: "0 16px 34px rgba(28,25,23,0.24)" }}>
                <span className="abt-iconbox" style={{ width: 32, height: 32, borderRadius: 9 }}><BadgeCheck size={17} strokeWidth={2.2} /></span>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text)" }}>{vi ? "Chuyên gia AI" : "AI Expert"}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>{vi ? "Đã kiểm chứng" : "Verified"}</div>
                </div>
              </div>
              <div className="abt-float abt-pop-sm" style={{ position: "absolute", zIndex: 5, bottom: 74, left: -14, display: "flex", alignItems: "center", gap: 7, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "8px 12px", boxShadow: "0 14px 30px rgba(28,25,23,0.2)", animationDelay: "1.2s" }}>
                <Sparkles size={15} strokeWidth={2.2} color="var(--accent)" />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text)" }}>AIhoclaptrinh</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <Reveal>
        <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {stats.map((s) => <CountStat key={s.label} target={s.num} suffix={s.suffix} Icon={s.Icon} label={s.label} />)}
        </div>
      </Reveal>

      {/* ============ HÀNH TRÌNH ============ */}
      <Reveal>
        <section className="card" style={{ padding: "clamp(22px, 3vw, 34px)" }}>
          <Heading eyebrow={vi ? "Hành trình" : "Journey"} title={vi ? "Chặng đường đã qua" : "The road so far"} note={vi ? "từ dòng code đầu tiên đến hôm nay" : "from the first line of code to today"} />
          <div className="abt-timeline">
            {timeline.map((tl) => (
              <div key={tl.year} className="abt-tl-item">
                <span className="abt-tl-dot" />
                <div className="abt-tl-year">{tl.year}</div>
                <div style={{ fontSize: 14.5, color: "var(--body-c)", marginTop: 3, lineHeight: 1.6 }}>{tl.text}</div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ============ THẾ MẠNH ============ */}
      <Reveal>
        <Heading eyebrow={vi ? "Chuyên môn" : "Expertise"} title={vi ? "Thế mạnh của tôi" : "What I do"} note={vi ? "làm mọi thứ về AI" : "everything AI"} />
        <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {skills.map((sk) => (
            <div key={sk.title} className="abt-card3d" onMouseMove={spot3d(8)} onMouseLeave={reset3d} style={{ padding: 12, overflow: "hidden" }}>
              <Tile from={sk.from} to={sk.to} Icon={sk.Icon} motif={sk.motif} height={116} />
              <div style={{ padding: "14px 10px 8px" }}>
                <div className="abt-display" style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{sk.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 6, lineHeight: 1.6 }}>{sk.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ============ ỨNG DỤNG THỰC TẾ ============ */}
      <Reveal>
        <Heading eyebrow={vi ? "Ứng dụng" : "Use cases"} title={vi ? "AI giúp được gì cho bạn" : "Where AI helps you"} note={vi ? "một giải pháp, nhiều lĩnh vực" : "one skillset, many fields"} />
        <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {applications.map((ap) => (
            <div key={ap.title} className="abt-card3d" onMouseMove={spot3d(7)} onMouseLeave={reset3d} style={{ padding: 12, overflow: "hidden" }}>
              <Tile from={ap.from} to={ap.to} Icon={ap.Icon} motif={ap.motif} label={ap.title} height={150} iconSize={42} />
              <div style={{ padding: "13px 10px 7px", fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.6 }}>{ap.desc}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ============ GIẢI PHÁP (PORTFOLIO) ============ */}
      <Reveal>
        <Heading eyebrow={vi ? "Sản phẩm" : "Portfolio"} title={vi ? "Giải pháp tôi xây dựng" : "Solutions I build"} note={vi ? "từ ý tưởng đến vận hành" : "from idea to production"} />
        <div className="g2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {solutions.map((so) => (
            <div key={so.title} className="abt-card3d" onMouseMove={spot3d(6)} onMouseLeave={reset3d} style={{ padding: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <Tile from={so.from} to={so.to} Icon={so.Icon} motif={so.motif} height={168} iconSize={52} />
              <div style={{ padding: "16px 8px 6px" }}>
                <div className="abt-display" style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>{so.title}</div>
                <div style={{ fontSize: 13.5, color: "var(--text-2)", marginTop: 7, lineHeight: 1.65 }}>{so.desc}</div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 13 }}>
                  {so.tags.map((tg) => (
                    <span key={tg} style={{ fontSize: 11.5, fontWeight: 600, color: "var(--accent)", background: "var(--accent-tint)", border: "1px solid var(--accent-border)", borderRadius: 99, padding: "3px 10px" }}>{tg}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ============ KHÓA HỌC NỔI BẬT ============ */}
      {courses.length > 0 && (
        <Reveal>
          <Heading eyebrow={vi ? "Đào tạo" : "Courses"} title={vi ? "Khóa học nổi bật" : "Featured courses"} note={vi ? "học là làm được" : "learn by doing"} />
          <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {courses.slice(0, 6).map((c, i) => (
              <div key={c.id} className="abt-card3d" onMouseMove={spot3d(6)} onMouseLeave={reset3d} style={{ padding: 12, overflow: "hidden" }}>
                {c.image ? (
                  <div style={{ height: 150, borderRadius: 14, backgroundImage: `url(${c.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                ) : (
                  <Tile from={["#6C6AF0", "#1FB6B8", "#FF8A5B"][i % 3]} to={["#B06BFF", "#3ECF8E", "#EA4B71"][i % 3]} Icon={BookOpen} motif={i % 6} height={150} />
                )}
                <div style={{ padding: "14px 10px 8px" }}>
                  <div className="abt-display" style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{c.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 4 }}>
                    {c.teacher}{c.totalSessions ? ` · ${c.totalSessions} ${vi ? "buổi" : "sessions"}` : ""}
                  </div>
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span className="abt-display abt-grad" style={{ fontSize: 17, fontWeight: 800 }}>{fmtPrice(c.price)}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, color: "var(--accent)" }}>
                      <PlayCircle size={15} strokeWidth={2.2} /> {vi ? "Xem" : "View"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {/* ============ CÁCH ĐỒNG HÀNH ============ */}
      <Reveal>
        <Heading eyebrow={vi ? "Quy trình" : "Process"} title={vi ? "Cách tôi đồng hành cùng bạn" : "How I work with you"} note={vi ? "đơn giản, rõ ràng" : "simple & clear"} />
        <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {steps.map((st) => (
            <div key={st.n} className="abt-card3d" onMouseMove={spot3d(8)} onMouseLeave={reset3d} style={{ padding: 24 }}>
              <span className="abt-step-num">{st.n}</span>
              <div className="abt-display" style={{ fontSize: 16.5, fontWeight: 700, color: "var(--text)", marginTop: 14 }}>{st.title}</div>
              <div style={{ fontSize: 13.5, color: "var(--text-2)", marginTop: 6, lineHeight: 1.6 }}>{st.desc}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ============ CÔNG NGHỆ ============ */}
      <Reveal>
        <section className="card" style={{ padding: "26px 0" }}>
          <div style={{ padding: "0 clamp(20px, 3vw, 30px)" }}>
            <Heading eyebrow={vi ? "Công cụ" : "Toolbox"} title={vi ? "Công nghệ tôi sử dụng" : "Tech I build with"} />
          </div>
          <div className="abt-marquee">
            <div className="abt-marquee-track">
              {[...tech, ...tech].map((tk, i) => (
                <span key={i} className="abt-tech"><span className="abt-tech-dot" style={{ background: tk.c }} />{tk.name}</span>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ============ TESTIMONIALS ============ */}
      <Reveal>
        <Heading eyebrow={vi ? "Cảm nhận" : "Testimonials"} title={vi ? "Học viên & khách hàng nói gì" : "What people say"} note={vi ? "sự tin tưởng là phần thưởng" : "trust is the reward"} />
        <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {testimonials.map((tm) => (
            <div key={tm.name} className="abt-card3d" onMouseMove={spot3d(6)} onMouseLeave={reset3d} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <Quote size={26} strokeWidth={2} color="var(--accent)" style={{ opacity: 0.5 }} />
              <div style={{ display: "flex", gap: 2 }}>
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} size={15} strokeWidth={2} fill="#F5A623" color="#F5A623" />)}
              </div>
              <p style={{ margin: 0, fontSize: 14.5, color: "var(--body-c)", lineHeight: 1.7, flex: 1 }}>“{tm.quote}”</p>
              <div style={{ display: "flex", alignItems: "center", gap: 11, borderTop: "1px solid var(--hairline)", paddingTop: 14 }}>
                <span className="abt-avatar" style={{ background: tm.av }}>{tm.name.trim().slice(-1)}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{tm.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-3)" }}>{tm.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ============ CHỦ ĐỀ CHIA SẺ ============ */}
      <Reveal>
        <Heading eyebrow={vi ? "Kiến thức" : "Learn"} title={vi ? "Chủ đề tôi hay chia sẻ" : "Topics I share"} note={vi ? "miễn phí cho cộng đồng" : "free for the community"} />
        <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {topics.map((tp) => (
            <div key={tp.title} className="abt-card3d" onMouseMove={spot3d(6)} onMouseLeave={reset3d} style={{ padding: 12, overflow: "hidden" }}>
              <div style={{ position: "relative" }}>
                <Tile from={tp.from} to={tp.to} Icon={tp.Icon} motif={tp.motif} height={140} iconSize={44} />
                <span style={{ position: "absolute", top: 10, left: 10, zIndex: 2, fontSize: 11, fontWeight: 700, color: "#fff", background: "rgba(0,0,0,0.28)", backdropFilter: "blur(3px)", borderRadius: 99, padding: "3px 10px" }}>{tp.tag}</span>
              </div>
              <div style={{ padding: "14px 10px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div className="abt-display" style={{ fontSize: 15.5, fontWeight: 700, color: "var(--text)", lineHeight: 1.35 }}>{tp.title}</div>
                <ArrowRight size={17} strokeWidth={2.2} color="var(--accent)" style={{ flexShrink: 0 }} />
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ============ CTA ============ */}
      <Reveal>
        <section className="abt-mission" style={{ padding: "clamp(26px, 4vw, 46px)", position: "relative", overflow: "hidden" }}>
          <div className="abt-conic" style={{ bottom: "-40%", right: "-10%", opacity: 0.18 }} />
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, maxWidth: 720 }}>
              <span className="abt-iconbox" style={{ width: 52, height: 52, borderRadius: 15 }}><Rocket size={26} strokeWidth={2} /></span>
              <div>
                <div className="abt-display" style={{ fontSize: 21, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>{vi ? "Sẵn sàng đưa AI vào công việc của bạn?" : "Ready to bring AI into your work?"}</div>
                <p style={{ margin: "8px 0 0", fontSize: 15, color: "var(--text-2)", lineHeight: 1.7 }}>
                  {vi ? "Đưa AI đến gần mọi người — để ai cũng có thể ứng dụng AI vào công việc và học tập, nếu được kèm đúng cách, đúng lúc. Nhắn tôi một câu, mình bắt đầu nhé." : "Bringing AI to everyone — anyone can apply it with the right guidance at the right time. Drop me a line and let's start."}
                </p>
              </div>
            </div>
            <a href="mailto:aihoclaptrinh@gmail.com" className="btn-primary abt-btn-glow" style={{ padding: "13px 24px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
              {vi ? "Hợp tác cùng tôi" : "Work with me"} <ArrowRight size={15} strokeWidth={2.4} />
            </a>
          </div>
        </section>
      </Reveal>
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
