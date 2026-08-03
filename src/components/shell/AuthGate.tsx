"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Lock, LogIn } from "lucide-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

type Status = "loading" | "in" | "out";

/**
 * Cổng bảo vệ: chỉ admin đã đăng nhập mới vào được app.
 * - Chưa cấu hình Supabase (chế độ demo) → bỏ qua đăng nhập.
 * - Đã cấu hình → kiểm tra phiên; chưa đăng nhập thì hiện màn hình Login.
 * Kết hợp với RLS (chỉ 'authenticated' đọc/ghi) nên đây là khóa THẬT, không
 * chỉ chặn giao diện.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>(isSupabaseConfigured ? "loading" : "in");

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supa = getSupabase();
    if (!supa) return;
    let alive = true;
    supa.auth.getSession().then(({ data }) => {
      if (alive) setStatus(data.session ? "in" : "out");
    });
    const { data: sub } = supa.auth.onAuthStateChange((_e, session) => {
      setStatus(session ? "in" : "out");
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (status === "loading") {
    return (
      <div style={centerWrap}>
        <Loader2 size={26} className="spin" color="var(--accent)" />
      </div>
    );
  }
  if (status === "out") return <LoginScreen />;
  return <>{children}</>;
}

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const supa = getSupabase();
    if (!supa) return;
    const { error } = await supa.auth.signInWithPassword({ email: email.trim(), password: pw });
    if (error) {
      setErr("Email hoặc mật khẩu không đúng. Thử lại nhé anh.");
      setBusy(false);
    }
    // Thành công: onAuthStateChange sẽ bắn → AuthGate render lại vào app.
  };

  return (
    <div style={centerWrap}>
      <div style={{ position: "fixed", inset: 0, background: "var(--bg-iris)", pointerEvents: "none" }} />
      <form onSubmit={submit} style={card}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <Image
            src="/uploads/Logo.jpeg"
            alt="AIhoclaptrinh"
            width={52}
            height={52}
            style={{ borderRadius: 14, objectFit: "cover", boxShadow: "0 4px 14px rgba(28,25,23,0.22)" }}
          />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>
              AIhoclaptrinh
            </div>
            <div style={{ fontSize: 12.5, color: "var(--text-2)", marginTop: 3, display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}>
              <Lock size={12} strokeWidth={2.2} /> Khu vực quản trị · chỉ dành cho admin
            </div>
          </div>
        </div>

        <label style={lbl}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email của anh"
          autoComplete="username"
          required
          style={inp}
        />

        <label style={{ ...lbl, marginTop: 14 }}>Mật khẩu</label>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          style={inp}
        />

        {err && (
          <div style={{ marginTop: 12, fontSize: 12.5, color: "#EF4444", fontWeight: 500 }}>{err}</div>
        )}

        <button type="submit" disabled={busy || !email || !pw} className="btn-primary" style={btn}>
          {busy ? <Loader2 size={15} className="spin" /> : <LogIn size={15} strokeWidth={2.2} />}
          {busy ? "Đang vào…" : "Đăng nhập"}
        </button>

        <div style={{ marginTop: 14, fontSize: 11.5, color: "var(--text-3)", textAlign: "center" }}>
          Dữ liệu được bảo vệ. Người chưa đăng nhập không đọc/ghi được.
        </div>
      </form>
    </div>
  );
}

const centerWrap: React.CSSProperties = {
  position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
  background: "var(--bg)", padding: 20,
};
const card: React.CSSProperties = {
  position: "relative", width: "100%", maxWidth: 380, background: "var(--surface)",
  border: "1px solid var(--border)", borderRadius: 18, padding: "30px 26px",
  boxShadow: "0 18px 50px rgba(28,25,23,0.16)",
  animation: "fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both",
};
const lbl: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 600, color: "var(--head-c)", marginBottom: 6,
};
const inp: React.CSSProperties = {
  width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid var(--border)",
  background: "var(--bg)", color: "var(--text)", fontSize: 14, outline: "none",
};
const btn: React.CSSProperties = {
  width: "100%", marginTop: 22, justifyContent: "center", padding: "11px 0", fontSize: 14,
};
